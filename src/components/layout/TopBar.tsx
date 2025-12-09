import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { useAuth } from '../../contexts/AuthContext';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/upload': 'Upload Data',
  '/insights': 'Insights',
  '/profile': 'Profile',
};

export const TopBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isDemoMode } = useAuth();

  const title = pageTitles[location.pathname] || 'Vizier';
  const userName = user ? `${user.first_name} ${user.last_name}` : 'User';

  return (
    <div className="flex flex-col">
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Demo Mode</span> - You're exploring with sample data.
            <button
              onClick={() => navigate('/signup')}
              className="ml-2 underline hover:text-amber-900"
            >
              Create your account
            </button>
          </p>
        </div>
      )}
      <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 lg:px-8">
      {/* Page title - hidden on mobile to make room for hamburger */}
      <div className="pl-12 lg:pl-0">
        <h1 className="text-lg font-semibold text-neutral-900">{title}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          className="
            p-2 rounded-lg text-neutral-400
            hover:text-neutral-600 hover:bg-neutral-50
            transition-colors relative
          "
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {/* Notification badge - can be conditionally rendered */}
          {/* <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-500 rounded-full" /> */}
        </button>

        {/* User */}
        <div className="flex items-center gap-3">
          <Avatar name={userName} size="sm" />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-neutral-900">{userName}</p>
            <p className="text-xs text-neutral-500">{user?.role || 'User'}</p>
          </div>
        </div>
      </div>
      </header>
    </div>
  );
};

export default TopBar;
