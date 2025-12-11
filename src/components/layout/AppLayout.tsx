// src/components/layout/AppLayout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { AuthModal } from '../auth/AuthModal';

export const AppLayout: React.FC = () => {
  const { isDemoMode } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      {/* Full viewport height container */}
      <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Subtle grid overlay */}
        <div
          className="fixed inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Demo banner - fixed height, flex-shrink-0 prevents shrinking */}
        {isDemoMode && (
          <div className="flex-shrink-0 bg-gray-800 border-b border-gray-700 text-white px-6 py-3 text-center text-sm">
            <span className="text-gray-400">Demo Mode</span> - You're exploring sample healthcare data (12,847 patients, 47,293 encounters).
            <button
              onClick={() => setShowAuthModal(true)}
              className="ml-2 underline text-white hover:text-gray-200 font-medium"
            >
              Create your account to upload your own data
            </button>
          </div>
        )}

        {/* Main content area - flex-1 takes remaining height */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - fixed width */}
          <Sidebar />

          {/* Content area - flex-1 takes remaining width, overflow-y-auto for scrolling */}
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="signup"
      />
    </>
  );
};

export default AppLayout;
