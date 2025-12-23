/**
 * Mock API Handlers
 * MSW (Mock Service Worker) handlers for API mocking in tests
 */

import { http, HttpResponse } from 'msw';

import {
  mockUser,
  mockAuthResponse,
  mockApiSuccessResponse,
  mockValidationErrorResponse,
  mockUnauthorizedError,
  mockNotFoundError,
  createMockApiResponse,
  createMockUsers,
  createMockPaginatedResponse,
} from './mockData';

const API_BASE_URL = 'https://api.test.example.com';

/**
 * Authentication Handlers
 */
export const authHandlers = [
  // Login
  http.post(`${API_BASE_URL}/api/auth/login`, async ({ request }) => {
    const body = (await request.json()) as any;
    const { email, password } = body;

    // Simulate validation error
    if (!email || !password) {
      return HttpResponse.json(mockValidationErrorResponse, { status: 422 });
    }

    // Simulate invalid credentials
    if (email !== 'test@example.com' || password !== 'password123') {
      return HttpResponse.json(mockUnauthorizedError, { status: 401 });
    }

    // Successful login
    return HttpResponse.json(createMockApiResponse(mockAuthResponse), { status: 200 });
  }),

  // Register
  http.post(`${API_BASE_URL}/api/auth/register`, async ({ request }) => {
    const body = (await request.json()) as any;
    const { email, username, password } = body;

    // Simulate validation error
    if (!email || !username || !password) {
      return HttpResponse.json(mockValidationErrorResponse, { status: 422 });
    }

    // Simulate duplicate user
    if (email === 'taken@example.com' || username === 'takenuser') {
      return HttpResponse.json(
        {
          message: 'User already exists',
          status: 409,
          timestamp: new Date().toISOString(),
        },
        { status: 409 }
      );
    }

    // Successful registration
    return HttpResponse.json(
      createMockApiResponse({
        user: { ...mockUser, email, username },
        token: mockAuthResponse.token,
      }),
      { status: 201 }
    );
  }),

  // Logout
  http.post(`${API_BASE_URL}/api/auth/logout`, () => {
    return HttpResponse.json(createMockApiResponse({ message: 'Logged out successfully' }), {
      status: 200,
    });
  }),

  // Refresh Token
  http.post(`${API_BASE_URL}/api/auth/refresh`, async ({ request }) => {
    const body = (await request.json()) as any;
    const { refreshToken } = body;

    if (!refreshToken || refreshToken !== mockAuthResponse.refreshToken) {
      return HttpResponse.json(mockUnauthorizedError, { status: 401 });
    }

    return HttpResponse.json(
      createMockApiResponse({
        token: 'new-mock-token',
        refreshToken: 'new-refresh-token',
        expiresIn: 3600,
      }),
      { status: 200 }
    );
  }),

  // Forgot Password
  http.post(`${API_BASE_URL}/api/auth/forgot-password`, async ({ request }) => {
    const body = (await request.json()) as any;
    const { email } = body;

    if (!email) {
      return HttpResponse.json(mockValidationErrorResponse, { status: 422 });
    }

    return HttpResponse.json(createMockApiResponse({ message: 'Password reset email sent' }), {
      status: 200,
    });
  }),

  // Reset Password
  http.post(`${API_BASE_URL}/api/auth/reset-password`, async ({ request }) => {
    const body = (await request.json()) as any;
    const { token, password } = body;

    if (!token || !password) {
      return HttpResponse.json(mockValidationErrorResponse, { status: 422 });
    }

    return HttpResponse.json(createMockApiResponse({ message: 'Password reset successful' }), {
      status: 200,
    });
  }),
];

/**
 * User Handlers
 */
export const userHandlers = [
  // Get current user profile
  http.get(`${API_BASE_URL}/api/users/profile`, ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(mockUnauthorizedError, { status: 401 });
    }

    return HttpResponse.json(createMockApiResponse(mockUser), { status: 200 });
  }),

  // Update user profile
  http.put(`${API_BASE_URL}/api/users/profile`, async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(mockUnauthorizedError, { status: 401 });
    }

    const body = (await request.json()) as any;
    const updatedUser = { ...mockUser, ...body };

    return HttpResponse.json(createMockApiResponse(updatedUser), { status: 200 });
  }),

  // Get user by ID
  http.get(`${API_BASE_URL}/api/users/:id`, ({ params }) => {
    const { id } = params;

    if (id === '123') {
      return HttpResponse.json(createMockApiResponse(mockUser), { status: 200 });
    }

    return HttpResponse.json(mockNotFoundError, { status: 404 });
  }),

  // Get all users (with pagination)
  http.get(`${API_BASE_URL}/api/users`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
    const search = url.searchParams.get('search') || '';

    let users = createMockUsers(25);

    // Filter by search
    if (search) {
      users = users.filter(
        (u) =>
          u.username.includes(search) ||
          u.email.includes(search) ||
          u.firstName.includes(search) ||
          u.lastName.includes(search)
      );
    }

    // Paginate
    const total = users.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = users.slice(startIndex, endIndex);

    return HttpResponse.json(createMockPaginatedResponse(paginatedUsers, page, pageSize, total), {
      status: 200,
    });
  }),

  // Delete user
  http.delete(`${API_BASE_URL}/api/users/:id`, ({ params, request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(mockUnauthorizedError, { status: 401 });
    }

    const { id } = params;

    if (id === '123') {
      return HttpResponse.json(createMockApiResponse({ message: 'User deleted successfully' }), {
        status: 200,
      });
    }

    return HttpResponse.json(mockNotFoundError, { status: 404 });
  }),
];

/**
 * Health Check Handlers
 */
export const healthHandlers = [
  http.get(`${API_BASE_URL}/api/health`, () => {
    return HttpResponse.json(
      createMockApiResponse({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: 3600,
      }),
      { status: 200 }
    );
  }),
];

/**
 * File Upload Handlers
 */
export const fileHandlers = [
  http.post(`${API_BASE_URL}/api/files/upload`, async ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(mockUnauthorizedError, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return HttpResponse.json(
        {
          message: 'No file provided',
          status: 400,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      createMockApiResponse({
        fileId: 'file-123',
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        url: `https://cdn.example.com/files/${file.name}`,
        uploadedAt: new Date().toISOString(),
      }),
      { status: 201 }
    );
  }),
];

/**
 * Error Simulation Handlers
 */
export const errorHandlers = [
  // Network error simulation
  http.get(`${API_BASE_URL}/api/error/network`, () => {
    return HttpResponse.error();
  }),

  // Timeout simulation
  http.get(`${API_BASE_URL}/api/error/timeout`, async () => {
    await new Promise((resolve) => setTimeout(resolve, 35000));
    return HttpResponse.json(mockApiSuccessResponse);
  }),

  // Server error
  http.get(`${API_BASE_URL}/api/error/server`, () => {
    return HttpResponse.json(
      {
        message: 'Internal server error',
        status: 500,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }),

  // Rate limit error
  http.get(`${API_BASE_URL}/api/error/rate-limit`, () => {
    return HttpResponse.json(
      {
        message: 'Too many requests',
        status: 429,
        timestamp: new Date().toISOString(),
        retryAfter: 60,
      },
      { status: 429 }
    );
  }),
];

/**
 * All handlers combined
 */
export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...healthHandlers,
  ...fileHandlers,
  ...errorHandlers,
];

/**
 * Export individual handler groups
 */
export default handlers;
