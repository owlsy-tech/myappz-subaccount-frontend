/**
 * API Service Unit Tests
 * Comprehensive test coverage for the API client service
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import * as API_CONST from '../constants/api.const';

import { api, ApiClient } from './api';

import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Mock axios
vi.mock('axios', () => {
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    request: vi.fn(),
    interceptors: {
      request: {
        use: vi.fn(),
        eject: vi.fn(),
      },
      response: {
        use: vi.fn(),
        eject: vi.fn(),
      },
    },
    defaults: {
      baseURL: 'https://api.test.com',
      timeout: 30000,
      headers: {
        common: {},
      },
    },
  };

  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
    },
  };
});

// Mock logger
vi.mock('../utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('ApiClient', () => {
  let apiClient: ApiClient;

  // Helper functions
  const createMockAxiosResponse = <T>(data: T, status = 200) => ({
    data: { data, success: true, message: 'Success', status },
    status,
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  });

  const createMockAxiosError = (
    message: string,
    status?: number,
    data?: unknown
  ): AxiosError => {
    const error = new Error(message) as AxiosError;
    error.isAxiosError = true;
    error.name = 'AxiosError';
    error.message = message;
    error.config = {
      url: '/test',
      method: 'get',
      headers: {} as any,
    } as InternalAxiosRequestConfig;

    if (status) {
      error.response = {
        data,
        status,
        statusText: 'Error',
        headers: {},
        config: error.config,
      };
    } else {
      error.request = {};
    }

    return error;
  };

  beforeEach(() => {
    apiClient = new ApiClient();
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Initialization', () => {
    it('should create an instance with default configuration', () => {
      expect(apiClient).toBeInstanceOf(ApiClient);
      expect(apiClient.getClient()).toBeDefined();
    });

    it('should setup request and response interceptors', () => {
      const client = apiClient.getClient();
      expect(client.interceptors.request).toBeDefined();
      expect(client.interceptors.response).toBeDefined();
    });

    it('should provide access to axios client instance', () => {
      const client = apiClient.getClient();
      expect(client).toHaveProperty('get');
      expect(client).toHaveProperty('post');
      expect(client).toHaveProperty('put');
      expect(client).toHaveProperty('patch');
      expect(client).toHaveProperty('delete');
    });
  });

  describe('GET Requests', () => {
    it('should make a successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      const client = apiClient.getClient();
      vi.mocked(client.get).mockResolvedValueOnce(createMockAxiosResponse(mockData));

      const result = await apiClient.get('/test');

      expect(client.get).toHaveBeenCalledWith('/test', undefined);
      expect(result).toEqual(mockData);
    });

    it('should pass config to GET request', async () => {
      const mockData = { items: [] };
      const config = { params: { page: 1, limit: 10 } };
      const client = apiClient.getClient();
      vi.mocked(client.get).mockResolvedValueOnce(createMockAxiosResponse(mockData));

      await apiClient.get('/items', config);

      expect(client.get).toHaveBeenCalledWith('/items', config);
    });

    it('should handle GET request errors', async () => {
      const client = apiClient.getClient();
      const error = createMockAxiosError('Not found', 404, { message: 'Resource not found' });
      vi.mocked(client.get).mockRejectedValueOnce(error);

      await expect(apiClient.get('/test')).rejects.toThrow();
    });

    it('should support typed GET requests', async () => {
      interface User {
        id: number;
        name: string;
      }
      const mockData: User = { id: 1, name: 'Test' };
      const client = apiClient.getClient();
      vi.mocked(client.get).mockResolvedValueOnce(createMockAxiosResponse(mockData));

      const result = await apiClient.get<User>('/users/1');

      expect(result).toEqual(mockData);
      expect(result.id).toBe(1);
    });
  });

  describe('POST Requests', () => {
    it('should make a successful POST request', async () => {
      const mockData = { id: 1, name: 'Created' };
      const postData = { name: 'New Item' };
      const client = apiClient.getClient();
      vi.mocked(client.post).mockResolvedValueOnce(createMockAxiosResponse(mockData));

      const result = await apiClient.post('/items', postData);

      expect(client.post).toHaveBeenCalledWith('/items', postData, undefined);
      expect(result).toEqual(mockData);
    });

    it('should make POST request without data', async () => {
      const mockData = { success: true };
      const client = apiClient.getClient();
      vi.mocked(client.post).mockResolvedValueOnce(createMockAxiosResponse(mockData));

      const result = await apiClient.post('/action');

      expect(client.post).toHaveBeenCalledWith('/action', undefined, undefined);
      expect(result).toEqual(mockData);
    });

    it('should pass config to POST request', async () => {
      const mockData = { id: 1 };
      const postData = { name: 'Test' };
      const config = { headers: { 'X-Custom-Header': 'value' } };
      const client = apiClient.getClient();
      vi.mocked(client.post).mockResolvedValueOnce(createMockAxiosResponse(mockData));

      await apiClient.post('/items', postData, config);

      expect(client.post).toHaveBeenCalledWith('/items', postData, config);
    });

    it('should handle POST validation errors', async () => {
      const validationErrors = {
        name: ['Name is required'],
        email: ['Email is invalid'],
      };
      const client = apiClient.getClient();
      const error = createMockAxiosError('Validation failed', 422, {
        message: 'Validation failed',
        errors: validationErrors,
      });
      vi.mocked(client.post).mockRejectedValueOnce(error);

      await expect(apiClient.post('/items', {})).rejects.toThrow();
    });
  });

  describe('PUT Requests', () => {
    it('should make a successful PUT request', async () => {
      const mockData = { id: 1, name: 'Updated' };
      const putData = { name: 'Updated Item' };
      const client = apiClient.getClient();
      vi.mocked(client.put).mockResolvedValueOnce(createMockAxiosResponse(mockData));

      const result = await apiClient.put('/items/1', putData);

      expect(client.put).toHaveBeenCalledWith('/items/1', putData, undefined);
      expect(result).toEqual(mockData);
    });

    it('should pass config to PUT request', async () => {
      const mockData = { id: 1 };
      const putData = { name: 'Test' };
      const config = { params: { force: true } };
      const client = apiClient.getClient();
      vi.mocked(client.put).mockResolvedValueOnce(createMockAxiosResponse(mockData));

      await apiClient.put('/items/1', putData, config);

      expect(client.put).toHaveBeenCalledWith('/items/1', putData, config);
    });

    it('should handle PUT request errors', async () => {
      const client = apiClient.getClient();
      const error = createMockAxiosError('Conflict', 409, { message: 'Resource conflict' });
      vi.mocked(client.put).mockRejectedValueOnce(error);

      await expect(apiClient.put('/items/1', {})).rejects.toThrow();
    });
  });

  describe('PATCH Requests', () => {
    it('should make a successful PATCH request', async () => {
      const mockData = { id: 1, name: 'Patched' };
      const patchData = { name: 'Patched Item' };
      const client = apiClient.getClient();
      vi.mocked(client.patch).mockResolvedValueOnce(createMockAxiosResponse(mockData));

      const result = await apiClient.patch('/items/1', patchData);

      expect(client.patch).toHaveBeenCalledWith('/items/1', patchData, undefined);
      expect(result).toEqual(mockData);
    });

    it('should pass config to PATCH request', async () => {
      const mockData = { id: 1 };
      const patchData = { status: 'active' };
      const config = { headers: { 'X-Partial-Update': 'true' } };
      const client = apiClient.getClient();
      vi.mocked(client.patch).mockResolvedValueOnce(createMockAxiosResponse(mockData));

      await apiClient.patch('/items/1', patchData, config);

      expect(client.patch).toHaveBeenCalledWith('/items/1', patchData, config);
    });

    it('should handle PATCH request errors', async () => {
      const client = apiClient.getClient();
      const error = createMockAxiosError('Bad Request', 400, { message: 'Invalid data' });
      vi.mocked(client.patch).mockRejectedValueOnce(error);

      await expect(apiClient.patch('/items/1', {})).rejects.toThrow();
    });
  });

  describe('DELETE Requests', () => {
    it('should make a successful DELETE request', async () => {
      const mockData = { success: true, message: 'Deleted' };
      const client = apiClient.getClient();
      vi.mocked(client.delete).mockResolvedValueOnce(createMockAxiosResponse(mockData));

      const result = await apiClient.delete('/items/1');

      expect(client.delete).toHaveBeenCalledWith('/items/1', undefined);
      expect(result).toEqual(mockData);
    });

    it('should pass config to DELETE request', async () => {
      const mockData = { success: true };
      const config = { params: { cascade: true } };
      const client = apiClient.getClient();
      vi.mocked(client.delete).mockResolvedValueOnce(createMockAxiosResponse(mockData));

      await apiClient.delete('/items/1', config);

      expect(client.delete).toHaveBeenCalledWith('/items/1', config);
    });

    it('should handle DELETE request errors', async () => {
      const client = apiClient.getClient();
      const error = createMockAxiosError('Not found', 404, { message: 'Item not found' });
      vi.mocked(client.delete).mockRejectedValueOnce(error);

      await expect(apiClient.delete('/items/999')).rejects.toThrow();
    });
  });

  describe('Authentication Token Management', () => {
    it('should set auth token in localStorage when remember is true', () => {
      const token = 'test-token-123';
      apiClient.setAuthToken(token, true);

      expect(localStorage.getItem('auth_token')).toBe(token);
      expect(sessionStorage.getItem('auth_token')).toBeNull();
    });

    it('should set auth token in sessionStorage when remember is false', () => {
      const token = 'session-token-456';
      apiClient.setAuthToken(token, false);

      expect(sessionStorage.getItem('auth_token')).toBe(token);
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should default to sessionStorage when remember is not specified', () => {
      const token = 'default-token';
      apiClient.setAuthToken(token);

      expect(sessionStorage.getItem('auth_token')).toBe(token);
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should clear auth token from both storages', () => {
      localStorage.setItem('auth_token', 'local-token');
      sessionStorage.setItem('auth_token', 'session-token');

      apiClient.clearAuthToken();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(sessionStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('Configuration Methods', () => {
    it('should update base URL', () => {
      const newBaseUrl = 'https://new-api.example.com';
      const client = apiClient.getClient();

      apiClient.setBaseURL(newBaseUrl);

      expect(client.defaults.baseURL).toBe(newBaseUrl);
    });

    it('should update timeout', () => {
      const newTimeout = 60000;
      const client = apiClient.getClient();

      apiClient.setTimeout(newTimeout);

      expect(client.defaults.timeout).toBe(newTimeout);
    });

    it('should add custom header', () => {
      const client = apiClient.getClient();

      apiClient.setHeader('X-Custom-Header', 'custom-value');

      expect(client.defaults.headers.common['X-Custom-Header']).toBe('custom-value');
    });

    it('should remove custom header', () => {
      const client = apiClient.getClient();
      client.defaults.headers.common['X-Custom-Header'] = 'value';

      apiClient.removeHeader('X-Custom-Header');

      expect(client.defaults.headers.common['X-Custom-Header']).toBeUndefined();
    });

    it('should allow multiple custom headers', () => {
      const client = apiClient.getClient();

      apiClient.setHeader('X-Header-1', 'value1');
      apiClient.setHeader('X-Header-2', 'value2');
      apiClient.setHeader('X-Header-3', 'value3');

      expect(client.defaults.headers.common['X-Header-1']).toBe('value1');
      expect(client.defaults.headers.common['X-Header-2']).toBe('value2');
      expect(client.defaults.headers.common['X-Header-3']).toBe('value3');
    });
  });

  describe('Singleton Instance', () => {
    it('should export a singleton api instance', () => {
      expect(api).toBeInstanceOf(ApiClient);
    });

    it('should allow creating custom instances', () => {
      const customClient = new ApiClient();

      expect(customClient).toBeInstanceOf(ApiClient);
      expect(customClient).not.toBe(api);
    });
  });

  describe('Edge Cases', () => {
    it('should handle responses with null data', async () => {
      const client = apiClient.getClient();
      vi.mocked(client.get).mockResolvedValueOnce(createMockAxiosResponse(null));

      const result = await apiClient.get('/test');

      expect(result).toBeNull();
    });

    it('should handle empty array responses', async () => {
      const client = apiClient.getClient();
      vi.mocked(client.get).mockResolvedValueOnce(createMockAxiosResponse([]));

      const result = await apiClient.get('/items');

      expect(result).toEqual([]);
    });

    it('should handle empty object responses', async () => {
      const client = apiClient.getClient();
      vi.mocked(client.get).mockResolvedValueOnce(createMockAxiosResponse({}));

      const result = await apiClient.get('/test');

      expect(result).toEqual({});
    });

    it('should handle concurrent requests', async () => {
      const mockData1 = { id: 1 };
      const mockData2 = { id: 2 };
      const mockData3 = { id: 3 };
      const client = apiClient.getClient();

      vi.mocked(client.get)
        .mockResolvedValueOnce(createMockAxiosResponse(mockData1))
        .mockResolvedValueOnce(createMockAxiosResponse(mockData2))
        .mockResolvedValueOnce(createMockAxiosResponse(mockData3));

      const [result1, result2, result3] = await Promise.all([
        apiClient.get('/endpoint1'),
        apiClient.get('/endpoint2'),
        apiClient.get('/endpoint3'),
      ]);

      expect(result1).toEqual(mockData1);
      expect(result2).toEqual(mockData2);
      expect(result3).toEqual(mockData3);
    });

    it('should handle mixed success and error in concurrent requests', async () => {
      const mockData = { id: 1 };
      const error = createMockAxiosError('Error', 500, {});
      const client = apiClient.getClient();

      vi.mocked(client.get)
        .mockResolvedValueOnce(createMockAxiosResponse(mockData))
        .mockRejectedValueOnce(error);

      const results = await Promise.allSettled([
        apiClient.get('/success'),
        apiClient.get('/error'),
      ]);

      expect(results[0].status).toBe('fulfilled');
      expect(results[1].status).toBe('rejected');
    });
  });

  describe('TypeScript Generic Support', () => {
    interface User {
      id: number;
      name: string;
      email: string;
    }

    it('should support typed GET requests', async () => {
      const mockUser: User = { id: 1, name: 'Test', email: 'test@example.com' };
      const client = apiClient.getClient();
      vi.mocked(client.get).mockResolvedValueOnce(createMockAxiosResponse(mockUser));

      const result = await apiClient.get<User>('/users/1');

      expect(result).toEqual(mockUser);
      expect(result.id).toBe(1);
      expect(result.name).toBe('Test');
    });

    it('should support typed POST requests', async () => {
      const mockUser: User = { id: 1, name: 'Test', email: 'test@example.com' };
      const client = apiClient.getClient();
      vi.mocked(client.post).mockResolvedValueOnce(createMockAxiosResponse(mockUser));

      const result = await apiClient.post<User>('/users', {
        name: 'Test',
        email: 'test@example.com',
      });

      expect(result).toEqual(mockUser);
    });

    it('should support typed PUT requests', async () => {
      const mockUser: User = { id: 1, name: 'Updated', email: 'updated@example.com' };
      const client = apiClient.getClient();
      vi.mocked(client.put).mockResolvedValueOnce(createMockAxiosResponse(mockUser));

      const result = await apiClient.put<User>('/users/1', { name: 'Updated' });

      expect(result).toEqual(mockUser);
    });

    it('should support typed PATCH requests', async () => {
      const mockUser: User = { id: 1, name: 'Patched', email: 'patched@example.com' };
      const client = apiClient.getClient();
      vi.mocked(client.patch).mockResolvedValueOnce(createMockAxiosResponse(mockUser));

      const result = await apiClient.patch<User>('/users/1', { name: 'Patched' });

      expect(result).toEqual(mockUser);
    });

    it('should support typed DELETE requests', async () => {
      const mockResult = { success: true, count: 0 };
      const client = apiClient.getClient();
      vi.mocked(client.delete).mockResolvedValueOnce(createMockAxiosResponse(mockResult));

      const result = await apiClient.delete<{ success: boolean; count: number }>('/users/1');

      expect(result).toEqual(mockResult);
    });

    it('should support array type responses', async () => {
      const mockUsers: User[] = [
        { id: 1, name: 'User1', email: 'user1@example.com' },
        { id: 2, name: 'User2', email: 'user2@example.com' },
      ];
      const client = apiClient.getClient();
      vi.mocked(client.get).mockResolvedValueOnce(createMockAxiosResponse(mockUsers));

      const result = await apiClient.get<User[]>('/users');

      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(2);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete authentication flow', async () => {
      const client = apiClient.getClient();

      // Login request
      const loginData = { username: 'testuser', password: 'password123' };
      const authResponse = { token: 'auth-token-123', user: { id: 1, name: 'Test' } };
      vi.mocked(client.post).mockResolvedValueOnce(createMockAxiosResponse(authResponse));

      const loginResult = await apiClient.post<{ token: string; user: { id: number; name: string } }>('/auth/login', loginData);

      // Store token
      apiClient.setAuthToken(loginResult.token, true);

      // Make authenticated request
      const userData = { id: 1, name: 'Test', email: 'test@example.com' };
      vi.mocked(client.get).mockResolvedValueOnce(createMockAxiosResponse(userData));

      const userResult = await apiClient.get('/user/profile');

      expect(localStorage.getItem('auth_token')).toBe('auth-token-123');
      expect(userResult).toEqual(userData);
    });

    it('should handle pagination requests', async () => {
      const client = apiClient.getClient();
      const paginatedData = {
        items: [{ id: 1 }, { id: 2 }],
        page: 1,
        total: 100,
        hasNext: true,
      };
      vi.mocked(client.get).mockResolvedValueOnce(createMockAxiosResponse(paginatedData));

      const result = await apiClient.get('/items', {
        params: { page: 1, limit: 10 },
      });

      expect(result).toEqual(paginatedData);
      expect(client.get).toHaveBeenCalledWith(
        '/items',
        expect.objectContaining({
          params: { page: 1, limit: 10 },
        })
      );
    });

    it('should handle file upload requests', async () => {
      const client = apiClient.getClient();
      const formData = new FormData();
      formData.append('file', new Blob(['test']), 'test.txt');

      const uploadResponse = { fileId: '123', url: 'https://cdn.example.com/test.txt' };
      vi.mocked(client.post).mockResolvedValueOnce(createMockAxiosResponse(uploadResponse));

      const result = await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      expect(result).toEqual(uploadResponse);
    });

    it('should handle search requests with filters', async () => {
      const client = apiClient.getClient();
      const searchResults = {
        results: [{ id: 1, title: 'Result 1' }],
        total: 1,
      };
      vi.mocked(client.get).mockResolvedValueOnce(createMockAxiosResponse(searchResults));

      const result = await apiClient.get('/search', {
        params: {
          q: 'test query',
          category: 'docs',
          sortBy: 'relevance',
        },
      });

      expect(result).toEqual(searchResults);
    });
  });

  describe('Error Handling', () => {
    it('should handle 400 Bad Request errors', async () => {
      const client = apiClient.getClient();
      const error = createMockAxiosError('Bad Request', 400, { message: 'Invalid input' });
      vi.mocked(client.post).mockRejectedValueOnce(error);

      await expect(apiClient.post('/items', {})).rejects.toThrow();
    });

    it('should handle 401 Unauthorized errors', async () => {
      const client = apiClient.getClient();
      const error = createMockAxiosError('Unauthorized', 401, { message: 'Token expired' });
      vi.mocked(client.get).mockRejectedValueOnce(error);

      await expect(apiClient.get('/protected')).rejects.toThrow();
    });

    it('should handle 403 Forbidden errors', async () => {
      const client = apiClient.getClient();
      const error = createMockAxiosError('Forbidden', 403, { message: 'Access denied' });
      vi.mocked(client.get).mockRejectedValueOnce(error);

      await expect(apiClient.get('/admin')).rejects.toThrow();
    });

    it('should handle 404 Not Found errors', async () => {
      const client = apiClient.getClient();
      const error = createMockAxiosError('Not found', 404, { message: 'Resource not found' });
      vi.mocked(client.get).mockRejectedValueOnce(error);

      await expect(apiClient.get('/unknown')).rejects.toThrow();
    });

    it('should handle 422 Validation errors with field errors', async () => {
      const validationErrors = {
        email: ['Email is required', 'Email must be valid'],
        password: ['Password must be at least 8 characters'],
      };
      const client = apiClient.getClient();
      const error = createMockAxiosError('Validation failed', 422, {
        message: 'Validation failed',
        errors: validationErrors,
      });
      vi.mocked(client.post).mockRejectedValueOnce(error);

      await expect(apiClient.post('/users', {})).rejects.toThrow();
    });

    it('should handle 500 Server errors', async () => {
      const client = apiClient.getClient();
      const error = createMockAxiosError('Server error', 500, {
        message: 'Internal server error',
      });
      vi.mocked(client.get).mockRejectedValueOnce(error);

      await expect(apiClient.get('/test')).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      const client = apiClient.getClient();
      const error = createMockAxiosError('Network error');
      vi.mocked(client.get).mockRejectedValueOnce(error);

      await expect(apiClient.get('/test')).rejects.toThrow();
    });
  });

  describe('Performance', () => {
    it('should handle rapid sequential requests', async () => {
      const mockData = { id: 1 };
      const client = apiClient.getClient();
      vi.mocked(client.get).mockResolvedValue(createMockAxiosResponse(mockData));

      const promises = Array.from({ length: 20 }, (_, i) => apiClient.get(`/item/${i}`));

      const results = await Promise.all(promises);

      expect(results).toHaveLength(20);
      expect(client.get).toHaveBeenCalledTimes(20);
    });

    it('should handle different request types concurrently', async () => {
      const client = apiClient.getClient();
      vi.mocked(client.get).mockResolvedValue(createMockAxiosResponse({ data: 'get' }));
      vi.mocked(client.post).mockResolvedValue(createMockAxiosResponse({ data: 'post' }));
      vi.mocked(client.put).mockResolvedValue(createMockAxiosResponse({ data: 'put' }));
      vi.mocked(client.delete).mockResolvedValue(createMockAxiosResponse({ data: 'delete' }));

      await Promise.all([
        apiClient.get('/resource'),
        apiClient.post('/resource', {}),
        apiClient.put('/resource/1', {}),
        apiClient.delete('/resource/1'),
      ]);

      expect(client.get).toHaveBeenCalled();
      expect(client.post).toHaveBeenCalled();
      expect(client.put).toHaveBeenCalled();
      expect(client.delete).toHaveBeenCalled();
    });
  });

  describe('Additional Coverage Tests', () => {
    it('should handle token from sessionStorage', () => {
      sessionStorage.setItem('auth_token', 'session-token');
      const testClient = new ApiClient();

      expect(testClient).toBeInstanceOf(ApiClient);
    });

    it('should handle missing token', () => {
      localStorage.clear();
      sessionStorage.clear();
      const testClient = new ApiClient();

      expect(testClient).toBeInstanceOf(ApiClient);
    });

    it('should call setAuthToken with remember flag', () => {
      apiClient.setAuthToken('test-token', true);
      expect(localStorage.getItem('auth_token')).toBe('test-token');

      localStorage.clear();
      apiClient.setAuthToken('test-token', false);
      expect(sessionStorage.getItem('auth_token')).toBe('test-token');
    });

    it('should handle getAuthToken returning null', () => {
      localStorage.clear();
      sessionStorage.clear();

      const testClient = new ApiClient();
      expect(testClient).toBeInstanceOf(ApiClient);
    });
  });

  describe('Auth Token Helpers', () => {
    it('should handle localStorage errors when setting token', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      expect(() => {
        apiClient.setAuthToken('test-token', true);
      }).not.toThrow();

      localStorage.setItem = originalSetItem;
    });

    it('should handle sessionStorage errors when setting token', () => {
      const originalSetItem = sessionStorage.setItem;
      sessionStorage.setItem = vi.fn(() => {
        throw new Error('Storage not available');
      });

      expect(() => {
        apiClient.setAuthToken('test-token', false);
      }).not.toThrow();

      sessionStorage.setItem = originalSetItem;
    });

    it('should handle localStorage errors when clearing token', () => {
      const originalRemoveItem = localStorage.removeItem;
      localStorage.removeItem = vi.fn(() => {
        throw new Error('Storage error');
      });

      expect(() => {
        apiClient.clearAuthToken();
      }).not.toThrow();

      localStorage.removeItem = originalRemoveItem;
    });
  });
});
