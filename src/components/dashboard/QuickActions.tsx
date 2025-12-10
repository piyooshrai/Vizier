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
  color: string;
}

const defaultActions: QuickAction[] = [
  {
    id: 'upload',
    label: 'Upload Data',
    description: 'Add new healthcare data',
    icon: Upload,
    href: '/upload',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'ask',
    label: 'Ask a Question',
    description: 'Get instant insights',
    icon: MessageSquare,
    href: '/insights',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'top-diagnoses',
    label: 'Top Diagnoses',
    description: 'View common conditions',
    icon: Activity,
    href: '/insights',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    id: 'patient-demographics',
    label: 'Patient Demographics',
    description: 'Population overview',
    icon: Users,
    href: '/insights',
    color: 'from-purple-500 to-purple-600',
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
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => navigate(action.href)}
              className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-center group"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium text-gray-900 text-sm mb-1">
                {action.label}
              </h4>
              <p className="text-xs text-gray-500">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
