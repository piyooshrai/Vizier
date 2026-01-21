import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 120000, // 2 minutes for long queries
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');

      // Only redirect if not already on auth pages
      if (
        !globalThis.location.pathname.includes('/login') &&
        !globalThis.location.pathname.includes('/signup')
      ) {
        globalThis.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
// Map technical errors to healthcare-friendly messages
const ERROR_MAP: Record<string, string> = {
  'Invalid credentials': 'The email or password you entered is incorrect.',
  'Email already registered': 'An account with this email already exists.',
  'Token expired': 'Your session has expired. Please log in again.',
  'Invalid token': 'Your session is invalid. Please log in again.',
  'Connection refused':
    "I'm having trouble connecting. Please try again in a moment.",
  'Network Error':
    "I'm having trouble connecting. Please check your internet connection.",
  timeout: 'This request is taking longer than expected. Please try again.',
};

// Extract messages from FastAPI validation error array
function parseValidationErrors(
  detail: Array<{ msg?: string }>,
): string {
  const messages = detail.map((err) => err.msg || 'Validation error').join(', ');
  return messages || 'Validation failed';
}

// Try to match error message against known error patterns
function matchErrorMessage(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  for (const [key, value] of Object.entries(ERROR_MAP)) {
    if (lowerMessage.includes(key.toLowerCase())) {
      return value;
    }
  }
  return null;
}

// Helper function to transform technical errors into user-friendly messages
export function getErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : 'An unexpected error occurred.';
  }

  const apiError = error.response?.data as ApiError | undefined;

  // Handle FastAPI validation errors
  if (apiError?.detail) {
    if (Array.isArray(apiError.detail)) {
      return parseValidationErrors(apiError.detail);
    }
    if (typeof apiError.detail === 'string') {
      return ERROR_MAP[apiError.detail] || apiError.detail;
    }
  }

  // Try to match against known error patterns
  if (error.message) {
    return matchErrorMessage(error.message) || error.message;
  }

  return 'Something went wrong. Please try again.';
}

export default api;
