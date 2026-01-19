// src/components/insights/ChartTypeSelector.tsx

import { BarChart3, Hash, PieChart, Table, TrendingUp } from 'lucide-react';
import type React from 'react';
import type { ChartType } from '../../utils/chartRecommendation';

interface ChartTypeSelectorProps {
  currentType: ChartType;
  onChange: (type: ChartType) => void;
}

export const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({
  currentType,
  onChange,
}) => {
  const chartTypes: {
    type: ChartType;
    label: string;
    icon: React.ElementType;
  }[] = [
    { type: 'bar_chart', label: 'Bar', icon: BarChart3 },
    { type: 'horizontal_bar_chart', label: 'H-Bar', icon: BarChart3 },
    { type: 'pie_chart', label: 'Pie', icon: PieChart },
    { type: 'line_chart', label: 'Line', icon: TrendingUp },
    { type: 'table', label: 'Table', icon: Table },
    { type: 'big_number', label: 'Number', icon: Hash },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 mr-2">View as:</span>
      {chartTypes.map((chart) => {
        const Icon = chart.icon;
        return (
          <button
            key={chart.type}
            onClick={() => onChange(chart.type)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentType === chart.type
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {chart.label}
          </button>
        );
      })}
    </div>
  );
};

export default ChartTypeSelector;
