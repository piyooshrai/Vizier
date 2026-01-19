import type React from 'react';
import { useState } from 'react';
import { InsightCard } from './InsightCard';

interface Insight {
  id: string;
  question: string;
  answer: string;
  chartType: string;
  chartData: Record<string, unknown>[];
  explanation: string;
  timestamp: Date;
}

interface InsightsGridProps {
  insights: Insight[];
  onDeleteInsight: (id: string) => void;
  onExpandInsight: (id: string) => void;
}

export const InsightsGrid: React.FC<InsightsGridProps> = ({
  insights,
  onDeleteInsight,
  onExpandInsight,
}) => {
  const [gridColumns, setGridColumns] = useState<'1' | '2' | '3'>('3');

  if (insights.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <p className="text-gray-400 text-lg mb-2">No saved insights yet</p>
        <p className="text-gray-500 text-sm">
          Ask Vizier a question and save insights to see them here
        </p>
      </div>
    );
  }

  const gridClasses = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-400">
            {insights.length} saved{' '}
            {insights.length === 1 ? 'insight' : 'insights'}
          </p>

          {/* Grid size controls */}
          <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setGridColumns('1')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                gridColumns === '1'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              1 col
            </button>
            <button
              onClick={() => setGridColumns('2')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                gridColumns === '2'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              2 cols
            </button>
            <button
              onClick={() => setGridColumns('3')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                gridColumns === '3'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              3 cols
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className={`grid ${gridClasses[gridColumns]} gap-6`}>
        {insights.map((insight) => (
          <div key={insight.id} className="min-h-[500px]">
            <InsightCard
              insight={insight}
              onDelete={onDeleteInsight}
              onExpand={onExpandInsight}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsGrid;
