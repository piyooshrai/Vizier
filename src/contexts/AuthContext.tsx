import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, SignupData } from '../types';
import { authService, getErrorMessage } from '../services';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  loginWithDemo: () => Promise<void>;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage
  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    try {
      await authService.signup(data);
      // After successful signup, automatically log in
      await login(data.email, data.password);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }, [login]);

  const logout = useCallback(async () => {
    const isDemoMode = localStorage.getItem('is_demo') === 'true';
    try {
      // Skip API call for demo mode
      if (!isDemoMode) {
        await authService.logout();
      }
    } finally {
      localStorage.removeItem('is_demo');
      localStorage.removeItem('demo_data_loaded');
      setUser(null);
    }
  }, []);

  const loginWithDemo = useCallback(async () => {
    // Simulate a small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create a mock demo user (no API call needed)
    const demoUser = {
      id: 'demo-user-id',
      email: 'demo@vizier.health',
      first_name: 'Demo',
      last_name: 'User',
      role: 'hospital_administrator',
      created_at: new Date().toISOString(),
    };

    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(demoUser));
    localStorage.setItem('access_token', 'demo-token');
    localStorage.setItem('is_demo', 'true');
    localStorage.setItem('demo_data_loaded', 'true');

    setUser(demoUser as User);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      localStorage.setItem('user', JSON.stringify(currentUser));
    } catch (error) {
      // If refresh fails, user might need to re-login
      console.error('Failed to refresh user:', error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        loginWithDemo,
        isAuthenticated: !!user,
        isDemoMode: localStorage.getItem('is_demo') === 'true',
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
