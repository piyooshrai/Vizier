import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService, getErrorMessage } from '../services';
import type { LoginData, PasswordChangeData, SignupData } from '../types';

/**
 * Hook for login mutation using TanStack Query
 */
export const useLoginMutation = () => {
  const navigate = useNavigate();
  const { setSession } = useAuth();

  return useMutation({
    mutationFn: (data: LoginData) => authService.login(data),
    onSuccess: (response) => {
      setSession(response.user);
      navigate('/dashboard');
    },
    onError: (error) => {
      // Error is handled by the component via mutation.error
      console.error('Login failed:', getErrorMessage(error));
    },
  });
};

/**
 * Hook for signup mutation using TanStack Query
 */
export const useSignupMutation = () => {
  const navigate = useNavigate();
  const { setSession } = useAuth();

  return useMutation({
    mutationFn: async (data: SignupData) => {
      // First signup
      await authService.signup({
        ...data,
        is_active: true,
      });
      // Then login to get the token
      const loginResponse = await authService.login({
        email: data.email,
        password: data.password,
      });
      return loginResponse;
    },
    onSuccess: (response) => {
      setSession(response.user);
      navigate('/upload');
    },
    onError: (error) => {
      console.error('Signup failed:', getErrorMessage(error));
    },
  });
};

/**
 * Hook for logout mutation using TanStack Query
 */
export const useLogoutMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      navigate('/');
    },
    onError: (error) => {
      console.error('Logout failed:', getErrorMessage(error));
      // Still navigate even if logout API fails
      navigate('/');
    },
  });
};

/**
 * Hook for change password mutation using TanStack Query
 */
export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (data: PasswordChangeData) => authService.changePassword(data),
    onError: (error) => {
      console.error('Change password failed:', getErrorMessage(error));
    },
  });
};
