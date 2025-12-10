// src/components/dashboard/StatsOverview.tsx
import React from 'react';
import { Users, Activity, TrendingDown, DollarSign } from 'lucide-react';

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
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Total Encounters',
      value: stats.totalEncounters.toLocaleString(),
      icon: Activity,
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Readmission Rate',
      value: `${stats.readmissionRate}%`,
      subtitle: 'Below national avg',
      icon: TrendingDown,
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      label: 'Avg Encounter Cost',
      value: `$${stats.avgCost.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
            >
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>

          <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
          {stat.subtitle && (
            <p className="text-green-600 text-sm font-medium">{stat.subtitle}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
