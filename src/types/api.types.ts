/**
 * API Types
 * Common types for API requests and responses
 */

export interface IApiResponse<T = unknown> {
  data: T;
  message: string;
  status: number;
  success: boolean;
}

export interface IApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
  timestamp: string;
}

export interface IPaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface IApiRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  withCredentials?: boolean;
}

export type THttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface IApiEndpoint {
  method: THttpMethod;
  url: string;
  description?: string;
}
