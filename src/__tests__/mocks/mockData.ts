/**
 * Mock Data Factory
 * Centralized mock data for testing components and services
 */

import { vi } from 'vitest';

import type { IApiResponse, IApiError, IPaginatedResponse } from '../../types/api.types';

/**
 * Mock Component Props
 */

/**
 * Mock User Data
 */
export const mockUser = {
  id: '123',
  username: 'testuser',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'user',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockAdminUser = {
  ...mockUser,
  id: '456',
  username: 'adminuser',
  email: 'admin@example.com',
  role: 'admin',
};

/**
 * Mock Authentication Data
 */
export const mockAuthToken = 'mock-jwt-token-abc123';

export const mockAuthResponse = {
  token: mockAuthToken,
  refreshToken: 'mock-refresh-token-xyz789',
  expiresIn: 3600,
  user: mockUser,
};

/**
 * Mock Registration Data
 */
export const mockRegistrationData = {
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
  email: 'john.doe@example.com',
  password: 'SecurePass123!',
  confirmPassword: 'SecurePass123!',
  phoneNumber: '+1234567890',
  acceptTerms: true,
};

export const mockInvalidRegistrationData = {
  firstName: '',
  lastName: '',
  username: 'ab',
  email: 'invalid-email',
  password: 'weak',
  confirmPassword: 'different',
  phoneNumber: '123',
  acceptTerms: false,
};

/**
 * Mock API Responses
 */
export const createMockApiResponse = <T>(data: T): IApiResponse<T> => ({
  success: true,
  data,
  message: 'Success',
  status: 200,
});

export const createMockApiError = (
  message: string,
  status: number,
  errors?: Record<string, string[]>
): IApiError => ({
  message,
  status,
  errors,
  timestamp: new Date().toISOString(),
});

/**
 * Common mock API responses
 */
export const mockApiSuccessResponse = createMockApiResponse({ message: 'Operation successful' });

export const mockApiErrorResponse = createMockApiError('An error occurred', 500);

export const mockValidationErrorResponse = createMockApiError('Validation failed', 422, {
  email: ['Invalid email format'],
  password: ['Password must be at least 8 characters'],
});

export const mockUnauthorizedError = createMockApiError('Unauthorized', 401);

export const mockForbiddenError = createMockApiError('Forbidden', 403);

export const mockNotFoundError = createMockApiError('Resource not found', 404);

export const mockNetworkError = createMockApiError('Network error', 0);

/**
 * Mock Paginated Data
 */
export const createMockPaginatedResponse = <T>(
  items: T[],
  page: number = 1,
  pageSize: number = 10,
  total: number = items.length
): IPaginatedResponse<T> => {
  return {
    data: items,
    pagination: {
      page,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      hasNext: page * pageSize < total,
      hasPrev: page > 1,
    },
  };
};

/**
 * Mock Form Data
 */
export const mockFormData = {
  valid: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    username: 'johndoe',
    password: 'SecurePass123!',
  },
  invalid: {
    firstName: '',
    lastName: '',
    email: 'invalid',
    username: 'ab',
    password: 'weak',
  },
};

/**
 * Mock File Data
 */
export const mockFile = new File(['file content'], 'test.txt', { type: 'text/plain' });

export const mockImageFile = new File(['image content'], 'test.png', { type: 'image/png' });

export const mockPdfFile = new File(['pdf content'], 'test.pdf', { type: 'application/pdf' });

/**
 * Mock Dates
 */
export const mockDates = {
  past: '2020-01-01T00:00:00.000Z',
  present: new Date().toISOString(),
  future: '2030-01-01T00:00:00.000Z',
};

/**
 * Mock Error Objects
 */
export const mockError = new Error('Test error message');

export const mockNetworkErrorObject = Object.assign(new Error('Network Error'), {
  code: 'NETWORK_ERROR',
});

export const mockTimeoutError = Object.assign(new Error('Request timeout'), {
  code: 'ECONNABORTED',
});

/**
 * Mock Store Data
 */
export const mockUserStoreState = {
  user: mockUser,
  isAuthenticated: true,
  isLoading: false,
  error: null,
};

export const mockEmptyUserStoreState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const mockLoadingUserStoreState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const mockErrorUserStoreState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: 'Failed to load user',
};

/**
 * Mock Analytics Events
 */
export const mockAnalyticsEvent = {
  name: 'button_click',
  category: 'engagement',
  label: 'submit_form',
  value: 1,
  timestamp: Date.now(),
};

/**
 * Mock Performance Metrics
 */
export const mockPerformanceMetrics = {
  FCP: 1500,
  LCP: 2500,
  FID: 100,
  CLS: 0.1,
  TTFB: 500,
};

/**
 * Mock Local Storage Data
 */
export const mockLocalStorageData = {
  auth_token: mockAuthToken,
  user_preferences: JSON.stringify({
    theme: 'dark',
    language: 'en',
    notifications: true,
  }),
  recent_searches: JSON.stringify(['search1', 'search2', 'search3']),
};

/**
 * Mock Session Storage Data
 */
