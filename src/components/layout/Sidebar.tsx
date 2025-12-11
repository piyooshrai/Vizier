// src/components/layout/Sidebar.tsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  MessageSquare,
  Upload,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Ask Vizier',
      path: '/insights',
      icon: MessageSquare,
    },
    {
      name: 'Upload Data',
      path: '/upload',
      icon: Upload,
    },
  ];

  const bottomNavItems = [
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
    },
  ];

  return (
    <div
      className={`relative bg-black border-r border-gray-800 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } flex flex-col min-h-screen`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xl flex-shrink-0">
            <svg
              className="w-6 h-6 text-black"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-white tracking-wide">
              VIZIER
            </span>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav data-tour="sidebar-nav" className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-white text-black font-semibold shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`
            }
            title={isCollapsed ? item.name : undefined}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`
            }
            title={isCollapsed ? item.name : undefined}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>{item.name}</span>}
          </NavLink>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-black font-bold">
              {user?.first_name?.[0] || 'D'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                {user?.first_name || 'Demo'} {user?.last_name || 'User'}
              </p>
              <p className="text-gray-400 text-xs truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed User Avatar */}
      {isCollapsed && (
        <div className="p-4 border-t border-gray-800 flex justify-center">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-black font-bold">
            {user?.first_name?.[0] || 'D'}
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all shadow-lg z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};

export default Sidebar;
