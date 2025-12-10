// src/components/dashboard/QuickActions.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, MessageSquare, Users, Activity, LucideIcon } from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

const defaultActions: QuickAction[] = [
  {
    id: 'upload',
    label: 'Upload Data',
    description: 'Add new healthcare data',
    icon: Upload,
    href: '/upload',
  },
  {
    id: 'ask',
    label: 'Ask a Question',
    description: 'Get instant insights',
    icon: MessageSquare,
    href: '/insights',
  },
  {
    id: 'top-diagnoses',
    label: 'Top Diagnoses',
    description: 'View common conditions',
    icon: Activity,
    href: '/insights',
  },
  {
    id: 'patient-demographics',
    label: 'Patient Demographics',
    description: 'Population overview',
    icon: Users,
    href: '/insights',
  },
];

interface QuickActionsProps {
  actions?: QuickAction[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions = defaultActions,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => navigate(action.href)}
              className="p-4 bg-gray-900/50 hover:bg-gray-700/50 rounded-xl transition-all text-center group border border-gray-700"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-600 to-yellow-500 flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-105 transition-transform">
                <Icon className="w-6 h-6 text-black" />
              </div>
              <h4 className="font-medium text-white text-sm mb-1">
                {action.label}
              </h4>
              <p className="text-xs text-gray-400">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
