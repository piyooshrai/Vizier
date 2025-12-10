import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { SignupForm } from '../components/auth/SignupForm';
import { DemoCard } from '../components/auth/DemoCard';
import { useAuth } from '../contexts/AuthContext';

export const Signup: React.FC = () => {
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
            Let's get started
          </h2>
          <p className="text-neutral-600">
            Create your account and start asking questions
          </p>
        </div>

        {/* Signup form */}
        <SignupForm />

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

        {/* Sign in link */}
        <p className="text-center text-sm text-neutral-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;
