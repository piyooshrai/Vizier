// src/components/dashboard/SavedInsightCard.tsx

import {
  BarChart3,
  MessageSquare,
  PieChart,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface SavedInsight {
  id: string;
  question: string;
  answer: string;
  chartType: string;
  chartData: Record<string, unknown>[];
  timestamp: Date;
  explanation: string;
}

interface SavedInsightCardProps {
  insight: SavedInsight;
  onRemove: (id: string) => void;
}

// Gold color palette for all charts
const GOLD_COLORS = ['#F59E0B', '#D97706', '#B45309', '#92400E', '#78350F'];

export const SavedInsightCard: React.FC<SavedInsightCardProps> = ({
  insight,
  onRemove,
}) => {
  const navigate = useNavigate();

  const renderChart = () => {
    const chartColor = '#F59E0B'; // Gold

    switch (insight.chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={insight.chartData}>
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
              />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6',
                }}
              />
              <Bar dataKey="value" fill={chartColor} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPie>
              <Pie
                data={insight.chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {insight.chartData.map(
                  (entry: Record<string, unknown>, index: number) => {
                    const nameValue = entry.name;
                    const key =
                      typeof nameValue === 'string'
                        ? `cell-${nameValue}`
                        : `cell-${index}`;
                    return (
                      <Cell
                        key={key}
                        fill={GOLD_COLORS[index % GOLD_COLORS.length]}
                      />
                    );
                  },
                )}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6',
                }}
              />
            </RechartsPie>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={insight.chartData}>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6',
                }}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke={chartColor}
                strokeWidth={3}
                dot={{ fill: chartColor, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getChartIcon = () => {
    switch (insight.chartType) {
      case 'bar':
        return BarChart3;
      case 'pie':
        return PieChart;
      case 'line':
        return TrendingUp;
      default:
        return BarChart3;
    }
  };

  const ChartIcon = getChartIcon();

  return (
    <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-lg hover:shadow-xl transition-all overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-lg">
              <ChartIcon className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white mb-1">
                {insight.question}
              </h3>
              <p className="text-sm text-gray-400">
                {new Date(insight.timestamp).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRemove(insight.id)}
            className="w-8 h-8 rounded-lg hover:bg-red-500/20 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 bg-gray-900/50">{renderChart()}</div>

      {/* Explanation */}
      <div className="p-6 border-t border-gray-700">
        <p className="text-sm text-gray-300 leading-relaxed mb-4">
          {insight.explanation}
        </p>

        <button
          type="button"
          onClick={() => navigate('/insights')}
          className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-gray-300 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          Ask follow-up question
        </button>
      </div>
    </div>
  );
};

export default SavedInsightCard;
