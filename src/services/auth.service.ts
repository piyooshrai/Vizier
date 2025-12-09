import api from './api';
import { SignupData, LoginData, AuthResponse, User, PasswordChangeData } from '../types';

export const authService = {
  signup: async (data: SignupData): Promise<User> => {
    const response = await api.post<User>('/auth/signup', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    const { access_token, user } = response.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
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
    return !!localStorage.getItem('access_token');
  },

  // Helper to get stored user
  getStoredUser: (): User | null => {
    const userJson = localStorage.getItem('user');
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
};

export default authService;
