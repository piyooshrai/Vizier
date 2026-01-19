// src/components/chat/GoalCard.tsx
import type React from 'react';

interface GoalCardProps {
  icon: 'outcomes' | 'operations' | 'revenue';
  title: string;
  description: string;
  color: 'blue' | 'green' | 'purple';
  onClick: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  icon,
  title,
  description,
  color,
  onClick,
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
  };

  const icons = {
    outcomes: (
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    ),
    operations: (
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    ),
    revenue: (
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
    ),
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="group p-4 text-left bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-400 rounded-xl transition-all shadow-sm hover:shadow-md"
    >
      <div
        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
      >
        <svg
          className="w-4 h-4 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <title>{title}</title>
          {icons[icon]}
        </svg>
      </div>
      <h3 className="font-semibold text-gray-900 text-sm mb-1">{title}</h3>
      <p className="text-xs text-gray-600">{description}</p>
    </button>
  );
};
