import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '../types';
import {
  MAX_FILE_SIZE,
  REFRESH_TOKEN_KEY,
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
} from '../utils/constants';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://vizier-dev.the-algo.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 120000, // 2 minutes for long queries
  headers: {
    'Content-Type': 'application/json',
  },
});

const authApi = axios.create({
  baseURL: API_URL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
});

type RefreshResponse = {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
};

const authPaths = [
  '/auth/login',
  '/auth/signup',
  '/auth/refresh',
  '/auth/logout',
];

const isAuthRoute = (url?: string) =>
  !!url && authPaths.some((path) => url.includes(path));

const redirectToLoginIfNeeded = () => {
  if (
    !globalThis.location.pathname.includes('/login') &&
    !globalThis.location.pathname.includes('/signup')
  ) {
    globalThis.location.href = '/login';
  }
};

const clearSession = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
};

const setTokens = (accessToken: string, refreshToken?: string) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await authApi.post<RefreshResponse>('/auth/refresh', {
    refresh_token: refreshToken,
  });

  const { access_token, refresh_token } = response.data;
  if (!access_token) {
    throw new Error('No access token returned from refresh');
  }

  setTokens(access_token, refresh_token);
  return access_token;
};

// Request interceptor - add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
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
  async (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      const originalConfig = error.config as
        | (InternalAxiosRequestConfig & { _retry?: boolean })
        | undefined;
      const isDemoMode = localStorage.getItem('is_demo') === 'true';

      if (isDemoMode || isAuthRoute(originalConfig?.url)) {
        clearSession();
        redirectToLoginIfNeeded();
        return Promise.reject(error);
      }

      if (!originalConfig || originalConfig._retry) {
        clearSession();
        redirectToLoginIfNeeded();
        return Promise.reject(error);
      }

      originalConfig._retry = true;

      try {
        refreshPromise = refreshPromise ?? refreshAccessToken();
        const newAccessToken = await refreshPromise;
        refreshPromise = null;

        if (originalConfig.headers) {
          originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return api(originalConfig);
      } catch (refreshError) {
        refreshPromise = null;
        clearSession();
        redirectToLoginIfNeeded();
        return Promise.reject(refreshError);
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
function parseValidationErrors(detail: Array<{ msg?: string }>): string {
  const messages = detail
    .map((err) => err.msg || 'Validation error')
    .join(', ');
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
    return error instanceof Error
      ? error.message
      : 'An unexpected error occurred.';
  }

  const apiError = error.response?.data as ApiError | undefined;
  const status = error.response?.status;
  if (status === 413) {
    const readableLimit =
      MAX_FILE_SIZE < 1024 * 1024
        ? `${Math.round(MAX_FILE_SIZE / 1024)} KB`
        : `${Math.round(MAX_FILE_SIZE / (1024 * 1024))} MB`;
    return `Upload is too large. Please keep files under ${readableLimit}.`;
  }

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
