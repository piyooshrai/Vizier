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
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/signup')
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

// Helper function to transform technical errors into user-friendly messages
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError | undefined;

    // Map technical errors to healthcare-friendly messages
    const errorMap: Record<string, string> = {
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

    if (apiError?.detail) {
      return errorMap[apiError.detail] || apiError.detail;
    }

    if (error.message) {
      for (const [key, value] of Object.entries(errorMap)) {
        if (error.message.toLowerCase().includes(key.toLowerCase())) {
          return value;
        }
      }
      return error.message;
    }

    return 'Something went wrong. Please try again.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
}

export default api;
