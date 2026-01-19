// src/components/insights/InsightMessage.tsx
import React, { useState, useEffect } from 'react';
import { Pin, Download, Check, Search } from 'lucide-react';
import { ChartTypeSelector } from './ChartTypeSelector';
import { ChartRenderer } from './ChartRenderer';
import { Message } from '../../pages/Insights';
import { ChartType } from '../../utils/chartRecommendation';
import { chartsService } from '../../services/charts.service';

interface InsightMessageProps {
  message: Message;
  onExport: () => void;
  onDrillDown?: (question: string) => void;
}

export const InsightMessage: React.FC<InsightMessageProps> = ({
  message,
  onExport,
  onDrillDown,
}) => {
  const [selectedChartType, setSelectedChartType] = useState<ChartType | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [isPinning, setIsPinning] = useState(false);

  const isVizier = message.role === 'vizier';
  const hasChart = message.chartData && message.chartType;
  const activeChartType = selectedChartType || message.chartType;

  // Check if already pinned on mount
  useEffect(() => {
    const checkPinned = async () => {
      if (hasChart && message.content) {
        try {
          const charts = await chartsService.getCharts();
          const alreadyPinned = charts.some(c => c.id === message.id || c.query_text === message.content);
          setIsPinned(alreadyPinned);
        } catch (error) {
          console.error('Error checking pinned status:', error);
        }
      }
    };
    checkPinned();
  }, [message.id, message.content, hasChart]);

  const handlePin = async () => {
    if (isPinned || isPinning) return;

    setIsPinning(true);
    try {
      await chartsService.saveChart({
        query_text: message.content,
        chart_type: activeChartType || 'bar_chart',
        chart_data: message.chartData ?? [],
        explanation: message.explanation,
        title: message.content.substring(0, 100),
      });
      setIsPinned(true);
    } catch (error) {
      console.error('Failed to pin chart:', error);
      alert('Failed to pin chart to dashboard');
    } finally {
      setIsPinning(false);
    }
  };

  const handleDrillDown = () => {
    if (onDrillDown && message.explanation) {
      onDrillDown(`Tell me more about: ${message.content}`);
    }
  };

  if (!isVizier) {
    // User message
    return (
      <div className="flex gap-4 justify-end animate-slide-up">
        <div className="flex-1 max-w-[70%]">
          <div className="flex items-baseline gap-2 mb-1 justify-end">
            <span className="text-xs text-gray-400">now</span>
            <span className="font-semibold text-gray-100">You</span>
          </div>
          <div className="bg-white rounded-2xl rounded-tr-none p-5 shadow-lg">
            <p className="text-black leading-relaxed">{message.content}</p>
          </div>
        </div>
      </div>
    );
  }

  // Vizier message
  const pinButtonClass = (() => {
    if (isPinned) return 'bg-green-500/10 text-green-600 cursor-default border border-green-200';
    if (isPinning) return 'bg-gray-100 text-gray-400 cursor-wait';
    return 'bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg';
  })();

  return (
    <div className="flex gap-4 animate-slide-up">
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg flex-shrink-0">
        <img
          src="/images/vizier-avatar.png"
          alt="Vizier"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-semibold text-white">Vizier</span>
          <span className="text-xs text-gray-400">now</span>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-2xl rounded-tl-none shadow-lg border border-gray-200 overflow-hidden">
          {/* Answer text */}
          <div className="p-6">
            <p className="text-gray-800 leading-relaxed">{message.content}</p>
          </div>

          {/* Chart Section */}
          {hasChart && (
            <>
              {/* Chart Type Selector */}
              <div className="px-6 pb-4">
                <ChartTypeSelector
                  currentType={activeChartType as ChartType}
                  onChange={setSelectedChartType}
                />
              </div>

              {/* Chart Reason */}
              {message.chartReason && !selectedChartType && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-600 italic">
                    {message.chartReason}
                  </p>
                </div>
              )}

              {/* Chart Display Area */}
              <div className="bg-gray-50 p-6 border-t border-gray-200">
                <ChartRenderer
                  type={activeChartType as ChartType}
                  data={message.chartData as Record<string, unknown>[]}
                  height={350}
                />
              </div>

              {/* Explanation */}
              {message.explanation && (
                <div className="p-6 border-t border-gray-200 bg-amber-50">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {message.explanation}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="p-4 border-t border-gray-200 flex flex-wrap gap-3">
                {/* Pin to Dashboard - Primary Action */}
                <button
                  onClick={handlePin}
                  disabled={isPinned || isPinning}
                  className={`flex items-center gap-2 px-5 py-2.5 font-medium rounded-lg transition-all ${pinButtonClass}`}
                >
                  {(() => {
                    if (isPinned) {
                      return (
                        <>
                          <Check className="w-4 h-4" />
                          Pinned to Dashboard
                        </>
                      );
                    }
                    if (isPinning) {
                      return (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                          Pinning...
                        </>
                      );
                    }
                    return (
                      <>
                        <Pin className="w-4 h-4" />
                        Pin to Dashboard
                      </>
                    );
                  })()}
                </button>

                {/* Export CSV */}
                <button
                  onClick={onExport}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>

                {/* Drill Down / Ask Follow-up */}
                {onDrillDown && (
                  <button
                    onClick={handleDrillDown}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    <Search className="w-4 h-4" />
                    Ask Follow-Up
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightMessage;
