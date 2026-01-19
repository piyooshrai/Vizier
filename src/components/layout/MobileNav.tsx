import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Menu,
  MessageSquare,
  Upload,
  User,
} from 'lucide-react';
import type React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface MobileNavProps {
  onMenuToggle?: () => void;
}

interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  {
    path: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    label: 'Dashboard',
  },
  {
    path: '/insights',
    icon: <MessageSquare className="w-5 h-5" />,
    label: 'Insights',
  },
  { path: '/upload', icon: <Upload className="w-5 h-5" />, label: 'Upload' },
  { path: '/profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
];

export const MobileNav: React.FC<MobileNavProps> = ({ onMenuToggle }) => {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-neutral-200 safe-area-pb"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 h-full"
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`
                  flex flex-col items-center gap-1
                  ${isActive ? 'text-primary-600' : 'text-neutral-400'}
                `}
              >
                <div
                  className={`
                  p-1.5 rounded-lg transition-colors
                  ${isActive ? 'bg-primary-50' : ''}
                `}
                >
                  {item.icon}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </motion.div>
            </NavLink>
          );
        })}

        {/* More menu button */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="flex flex-col items-center justify-center flex-1 h-full text-neutral-400 hover:text-neutral-600"
          aria-label="Toggle Menu"
        >
          <div className="p-1.5">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium">More</span>
        </button>
      </div>

      {/* Active indicator */}
      <motion.div
        className="absolute bottom-0 h-0.5 bg-primary-600"
        layoutId="mobileNavIndicator"
        initial={false}
        animate={{
          left: `${(navItems.findIndex((item) => item.path === location.pathname) / 5) * 100}%`,
          width: '20%',
          opacity: navItems.some((item) => item.path === location.pathname)
            ? 1
            : 0,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.nav>
  );
};

export default MobileNav;
