import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';
import { DemoCard } from '../components/auth/DemoCard';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">
            Welcome back
          </h2>
          <p className="text-neutral-600">
            Sign in to continue your conversation with Vizier
          </p>
        </div>

        {/* Login form */}
        <LoginForm />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-neutral-50 text-neutral-500">Or</span>
          </div>
        </div>

        {/* Demo card */}
        <DemoCard />

        {/* Sign up link */}
        <p className="text-center text-sm text-neutral-600">
          New to Vizier?{' '}
          <Link
            to="/signup"
            className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            Create your account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
