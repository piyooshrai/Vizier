import React, { useState } from 'react';
import { X, Maximize2, RefreshCw, ExternalLink } from 'lucide-react';
import { ChartRenderer } from '../insights/ChartRenderer';
import { PinnedChart } from '../../services/charts.service';

interface DashboardCardProps {
  chart: PinnedChart & { size?: 'small' | 'medium' | 'large' };
  onUnpin: (id: string) => void;
  onResize: (id: string, size: 'small' | 'medium' | 'large') => void;
  onExpand: (id: string) => void;
  onRefresh?: (id: string) => void;
}

function getSizeHeight(size?: string): number {
  switch (size) {
    case 'small': return 250;
    case 'medium': return 350;
    case 'large': return 500;
    default: return 350;
  }
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  chart,
  onUnpin,
  onResize,
  onExpand,
  onRefresh,
}) => {
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);

    // Simulate refresh (would re-run SQL query in production)
    if (onRefresh) {
      onRefresh(chart.id);
    }

    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const chartHeight = getSizeHeight(chart.size);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden h-full flex flex-col">

      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-start justify-between flex-shrink-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base mb-1 line-clamp-2">
            {chart.query_text || chart.title}
          </h3>
          <p className="text-xs text-gray-400">
            {new Date(chart.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        <div className="flex items-center gap-1 ml-3">
          {/* Size menu */}
          <div className="relative">
            <button
              onClick={() => setShowSizeMenu(!showSizeMenu)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Resize"
            >
              <Maximize2 className="w-4 h-4 text-gray-400 hover:text-white" />
            </button>

            {showSizeMenu && (
              <>
                {/* Backdrop to close menu */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSizeMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 min-w-[120px] py-1">
                  <button
                    onClick={() => { onResize(chart.id, 'small'); setShowSizeMenu(false); }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      chart.size === 'small' ? 'text-amber-400 bg-gray-700' : 'text-white hover:bg-gray-700'
                    }`}
                  >
                    Small
                  </button>
                  <button
                    onClick={() => { onResize(chart.id, 'medium'); setShowSizeMenu(false); }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      chart.size === 'medium' || !chart.size ? 'text-amber-400 bg-gray-700' : 'text-white hover:bg-gray-700'
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => { onResize(chart.id, 'large'); setShowSizeMenu(false); }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      chart.size === 'large' ? 'text-amber-400 bg-gray-700' : 'text-white hover:bg-gray-700'
                    }`}
                  >
                    Large
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 hover:text-white ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Expand / View in Ask Vizier */}
          <button
            onClick={() => onExpand(chart.id)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="View in Ask Vizier"
          >
            <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white" />
          </button>

          {/* Unpin */}
          <button
            onClick={() => onUnpin(chart.id)}
            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Remove from dashboard"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-red-400" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 p-4 min-h-0 bg-white">
        <div style={{ height: chartHeight }}>
          {chart.chart_data && chart.chart_type ? (
            <ChartRenderer
              type={chart.chart_type as any}
              data={chart.chart_data}
              height={chartHeight}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No visualization available</p>
            </div>
          )}
        </div>
      </div>

      {/* Explanation */}
      {chart.explanation && (
        <div className="p-4 border-t border-gray-700 bg-gray-900/50 flex-shrink-0">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            Key Insight
          </h4>
          <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
            {chart.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
