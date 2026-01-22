import type { PasswordChangeData, User } from '../types';
import api from './api';

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    insights: boolean;
    updates: boolean;
  };
  defaultDashboardView: 'grid' | 'list';
  dataRetentionDays: number;
}

// Check if demo mode is enabled
const isDemoMode = (): boolean => {
  return localStorage.getItem('is_demo') === 'true';
};

// Get demo user data
const getDemoUser = (): User | null => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

// Get default preferences
const getDefaultPreferences = (): UserPreferences => ({
  theme: 'system',
  notifications: {
    email: true,
    push: true,
    insights: true,
    updates: false,
  },
  defaultDashboardView: 'grid',
  dataRetentionDays: 365,
});

const userService = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    if (isDemoMode()) {
      const user = getDemoUser();
      if (user) return user;
      throw new Error('No user found');
    }

    const response = await api.get<User>('/users/me');
    return response.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData): Promise<User> {
    if (isDemoMode()) {
      const user = getDemoUser();
      if (!user) throw new Error('No user found');

      const updatedUser: User = {
        ...user,
        ...data,
        updated_at: new Date().toISOString(),
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    }

    const updatePayload = {
      first_name: data.first_name,
      last_name: data.last_name,
    };
    const response = await api.patch<User>('/users/me', updatePayload);

    // Update local storage
    localStorage.setItem('user', JSON.stringify(response.data));

    return response.data;
  },

  /**
   * Change user password
   */
  async changePassword(data: PasswordChangeData): Promise<void> {
    if (isDemoMode()) {
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      // In demo mode, just pretend it worked
      return;
    }

    await api.post('/auth/change-password', data);
  },

  /**
   * Request password reset email
   */
  async requestPasswordReset(email: string): Promise<void> {
    if (isDemoMode()) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return;
    }

    await api.post('/auth/forgot-password', { email });
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    if (isDemoMode()) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return;
    }

    await api.post('/auth/reset-password', {
      token,
      new_password: newPassword,
    });
  },

  /**
   * Get user preferences
   */
  async getPreferences(): Promise<UserPreferences> {
    if (isDemoMode()) {
      const stored = localStorage.getItem('user_preferences');
      return stored ? JSON.parse(stored) : getDefaultPreferences();
    }

    return getDefaultPreferences();
  },

  /**
   * Update user preferences
   */
  async updatePreferences(
    preferences: Partial<UserPreferences>,
  ): Promise<UserPreferences> {
    if (isDemoMode()) {
      const current = await this.getPreferences();
      const updated = { ...current, ...preferences };
      localStorage.setItem('user_preferences', JSON.stringify(updated));
      return updated;
    }

    throw new Error('User preferences are not supported by this API.');
  },

  /**
   * Export all user data
   */
  async exportData(): Promise<Blob> {
    if (isDemoMode()) {
      const user = getDemoUser();
      const preferences = await this.getPreferences();
      const data = {
        user,
        preferences,
        exportedAt: new Date().toISOString(),
      };
      return new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
    }

    throw new Error('Data export is not supported by this API.');
  },

  /**
   * Request account deletion
   */
  async requestAccountDeletion(): Promise<void> {
    if (isDemoMode()) {
      // Clear all local storage
      localStorage.clear();
      window.location.href = '/login';
      return;
    }

    throw new Error('Account deletion is not supported by this API.');
  },

  /**
   * Upload profile avatar
   */
  async uploadAvatar(file: File): Promise<string> {
    if (isDemoMode()) {
      // In demo mode, return a data URL
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    throw new Error('Avatar upload is not supported by this API.');
  },

  /**
   * Delete profile avatar
   */
  async deleteAvatar(): Promise<void> {
    if (isDemoMode()) {
      return;
    }

    throw new Error('Avatar deletion is not supported by this API.');
  },
};

export default userService;