export const mockSessionStorageData = {
  temp_token: 'temp-token-123',
  form_data: JSON.stringify({
    step: 2,
    data: { firstName: 'John', lastName: 'Doe' },
  }),
};

/**
 * Mock API Endpoints
 */
export const mockApiEndpoints = {
  login: '/api/auth/login',
  register: '/api/auth/register',
  logout: '/api/auth/logout',
  profile: '/api/users/profile',
  users: '/api/users',
  posts: '/api/posts',
  comments: '/api/comments',
};

/**
 * Mock Headers
 */
export const mockHeaders = {
  authorization: `Bearer ${mockAuthToken}`,
  'content-type': 'application/json',
  'x-request-id': 'test-request-id',
};

/**
 * Mock Request Config
 */
export const mockRequestConfig = {
  baseURL: 'https://api.test.example.com',
  timeout: 30000,
  headers: mockHeaders,
};

/**
 * Mock Validation Errors
 */
export const mockValidationErrors = {
  email: ['Invalid email format', 'Email is required'],
  password: ['Password must be at least 8 characters', 'Password must contain uppercase'],
  username: ['Username is taken', 'Username must be at least 3 characters'],
};

export const mockButtonProps = {
  onClick: vi.fn(),
  disabled: false,
  loading: false,
  variant: 'primary' as const,
  size: 'medium' as const,
};

export const mockInputProps = {
  value: '',
  onChange: vi.fn(),
  onBlur: vi.fn(),
  onFocus: vi.fn(),
  disabled: false,
  error: undefined,
  placeholder: 'Enter value',
};

export const mockModalProps = {
  isOpen: false,
  onClose: vi.fn(),
  title: 'Test Modal',
  children: 'Modal content',
};

/**
 * Mock Router Props
 */
export const mockRouterProps = {
  navigate: vi.fn(),
  location: {
    pathname: '/',
    search: '',
    hash: '',
    state: null,
  },
  params: {},
};

/**
 * Mock Environment Variables
 */
export const mockEnv = {
  VITE_API_BASE_URL: 'https://api.test.example.com',
  VITE_API_TIMEOUT: '30000',
  VITE_ENV: 'test',
  MODE: 'test',
  DEV: false,
  PROD: false,
  SSR: false,
};

/**
 * Factory Functions
 */

/**
 * Create mock user with custom properties
 */
export const createMockUser = (overrides?: Partial<typeof mockUser>) => ({
  ...mockUser,
  ...overrides,
});

/**
 * Create mock array of users
 */
export const createMockUsers = (count: number = 5) => {
  return Array.from({ length: count }, (_, index) =>
    createMockUser({
      id: `user-${index + 1}`,
      username: `user${index + 1}`,
      email: `user${index + 1}@example.com`,
    })
  );
};

/**
 * Create mock API delay (for testing loading states)
 */
export const createMockApiDelay = (ms: number = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Create mock promise that rejects
 */
export const createMockRejectedPromise = (error: any = mockError) => {
  return Promise.reject(error);
};

/**
 * Create mock promise that resolves
 */
export const createMockResolvedPromise = <T>(data: T) => {
  return Promise.resolve(data);
};

/**
 * Create mock axios response
 */
export const createMockAxiosResponse = <T>(data: T, status: number = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: mockRequestConfig as any,
});

/**
 * Create mock axios error
 */
export const createMockAxiosError = (message: string, status?: number, data?: any) => {
  const error: any = new Error(message);
  error.isAxiosError = true;
  error.config = mockRequestConfig;

  if (status && data) {
    error.response = {
      data,
      status,
      statusText: 'Error',
      headers: {},
      config: mockRequestConfig,
    };
  } else {
    error.request = {};
  }

  return error;
};

/**
 * Export all mocks as a namespace
 */
export const MockData = {
  user: mockUser,
  adminUser: mockAdminUser,
  authToken: mockAuthToken,
  authResponse: mockAuthResponse,
  registrationData: mockRegistrationData,
  invalidRegistrationData: mockInvalidRegistrationData,
  apiSuccessResponse: mockApiSuccessResponse,
  apiErrorResponse: mockApiErrorResponse,
  validationErrorResponse: mockValidationErrorResponse,
  file: mockFile,
  imageFile: mockImageFile,
  pdfFile: mockPdfFile,
  dates: mockDates,
  error: mockError,
  userStoreState: mockUserStoreState,
  emptyUserStoreState: mockEmptyUserStoreState,
  loadingUserStoreState: mockLoadingUserStoreState,
  errorUserStoreState: mockErrorUserStoreState,
  analyticsEvent: mockAnalyticsEvent,
  performanceMetrics: mockPerformanceMetrics,
  localStorageData: mockLocalStorageData,
  sessionStorageData: mockSessionStorageData,
  apiEndpoints: mockApiEndpoints,
  headers: mockHeaders,
  requestConfig: mockRequestConfig,
  validationErrors: mockValidationErrors,
  buttonProps: mockButtonProps,
  inputProps: mockInputProps,
  modalProps: mockModalProps,
  routerProps: mockRouterProps,
  env: mockEnv,
};
