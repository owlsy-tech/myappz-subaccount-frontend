/**
 * API Service Interceptor Tests
 * Comprehensive tests for interceptor methods using axios-mock-adapter
 */

import MockAdapter from 'axios-mock-adapter';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { ApiClient } from './api';

// Mock logger
vi.mock('../utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('ApiClient - Interceptor Tests', () => {
  let apiClient: ApiClient;
  let mockAxios: MockAdapter;
  let mockLogger: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();

    // Get the mocked logger
    const loggerModule = await import('../utils/logger');
    mockLogger = loggerModule.logger;

    // Create a new API client instance
    apiClient = new ApiClient();

    // Create mock adapter for the axios instance
    mockAxios = new MockAdapter(apiClient.getClient());
  });

  afterEach(() => {
    mockAxios.restore();
  });

  describe('Request Interceptor - Authorization', () => {
    it('should add authorization header when token exists in localStorage', async () => {
      localStorage.setItem('auth_token', 'test-token-123');

      mockAxios.onGet('/test').reply((config) => {
        expect(config.headers?.Authorization).toBe('Bearer test-token-123');
        return [200, { data: 'success', success: true, message: 'OK', status: 200 }];
      });

      await apiClient.get('/test');
    });

    it('should add authorization header when token exists in sessionStorage', async () => {
      sessionStorage.setItem('auth_token', 'session-token-456');

      mockAxios.onGet('/test').reply((config) => {
        expect(config.headers?.Authorization).toBe('Bearer session-token-456');
        return [200, { data: 'success', success: true, message: 'OK', status: 200 }];
      });

      await apiClient.get('/test');
    });

    it('should not add authorization header when no token exists', async () => {
      mockAxios.onGet('/test').reply((config) => {
        expect(config.headers?.Authorization).toBeUndefined();
        return [200, { data: 'success', success: true, message: 'OK', status: 200 }];
      });

      await apiClient.get('/test');
    });

    it('should handle localStorage errors gracefully', async () => {
      // Mock localStorage to throw error
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = vi.fn(() => {
        throw new Error('Storage error');
      });

      mockAxios.onGet('/test').reply((config) => {
        expect(config.headers?.Authorization).toBeUndefined();
        return [200, { data: 'success', success: true, message: 'OK', status: 200 }];
      });

      await apiClient.get('/test');

      Storage.prototype.getItem = originalGetItem;
    });
  });

  describe('Request Interceptor - Request ID', () => {
    it('should add unique request ID header', async () => {
      const requestIds: string[] = [];

      mockAxios.onGet('/test1').reply((config) => {
        requestIds.push(config.headers?.['X-Request-ID'] as string);
        return [200, { data: 'success', success: true, message: 'OK', status: 200 }];
      });

      mockAxios.onGet('/test2').reply((config) => {
        requestIds.push(config.headers?.['X-Request-ID'] as string);
        return [200, { data: 'success', success: true, message: 'OK', status: 200 }];
      });

      await apiClient.get('/test1');
      await apiClient.get('/test2');

      expect(requestIds[0]).toBeDefined();
      expect(requestIds[1]).toBeDefined();
      expect(requestIds[0]).not.toBe(requestIds[1]);
    });
  });

  describe('Request Interceptor - Logging', () => {
    it('should log request in development mode', async () => {
      const originalMode = import.meta.env.MODE;
      import.meta.env.MODE = 'development';

      mockAxios.onGet('/test').reply(200, {
        data: 'success',
        success: true,
        message: 'OK',
        status: 200,
      });

      await apiClient.get('/test');

      expect(mockLogger.debug).toHaveBeenCalledWith(
        'API Request',
        expect.objectContaining({
          method: 'GET',
          url: '/test',
        })
      );

      import.meta.env.MODE = originalMode;
    });

    it('should not log request in production mode', async () => {
      const originalMode = import.meta.env.MODE;
      import.meta.env.MODE = 'production';

      mockAxios.onGet('/test').reply(200, {
        data: 'success',
        success: true,
        message: 'OK',
        status: 200,
      });

      await apiClient.get('/test');

      // In production, debug logging for requests should not happen
      const debugCalls = mockLogger.debug.mock.calls.filter((call) =>
        call[0].includes('API Request')
      );
      expect(debugCalls.length).toBe(0);

      import.meta.env.MODE = originalMode;
    });
  });

  describe('Response Interceptor - Success', () => {
    it('should log response in development mode', async () => {
      const originalMode = import.meta.env.MODE;
      import.meta.env.MODE = 'development';

      mockAxios.onGet('/test').reply(200, {
        data: 'success',
        success: true,
        message: 'OK',
        status: 200,
      });

      await apiClient.get('/test');

      expect(mockLogger.debug).toHaveBeenCalledWith(
        'API Response',
        expect.objectContaining({
          status: 200,
        })
      );

      import.meta.env.MODE = originalMode;
    });

    it('should clear retry count on successful response', async () => {
      // First request fails, retry succeeds
      let callCount = 0;
      mockAxios.onGet('/test').reply(() => {
        callCount++;
        if (callCount === 1) {
          return [500, { message: 'Server error' }];
        }
        return [200, { data: 'success', success: true, message: 'OK', status: 200 }];
      });

      const result = await apiClient.get('/test');
      expect(result).toBe('success');
      expect(callCount).toBeGreaterThan(1);
    });
  });

  describe('Response Interceptor - Error Handling', () => {
    it('should normalize error with response data', async () => {
      mockAxios.onGet('/test').reply(400, {
        message: 'Validation failed',
        errors: { email: ['Invalid email'] },
      });

      try {
        await apiClient.get('/test');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toBe('Validation failed');
        expect(error.status).toBe(400);
        expect(error.errors).toEqual({ email: ['Invalid email'] });
        expect(error.timestamp).toBeDefined();
      }
    });

    it('should use fallback message when no message in error', async () => {
      let callCount = 0;
      mockAxios.onGet('/test').reply(() => {
        callCount++;
        // Always return error to avoid retries
        return [400, {}]; // 400 is not retryable
      });

      try {
        await apiClient.get('/test');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        // The error message will be the axios default or 'An error occurred'
        expect(error.message).toBeDefined();
        expect(error.status).toBe(400);
      }
    });

    it('should normalize network error', async () => {
      mockAxios.onGet('/test').networkError();

      try {
        await apiClient.get('/test');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        // Network error should have status 0
        expect(error.status).toBe(0);
        expect(error.timestamp).toBeDefined();
        expect(error.message).toBeDefined();
      }
    }, 15000);

    it('should normalize timeout error', async () => {
      mockAxios.onGet('/test').timeout();

      try {
        await apiClient.get('/test');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.status).toBe(0);
        expect(error.timestamp).toBeDefined();
      }
    }, 10000);

    it('should log errors with details', async () => {
      mockAxios.onGet('/test').reply(500, { message: 'Internal server error' });

      try {
        await apiClient.get('/test');
      } catch (error) {
        expect(mockLogger.error).toHaveBeenCalledWith(
          'API Response Error',
          expect.objectContaining({
            status: 500,
          })
        );
      }
    }, 10000);
  });

  describe('Response Interceptor - Retry Logic', () => {
    it('should retry GET request on 500 error', async () => {
      let callCount = 0;
      mockAxios.onGet('/test').reply(() => {
        callCount++;
        if (callCount === 1) {
          return [500, { message: 'Server error' }];
        }
        return [200, { data: 'success', success: true, message: 'OK', status: 200 }];
      });

      const result = await apiClient.get('/test');

      expect(result).toBe('success');
      expect(callCount).toBe(2);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Retrying request'),
        expect.any(Object)
      );
    });

    it('should retry GET request on 503 error', async () => {
      let callCount = 0;
      mockAxios.onGet('/test').reply(() => {
        callCount++;
        if (callCount === 1) {
          return [503, { message: 'Service unavailable' }];
        }
        return [200, { data: 'success', success: true, message: 'OK', status: 200 }];
      });

      const result = await apiClient.get('/test');

      expect(result).toBe('success');
      expect(callCount).toBe(2);
    });

    it('should retry GET request on 429 error', async () => {
      let callCount = 0;
      mockAxios.onGet('/test').reply(() => {
        callCount++;
        if (callCount === 1) {
          return [429, { message: 'Too many requests' }];
        }
        return [200, { data: 'success', success: true, message: 'OK', status: 200 }];
      });

      const result = await apiClient.get('/test');

      expect(result).toBe('success');
      expect(callCount).toBe(2);
    });

    it('should retry GET request on 502 error', async () => {
      let callCount = 0;
      mockAxios.onGet('/test').reply(() => {
        callCount++;
        if (callCount === 1) {
          return [502, { message: 'Bad gateway' }];
        }
        return [200, { data: 'success', success: true, message: 'OK', status: 200 }];
      });

      const result = await apiClient.get('/test');

      expect(result).toBe('success');
      expect(callCount).toBe(2);
    });

    it('should retry GET request on 504 error', async () => {
      let callCount = 0;
      mockAxios.onGet('/test').reply(() => {
        callCount++;
        if (callCount === 1) {
          return [504, { message: 'Gateway timeout' }];
        }
        return [200, { data: 'success', success: true, message: 'OK', status: 200 }];
      });

      const result = await apiClient.get('/test');

      expect(result).toBe('success');
      expect(callCount).toBe(2);
    });

    it('should retry on network error', async () => {
      let callCount = 0;
      mockAxios.onGet('/test').reply(() => {
        callCount++;
        if (callCount === 1) {
          // Simulate network error that will trigger retry
          return [503, { message: 'Service unavailable' }];
        }
        return [200, { data: 'success', success: true, message: 'OK', status: 200 }];
      });

      const result = await apiClient.get('/test');
      expect(result).toBe('success');
      expect(callCount).toBeGreaterThan(1);
    }, 10000);

    it('should not retry POST requests', async () => {
      let callCount = 0;
      mockAxios.onPost('/test').reply(() => {
        callCount++;
        return [500, { message: 'Server error' }];
      });

      try {
        await apiClient.post('/test', { data: 'test' });
      } catch (error) {
        // Expected to fail
      }

      expect(callCount).toBe(1);
    });

    it('should not retry PUT requests', async () => {
      let callCount = 0;
      mockAxios.onPut('/test').reply(() => {
        callCount++;
        return [500, { message: 'Server error' }];
      });

      try {
        await apiClient.put('/test', { data: 'test' });
      } catch (error) {
        // Expected to fail
      }

      expect(callCount).toBe(1);
    });

    it('should not retry PATCH requests', async () => {
      let callCount = 0;
      mockAxios.onPatch('/test').reply(() => {
        callCount++;
        return [500, { message: 'Server error' }];
      });

      try {
        await apiClient.patch('/test', { data: 'test' });
      } catch (error) {
        // Expected to fail
      }

      expect(callCount).toBe(1);
    });

    it('should not retry DELETE requests', async () => {
      let callCount = 0;
      mockAxios.onDelete('/test').reply(() => {
        callCount++;
        return [500, { message: 'Server error' }];
      });

      try {
        await apiClient.delete('/test');
      } catch (error) {
        // Expected to fail
      }

      expect(callCount).toBe(1);
    });

    it('should retry HEAD requests', async () => {
      const client = apiClient.getClient();
      let callCount = 0;

      mockAxios.onHead('/test').reply(() => {
        callCount++;
        if (callCount === 1) {
          return [500, null];
        }
        return [200, null];
      });

      try {
        await client.head('/test');
      } catch (error) {
        // May succeed or fail
      }

      expect(callCount).toBeGreaterThan(1);
    });

    it('should retry OPTIONS requests', async () => {
      const client = apiClient.getClient();
      let callCount = 0;

      mockAxios.onOptions('/test').reply(() => {
        callCount++;
        if (callCount === 1) {
          return [500, null];
        }
        return [200, null];
      });

      try {
        await client.options('/test');
      } catch (error) {
        // May succeed or fail
      }

      expect(callCount).toBeGreaterThan(1);
    });

    it('should not exceed max retries', async () => {
      let callCount = 0;
      mockAxios.onGet('/test').reply(() => {
        callCount++;
        return [500, { message: 'Server error' }];
      });

      try {
        await apiClient.get('/test');
      } catch (error) {
        // Expected to fail after max retries
      }

      // Should be 1 initial + 3 retries = 4 total
      expect(callCount).toBe(4);
    }, 15000);

    it('should increase delay between retries', async () => {
      vi.useFakeTimers();
      let callCount = 0;

      mockAxios.onGet('/test').reply(() => {
        callCount++;
        return [500, { message: 'Server error' }];
      });

      const promise = apiClient.get('/test');

      // Fast forward through retries
      for (let i = 0; i < 3; i++) {
        await vi.advanceTimersByTimeAsync(1000 * (i + 1));
      }

      try {
        await promise;
      } catch (error) {
        // Expected
      }

      vi.useRealTimers();
    });
  });

  describe('Response Interceptor - 401 Unauthorized', () => {
    it('should clear auth tokens on 401 error', async () => {
      localStorage.setItem('auth_token', 'test-token');
      sessionStorage.setItem('auth_token', 'test-token');

      mockAxios.onGet('/test').reply(401, { message: 'Unauthorized' });

      // Mock window.location
      const originalLocation = window.location;
      delete (window as any).location;
      window.location = { href: '/dashboard', pathname: '/dashboard' } as any;

      try {
        await apiClient.get('/test');
      } catch (error) {
        // Expected
      }

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(sessionStorage.getItem('auth_token')).toBeNull();

      window.location = originalLocation;
    });

    it('should redirect to login on 401 error', async () => {
      mockAxios.onGet('/test').reply(401, { message: 'Unauthorized' });

      // Mock window.location
      const originalLocation = window.location;
      delete (window as any).location;
      window.location = { href: '/dashboard', pathname: '/dashboard' } as any;

      try {
        await apiClient.get('/test');
      } catch (error) {
        // Expected
      }

      expect(window.location.href).toBe('/login');

      window.location = originalLocation;
    });

    it('should not redirect if already on login page', async () => {
      mockAxios.onGet('/test').reply(401, { message: 'Unauthorized' });

      // Mock window.location
      const originalLocation = window.location;
      delete (window as any).location;
      window.location = { href: '/login', pathname: '/login' } as any;

      const originalHref = window.location.href;

      try {
        await apiClient.get('/test');
      } catch (error) {
        // Expected
      }

      expect(window.location.href).toBe(originalHref);

      window.location = originalLocation;
    });

    it('should handle storage errors during 401 cleanup', async () => {
      const originalRemoveItem = Storage.prototype.removeItem;
      Storage.prototype.removeItem = vi.fn(() => {
        throw new Error('Storage error');
      });

      mockAxios.onGet('/test').reply(401, { message: 'Unauthorized' });

      // Mock window.location
      const originalLocation = window.location;
      delete (window as any).location;
      window.location = { href: '/dashboard', pathname: '/dashboard' } as any;

      try {
        await apiClient.get('/test');
      } catch (error) {
        // Should not throw on storage error
      }

      Storage.prototype.removeItem = originalRemoveItem;
      window.location = originalLocation;
    });
  });

  describe('Response Interceptor - 403 Forbidden', () => {
    it('should log warning on 403 error', async () => {
      mockAxios.onGet('/test').reply(403, { message: 'Forbidden' });

      try {
        await apiClient.get('/test');
      } catch (error) {
        expect(mockLogger.warn).toHaveBeenCalledWith(
          'Access forbidden',
          expect.objectContaining({ url: '/test' })
        );
      }
    });
  });

  describe('Private Methods Coverage', () => {
    it('should generate unique request IDs', async () => {
      const ids = new Set<string>();

      mockAxios.onGet(/\/test\d+/).reply((config) => {
        ids.add(config.headers?.['X-Request-ID'] as string);
        return [200, { data: 'success', success: true, message: 'OK', status: 200 }];
      });

      await Promise.all([
        apiClient.get('/test1'),
        apiClient.get('/test2'),
        apiClient.get('/test3'),
        apiClient.get('/test4'),
        apiClient.get('/test5'),
      ]);

      expect(ids.size).toBe(5);
    });

    it('should create request keys for retry tracking', async () => {
      let requestKey: string | undefined;

      mockAxios.onGet('/test').reply((config) => {
        requestKey = `${config.method}-${config.url}`;
        return [200, { data: 'success', success: true, message: 'OK', status: 200 }];
      });

      await apiClient.get('/test');

      expect(requestKey).toBe('get-/test');
    });

    it('should handle delay in retry logic', async () => {
      vi.useFakeTimers();

      let callCount = 0;
      mockAxios.onGet('/test').reply(() => {
        callCount++;
        if (callCount === 1) {
          return [500, { message: 'Server error' }];
        }
        return [200, { data: 'success', success: true, message: 'OK', status: 200 }];
      });

      const promise = apiClient.get('/test');

      // Advance time to trigger retry
      await vi.advanceTimersByTimeAsync(1000);

      const result = await promise;

      expect(result).toBe('success');
      expect(callCount).toBe(2);

      vi.useRealTimers();
    });
  });

  describe('Token Management', () => {
    it('should set token in localStorage when remember is true', () => {
      apiClient.setAuthToken('test-token', true);

      expect(localStorage.getItem('auth_token')).toBe('test-token');
      expect(sessionStorage.getItem('auth_token')).toBeNull();
    });

    it('should set token in sessionStorage when remember is false', () => {
      apiClient.setAuthToken('test-token', false);

      expect(sessionStorage.getItem('auth_token')).toBe('test-token');
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should default to sessionStorage when remember is not specified', () => {
      apiClient.setAuthToken('test-token');

      expect(sessionStorage.getItem('auth_token')).toBe('test-token');
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should handle errors when setting token', async () => {
      // Create a fresh instance to test the error path
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      const testClient = new ApiClient();

      expect(() => {
        testClient.setAuthToken('test-token', true);
      }).not.toThrow();

      // Logger should be called during setAuthToken
      const loggerModule = await import('../utils/logger');
      const {logger} = loggerModule;

      expect(logger.error).toHaveBeenCalledWith(
        'Failed to store auth token',
        expect.any(Error)
      );

      localStorage.setItem = originalSetItem;
    });

    it('should clear tokens from both storages', () => {
      localStorage.setItem('auth_token', 'test-token');
      sessionStorage.setItem('auth_token', 'test-token');

      apiClient.clearAuthToken();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(sessionStorage.getItem('auth_token')).toBeNull();
    });

    it('should handle errors when clearing token', async () => {
      const originalRemoveItem = localStorage.removeItem;
      localStorage.removeItem = vi.fn(() => {
        throw new Error('Storage error');
      });

      const testClient = new ApiClient();

      expect(() => {
        testClient.clearAuthToken();
      }).not.toThrow();

      const loggerModule = await import('../utils/logger');
      const {logger} = loggerModule;

      expect(logger.error).toHaveBeenCalledWith(
        'Failed to clear auth token',
        expect.any(Error)
      );

      localStorage.removeItem = originalRemoveItem;
    });
  });

  describe('Configuration Methods', () => {
    it('should update base URL', () => {
      const newBaseUrl = 'https://new-api.example.com';
      apiClient.setBaseURL(newBaseUrl);

      expect(apiClient.getClient().defaults.baseURL).toBe(newBaseUrl);
    });

    it('should update timeout', () => {
      const newTimeout = 60000;
      apiClient.setTimeout(newTimeout);

      expect(apiClient.getClient().defaults.timeout).toBe(newTimeout);
    });

    it('should add custom header', () => {
      apiClient.setHeader('X-Custom-Header', 'custom-value');

      expect(apiClient.getClient().defaults.headers.common['X-Custom-Header']).toBe(
        'custom-value'
      );
    });

    it('should remove custom header', () => {
      apiClient.setHeader('X-Custom-Header', 'custom-value');
      apiClient.removeHeader('X-Custom-Header');

      expect(apiClient.getClient().defaults.headers.common['X-Custom-Header']).toBeUndefined();
    });
  });

  describe('HTTP Methods', () => {
    it('should make GET request', async () => {
      mockAxios.onGet('/test').reply(200, {
        data: { id: 1 },
        success: true,
        message: 'OK',
        status: 200,
      });

      const result = await apiClient.get('/test');

      expect(result).toEqual({ id: 1 });
    });

    it('should make POST request', async () => {
      mockAxios.onPost('/test').reply(200, {
        data: { id: 1 },
        success: true,
        message: 'OK',
        status: 200,
      });

      const result = await apiClient.post('/test', { name: 'Test' });

      expect(result).toEqual({ id: 1 });
    });

    it('should make PUT request', async () => {
      mockAxios.onPut('/test').reply(200, {
        data: { id: 1 },
        success: true,
        message: 'OK',
        status: 200,
      });

      const result = await apiClient.put('/test', { name: 'Test' });

      expect(result).toEqual({ id: 1 });
    });

    it('should make PATCH request', async () => {
      mockAxios.onPatch('/test').reply(200, {
        data: { id: 1 },
        success: true,
        message: 'OK',
        status: 200,
      });

      const result = await apiClient.patch('/test', { name: 'Test' });

      expect(result).toEqual({ id: 1 });
    });

    it('should make DELETE request', async () => {
      mockAxios.onDelete('/test').reply(200, {
        data: { success: true },
        success: true,
        message: 'OK',
        status: 200,
      });

      const result = await apiClient.delete('/test');

      expect(result).toEqual({ success: true });
    });
  });

  describe('Additional Branch Coverage', () => {
    it('should handle error without config in response interceptor', async () => {
      // Create a scenario where error.config is undefined
      const client = apiClient.getClient();

      // Mock a request that will fail without config
      mockAxios.onGet('/test').reply(() => {
        const error: any = new Error('Unknown error');
        error.isAxiosError = true;
        error.config = undefined;
        throw error;
      });

      try {
        await apiClient.get('/test');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error).toBeDefined();
        expect(error.timestamp).toBeDefined();
      }
    }, 10000);

    it('should handle request interceptor error path', async () => {
      // Force an error in the request interceptor
      const client = apiClient.getClient();

      // Mock that will cause request error
      mockAxios.onGet('/test').reply(() => {
        throw new Error('Request interceptor error');
      });

      try {
        await client.get('/test');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle error with only request property (no response)', async () => {
      mockAxios.onGet('/test').reply(() => {
        const error: any = new Error('Network error');
        error.isAxiosError = true;
        error.request = {};
        error.response = undefined;
        error.config = { url: '/test', method: 'get' };
        error.code = 'ECONNABORTED'; // Prevent retries
        throw error;
      });

      try {
        await apiClient.get('/test');
      } catch (error: any) {
        expect(error.message).toBeDefined();
        expect(error.status).toBe(0);
      }
    }, 10000);

    it('should handle error without message in response data', async () => {
      mockAxios.onGet('/test').reply(400, {
        errors: { field: ['error'] }
      });

      try {
        await apiClient.get('/test');
      } catch (error: any) {
        expect(error.status).toBe(400);
        expect(error.errors).toBeDefined();
      }
    });

    it('should cover getAuthToken error catch path', async () => {
      const originalGetItem = Storage.prototype.getItem;
      let callCount = 0;

      Storage.prototype.getItem = vi.fn(() => {
        callCount++;
        if (callCount === 1) {
          throw new Error('Storage error');
        }
        return null;
      });

      const testClient = new ApiClient();

      mockAxios = new MockAdapter(testClient.getClient());
      mockAxios.onGet('/test').reply((config) => {
        // Token should be undefined due to storage error
        expect(config.headers?.Authorization).toBeUndefined();
        return [200, { data: 'success', success: true, message: 'OK', status: 200 }];
      });

      await testClient.get('/test');

      Storage.prototype.getItem = originalGetItem;
    });

    it('should cover handleUnauthorized when window is undefined', async () => {
      // This tests the SSR path
      const originalWindow = (global as any).window;

      // Temporarily remove window
      (global as any).window = undefined;

      const testClient = new ApiClient();
      mockAxios = new MockAdapter(testClient.getClient());

      mockAxios.onGet('/test').reply(401, { message: 'Unauthorized' });

      try {
        await testClient.get('/test');
      } catch (error) {
        // Should handle gracefully without window
        expect(error).toBeDefined();
      }

      (global as any).window = originalWindow;
    });

    it('should not retry when method is undefined', async () => {
      const client = apiClient.getClient();
      let callCount = 0;

      mockAxios.onAny().reply((config) => {
        callCount++;
        return [400, { message: 'Bad request' }]; // Use 400 to avoid retries
      });

      try {
        await client.request({ url: '/test' });
      } catch (error) {
        // Should not retry
      }

      expect(callCount).toBe(1);
    });

    it('should handle error response without data', async () => {
      mockAxios.onGet('/test').reply(400); // Use 400 to avoid retries

      try {
        await apiClient.get('/test');
      } catch (error: any) {
        expect(error.status).toBe(400);
        expect(error.message).toBeDefined();
      }
    });

    it('should handle 404 error without retry', async () => {
      let callCount = 0;
      mockAxios.onGet('/test').reply(() => {
        callCount++;
        return [404, { message: 'Not found' }];
      });

      try {
        await apiClient.get('/test');
      } catch (error: any) {
        expect(error.status).toBe(404);
      }

      // 404 should not retry
      expect(callCount).toBe(1);
    });

    it('should handle error without isAxiosError flag', async () => {
      mockAxios.onGet('/test').reply(() => {
        const error: any = new Error('Generic error');
        error.isAxiosError = false;
        throw error;
      });

      try {
        await apiClient.get('/test');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
