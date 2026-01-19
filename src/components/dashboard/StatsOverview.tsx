// src/components/dashboard/StatsOverview.tsx

import { Activity, DollarSign, TrendingDown, Users } from 'lucide-react';
import type React from 'react';

interface Stats {
  totalPatients: number;
  totalEncounters: number;
  readmissionRate: number;
  avgCost: number;
}

interface StatsOverviewProps {
  stats: Stats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const statCards = [
    {
      label: 'Total Patients',
      value: stats.totalPatients.toLocaleString(),
      icon: Users,
    },
    {
      label: 'Total Encounters',
      value: stats.totalEncounters.toLocaleString(),
      icon: Activity,
    },
    {
      label: 'Readmission Rate',
      value: `${stats.readmissionRate}%`,
      subtext: 'Below national avg',
      subtextColor: 'green' as const,
      icon: TrendingDown,
    },
    {
      label: 'Avg Encounter Cost',
      value: `$${stats.avgCost.toLocaleString()}`,
      icon: DollarSign,
    },
  ];

  const subtextColorClasses = {
    green: 'text-green-400',
    red: 'text-red-400',
    gray: 'text-gray-400',
    blue: 'text-blue-400',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-3.5 shadow-lg hover:border-gray-600 transition-colors"
        >
          {/* Horizontal Header: Icon + Label */}
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gray-800/80 flex items-center justify-center flex-shrink-0">
              <stat.icon className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide leading-tight">
              {stat.label}
            </span>
          </div>

          {/* Value - Large and prominent */}
          <div className="text-2xl font-bold text-white leading-none mb-1">
            {stat.value}
          </div>

          {/* Optional Subtext */}
          {stat.subtext && (
            <div
              className={`text-xs font-medium leading-tight ${subtextColorClasses[stat.subtextColor || 'gray']}`}
            >
              {stat.subtext}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
