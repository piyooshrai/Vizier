import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Upload,
  MessageSquare,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
  { path: '/upload', icon: <Upload className="w-5 h-5" />, label: 'Upload Data' },
  { path: '/insights', icon: <MessageSquare className="w-5 h-5" />, label: 'Insights' },
  { path: '/profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white rounded-lg shadow-card"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -280,
        }}
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-neutral-200
          flex flex-col
          lg:translate-x-0 transition-transform lg:transition-none
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9L12 15L18 9" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="6" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-neutral-900">Vizier</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) onToggle();
                    }}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg
                      font-medium text-sm transition-colors
                      ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                      }
                    `}
                  >
                    <span className={isActive ? 'text-primary-600' : 'text-neutral-400'}>
                      {item.icon}
                    </span>
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-100">
          <button
            onClick={handleLogout}
            className="
              flex items-center gap-3 w-full px-3 py-2.5 rounded-lg
              font-medium text-sm text-neutral-600
              hover:bg-neutral-50 hover:text-neutral-900 transition-colors
            "
          >
            <LogOut className="w-5 h-5 text-neutral-400" />
            Sign out
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
