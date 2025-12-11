// src/components/layout/AppLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../hooks/useAuth';

export const AppLayout: React.FC = () => {
  const { isDemoMode } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Subtle grid overlay */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-3 shadow-lg">
          <div className="flex items-center justify-center gap-3 text-sm">
            <svg
              className="w-4 h-4 text-amber-900"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="text-amber-900 font-semibold">
              Demo Mode - You're exploring with sample healthcare data (12,847
              patients, 47,293 encounters).
            </span>
            <a
              href="/signup"
              className="text-amber-900 hover:text-black font-bold underline ml-2"
            >
              Create your account to upload your own data
            </a>
          </div>
        </div>
      )}

      <div className={`flex min-h-screen ${isDemoMode ? 'pt-12' : ''}`}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-auto relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
