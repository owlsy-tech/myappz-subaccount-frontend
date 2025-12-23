/**
 * API Service
 * Centralized HTTP client with interceptors, error handling, and retry logic
 */

/* eslint-disable class-methods-use-this, no-param-reassign, @typescript-eslint/no-unsafe-assignment */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

import * as API_CONST from '../constants/api.const';
import { logger } from '../utils/logger';

import type { IApiResponse, IApiError } from '../types/api.types';

/**
 * API Configuration
 */
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

/**
 * Retry configuration
 */
const RETRY_CONFIG = {
  maxRetries: API_CONST.MAX_RETRIES,
  retryDelay: API_CONST.RETRY_DELAY,
  retryableStatuses: API_CONST.RETRYABLE_STATUS,
};

/**
 * API Client Class
 */
class ApiClient {
  private client: AxiosInstance;

  private retryCount: Map<string, number> = new Map();

  constructor() {
    this.client = axios.create(API_CONFIG);
    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      this.handleRequest.bind(this),
      this.handleRequestError.bind(this)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      this.handleResponse.bind(this),
      this.handleResponseError.bind(this)
    );
  }

  /**
   * Handle outgoing requests
   */
  private handleRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    // Add authentication token if available
    const token = this.getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    const requestId = this.generateRequestId();
    if (config.headers) {
      config.headers['X-Request-ID'] = requestId;
    }

    // Log request in development
    if (import.meta.env.MODE === 'development') {
      logger.debug('API Request', {
        method: config.method?.toUpperCase(),
        url: config.url,
        params: config.params,
        data: config.data,
      });
    }

    return config;
  }

  /**
   * Handle request errors
   */
  private handleRequestError(error: AxiosError): Promise<AxiosError> {
    logger.error('API Request Error', error);
    return Promise.reject(error);
  }

  /**
   * Handle successful responses
   */
  private handleResponse<T>(response: AxiosResponse<T>): AxiosResponse<T> {
    // Log response in development
    if (import.meta.env.MODE === 'development') {
      logger.debug('API Response', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    // Clear retry count on success
    const requestKey = this.getRequestKey(response.config);
    this.retryCount.delete(requestKey);

    return response;
  }

  /**
   * Handle response errors with retry logic
   */
  private async handleResponseError(error: AxiosError): Promise<unknown> {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(this.normalizeError(error));
    }

    // Check if request should be retried
    if (this.shouldRetry(error, originalRequest)) {
      const requestKey = this.getRequestKey(originalRequest);
      const currentRetries = this.retryCount.get(requestKey) || 0;

      if (currentRetries < RETRY_CONFIG.maxRetries) {
        this.retryCount.set(requestKey, currentRetries + 1);

        // Wait before retrying
        await this.delay(RETRY_CONFIG.retryDelay * (currentRetries + 1));

        logger.warn(`Retrying request (attempt ${currentRetries + 1}/${RETRY_CONFIG.maxRetries})`, {
          url: originalRequest.url,
          method: originalRequest.method,
        });

        return this.client.request(originalRequest);
      }
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      this.handleUnauthorized();
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      logger.warn('Access forbidden', { url: originalRequest.url });
    }

    // Log error
    logger.error('API Response Error', {
      status: error.response?.status,
      url: originalRequest.url,
      message: error.message,
      data: error.response?.data,
    });

    return Promise.reject(this.normalizeError(error));
  }

  /**
   * Check if request should be retried
   */
  private shouldRetry(error: AxiosError, config: AxiosRequestConfig): boolean {
    const status = error.response?.status;
    const method = config.method?.toUpperCase();

    // Only retry safe methods
    if (method && !['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return false;
    }

    // Check if status is retryable
    if (status && RETRY_CONFIG.retryableStatuses.includes(status)) {
      return true;
    }

    // Retry on network errors
    if (!error.response && error.code !== 'ECONNABORTED') {
      return true;
    }

    return false;
  }

  /**
   * Normalize error to standard format
   */
  private normalizeError(error: AxiosError): IApiError {
    const timestamp = new Date().toISOString();

    if (error.response) {
      // Server responded with error
      const data = error.response.data as { message?: string; errors?: Record<string, string[]> };
      return {
        message: data?.message || error.message || 'An error occurred',
        status: error.response.status,
        errors: data?.errors,
        timestamp,
      };
    }

    if (error.request) {
      // Request made but no response
      return {
        message: 'No response from server. Please check your connection.',
        status: 0,
        timestamp,
      };
    }

    // Request setup error
    return {
      message: error.message || 'Failed to make request',
      status: 0,
      timestamp,
    };
  }

  /**
   * Get authentication token from storage
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;

    try {
      return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    } catch (error) {
      return null;
    }
  }

  /**
   * Handle unauthorized access
   */
  private handleUnauthorized(): void {
    // Clear auth token
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_token');
      } catch (error) {
        // Ignore storage errors
      }
    }

    // Redirect to login (if not already there)
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get unique request key for retry tracking
   */
  private getRequestKey(config: AxiosRequestConfig): string {
    return `${config.method}-${config.url}`;
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  /**
   * GET request
   */
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<IApiResponse<T>>(url, config);
    return response.data.data;
  }

  /**
   * POST request
   */
  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<IApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  /**
   * PUT request
   */
  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<IApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<IApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<IApiResponse<T>>(url, config);
    return response.data.data;
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string, remember = false): void {
    if (typeof window === 'undefined') return;

    try {
      if (remember) {
        localStorage.setItem('auth_token', token);
      } else {
        sessionStorage.setItem('auth_token', token);
      }
    } catch (error) {
      logger.error('Failed to store auth token', error);
    }
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
    } catch (error) {
      logger.error('Failed to clear auth token', error);
    }
  }

  /**
   * Get Axios instance for advanced usage
   */
  getClient(): AxiosInstance {
    return this.client;
  }

  /**
   * Update base URL
   */
  setBaseURL(url: string): void {
    this.client.defaults.baseURL = url;
  }

  /**
   * Update timeout
   */
  setTimeout(timeout: number): void {
    this.client.defaults.timeout = timeout;
  }

  /**
   * Add custom header
   */
  setHeader(key: string, value: string): void {
    this.client.defaults.headers.common[key] = value;
  }

  /**
   * Remove custom header
   */
  removeHeader(key: string): void {
    delete this.client.defaults.headers.common[key];
  }
}

/**
 * Export singleton instance
 */
export const api = new ApiClient();

/**
 * Export class for custom instances
 */
export { ApiClient };
