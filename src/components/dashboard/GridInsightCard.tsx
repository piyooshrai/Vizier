// src/components/dashboard/GridInsightCard.tsx
import React from 'react';
import { Trash2, Maximize2 } from 'lucide-react';
import { ChartRenderer } from '../conversation/ChartRenderer';
import { ChartType } from '../../types';

interface GridInsightCardProps {
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

export const GridInsightCard: React.FC<GridInsightCardProps> = ({
  insight,
  onDelete,
  onExpand,
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden h-full flex flex-col">
      {/* Header - drag handle */}
      <div className="drag-handle p-4 border-b border-gray-700 flex items-start justify-between cursor-move">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm truncate mb-1">
            {insight.question}
          </h3>
          <p className="text-xs text-gray-400">
            {new Date(insight.timestamp).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExpand(insight.id);
            }}
            className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
            title="Expand"
          >
            <Maximize2 className="w-4 h-4 text-gray-400 hover:text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(insight.id);
            }}
            className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 p-4 overflow-hidden bg-white min-h-0">
        <div className="h-full flex items-center justify-center">
          <ChartRenderer
            type={insight.chartType as ChartType}
            data={insight.chartData}
          />
        </div>
      </div>

      {/* Explanation */}
      {insight.explanation && (
        <div className="p-3 border-t border-gray-700 bg-gray-900/50">
          <p className="text-xs text-gray-400 line-clamp-2">
            {insight.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default GridInsightCard;
