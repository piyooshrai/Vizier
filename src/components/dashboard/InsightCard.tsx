import React from 'react';
import { Trash2, Maximize2 } from 'lucide-react';
import { ChartRenderer } from '../insights/ChartRenderer';

interface InsightCardProps {
  insight: {
    id: string;
    question: string;
    answer: string;
    chartType: string;
    chartData: any;
    explanation: string;
    timestamp: Date;
  };
  onDelete: (id: string) => void;
  onExpand: (id: string) => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  onDelete,
  onExpand,
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden h-full flex flex-col">

      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-start justify-between flex-shrink-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base mb-1 line-clamp-2">
            {insight.question}
          </h3>
          <p className="text-xs text-gray-400">
            {new Date(insight.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>

        <div className="flex items-center gap-2 ml-3">
          <button
            onClick={() => onExpand(insight.id)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="View in Ask Vizier"
          >
            <Maximize2 className="w-4 h-4 text-gray-400 hover:text-white" />
          </button>
          <button
            onClick={() => onDelete(insight.id)}
            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Remove from dashboard"
          >
            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
          </button>
        </div>
      </div>

      {/* Chart - MUST use same ChartRenderer as Insights page */}
      <div className="flex-1 p-6 min-h-0 bg-white">
        {insight.chartData && insight.chartType ? (
          <ChartRenderer
            type={insight.chartType as any}
            data={insight.chartData}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No visualization available</p>
          </div>
        )}
      </div>

      {/* Explanation */}
      {insight.explanation && (
        <div className="p-4 border-t border-gray-700 bg-gray-900/50 flex-shrink-0">
          <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
            {insight.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default InsightCard;
