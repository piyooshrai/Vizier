import type {
  AuthResponse,
  LoginData,
  PasswordChangeData,
  SignupData,
  User,
} from '../types';
import {
  REFRESH_TOKEN_KEY,
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
} from '../utils/constants';
import api from './api';

export const authService = {
  signup: async (data: SignupData): Promise<User> => {
    const response = await api.post<User>('/auth/signup', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    const { access_token, refresh_token, user } = response.data;
    localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
    if (refresh_token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
    }
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  changePassword: async (data: PasswordChangeData): Promise<void> => {
    await api.post('/auth/change-password', data);
  },

  // Helper to check if user is logged in
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  // Helper to get stored user
  getStoredUser: (): User | null => {
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  },

  // Password recovery
  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await api.post('/auth/reset-password', {
      token,
      new_password: newPassword,
    });
  },

  revokeAllSessions: async (): Promise<void> => {
    await api.post('/auth/revoke-all-sessions');
  },
};

export default authService;
