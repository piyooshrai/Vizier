import type React from 'react';
import { Navigate } from 'react-router-dom';
import PageLoader from '../components/common/PageLoader';
import { useAuth } from '../contexts/AuthContext';

type RouteGuardProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: RouteGuardProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const PublicRoute = ({ children }: RouteGuardProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
