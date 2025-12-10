import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload,
  MessageSquare,
  Users,
  Activity,
  LucideIcon
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  color: string;
}

interface QuickActionsProps {
  actions?: QuickAction[];
  onAction?: (actionId: string) => void;
}

const defaultActions: QuickAction[] = [
  {
    id: 'upload',
    label: 'Upload Data',
    description: 'Add new healthcare data',
    icon: Upload,
    href: '/upload',
    color: 'bg-primary-500',
  },
  {
    id: 'ask',
    label: 'Ask a Question',
    description: 'Get instant insights',
    icon: MessageSquare,
    href: '/insights',
    color: 'bg-success-500',
  },
  {
    id: 'top-diagnoses',
    label: 'Top Diagnoses',
    description: 'View common conditions',
    icon: Activity,
    href: '/insights',
    color: 'bg-warning-500',
  },
  {
    id: 'patient-demographics',
    label: 'Patient Demographics',
    description: 'Population overview',
    icon: Users,
    href: '/insights',
    color: 'bg-purple-500',
  },
];

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions = defaultActions,
  onAction,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const handleClick = (action: QuickAction) => {
    if (onAction) {
      onAction(action.id);
    }
    if (action.onClick) {
      action.onClick();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-neutral-700">Quick Actions</h3>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {actions.map((action) => {
          const Icon = action.icon;
          const content = (
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="
                bg-white rounded-xl border border-neutral-200 p-4
                hover:border-primary-300 hover:shadow-md
                transition-all duration-200 cursor-pointer
                flex flex-col items-center text-center
              "
              onClick={() => handleClick(action)}
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium text-neutral-900 text-sm mb-1">
                {action.label}
              </h4>
              <p className="text-xs text-neutral-500">
                {action.description}
              </p>
            </motion.div>
          );

          if (action.href) {
            return (
              <Link key={action.id} to={action.href} className="block">
                {content}
              </Link>
            );
          }

          return <div key={action.id}>{content}</div>;
        })}
      </motion.div>
    </div>
  );
};

export default QuickActions;
