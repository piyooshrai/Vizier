import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LoginForm } from '../components/auth';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  // Redirect if already logged in
  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 flex-col justify-between p-12">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9L12 15L18 9" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="6" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <span className="text-2xl font-semibold text-white">Vizier</span>
          </div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-white leading-tight">
              Healthcare analytics<br />
              made human.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-primary-100 max-w-md"
          >
            Ask questions in plain English. Get insights from your patient data.
            No SQL required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 pt-4"
          >
            <div className="flex -space-x-2">
              {['JD', 'SM', 'AR', 'KL'].map((initials, i) => (
                <div
                  key={initials}
                  className="w-10 h-10 rounded-full bg-white/20 border-2 border-primary-600 flex items-center justify-center text-xs font-medium text-white"
                  style={{ zIndex: 4 - i }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <p className="text-sm text-primary-100">
              Trusted by healthcare teams<br />across 50+ organizations
            </p>
          </motion.div>
        </div>

        <div className="text-sm text-primary-200">
          HIPAA Compliant &bull; SOC 2 Type II &bull; Enterprise Ready
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9L12 15L18 9" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="6" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <span className="text-2xl font-semibold text-neutral-900">Vizier</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-900">Welcome back</h2>
            <p className="mt-2 text-neutral-600">
              Sign in to access your healthcare insights
            </p>
          </div>

          <LoginForm />
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
