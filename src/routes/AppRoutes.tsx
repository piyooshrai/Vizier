import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout';
import { ProtectedRoute, PublicRoute } from './RouteGuards';

// Lazy load all pages for code splitting
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Upload = lazy(() => import('../pages/Upload'));
const Insights = lazy(() => import('../pages/Insights'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const NotFound = lazy(() => import('../pages/NotFound'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const ChatLanding = lazy(() => import('../pages/ChatLanding'));
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing page - chat-first, no login wall */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <ChatLanding />
          </PublicRoute>
        }
      />

      {/* Auth routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* Password recovery routes */}
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      {/* Protected routes with layout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
