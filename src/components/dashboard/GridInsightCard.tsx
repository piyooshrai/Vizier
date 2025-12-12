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
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden w-full h-full flex flex-col">
      {/* Header - Fixed height, drag handle */}
      <div className="drag-handle flex-shrink-0 p-4 border-b border-gray-700 flex items-start justify-between cursor-move bg-gray-900/50">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
            {insight.question}
          </h3>
          <p className="text-xs text-gray-400">
            {new Date(insight.timestamp).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
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

      {/* Chart - Takes remaining space */}
      <div className="flex-1 p-4 min-h-0 overflow-hidden bg-white">
        <div className="w-full h-full">
          {insight.chartData && insight.chartType ? (
            <ChartRenderer
              type={insight.chartType as ChartType}
              data={insight.chartData}
              height={200}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-sm">No chart data</p>
            </div>
          )}
        </div>
      </div>

      {/* Optional Footer - Only if space */}
      {insight.explanation && (
        <div className="flex-shrink-0 p-3 border-t border-gray-700 bg-gray-900/30 max-h-20 overflow-hidden">
          <p className="text-xs text-gray-400 line-clamp-2">
            {insight.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default GridInsightCard;
