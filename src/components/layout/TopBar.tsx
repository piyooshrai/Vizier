import React from 'react';
import { useLocation } from 'react-router-dom';
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
  const { user } = useAuth();

  const title = pageTitles[location.pathname] || 'Vizier';
  const userName = user ? `${user.first_name} ${user.last_name}` : 'User';

  return (
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
  );
};

export default TopBar;
