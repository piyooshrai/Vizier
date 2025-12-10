// src/components/dashboard/SavedInsightCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, PieChart, TrendingUp, Trash2, MessageSquare } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SavedInsight {
  id: string;
  question: string;
  answer: string;
  chartType: string;
  chartData: any;
  timestamp: Date;
  explanation: string;
}

interface SavedInsightCardProps {
  insight: SavedInsight;
  onRemove: (id: string) => void;
}

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
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
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
                label
              >
                {insight.chartData.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.color ||
                      ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'][
                        index % 5
                      ]
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
            </RechartsPie>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={insight.chartData}>
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
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
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-600 to-yellow-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <ChartIcon className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {insight.question}
              </h3>
              <p className="text-sm text-gray-500">
                {new Date(insight.timestamp).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <button
            onClick={() => onRemove(insight.id)}
            className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 bg-gray-50">{renderChart()}</div>

      {/* Explanation */}
      <div className="p-6 border-t border-gray-200">
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          {insight.explanation}
        </p>

        <button
          onClick={() => navigate('/insights')}
          className="inline-flex items-center gap-2 text-sm font-medium text-yellow-600 hover:text-yellow-700 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          Ask follow-up question
        </button>
      </div>
    </div>
  );
};

export default SavedInsightCard;
