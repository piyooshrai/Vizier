// src/components/insights/InsightMessage.tsx
import React, { useState } from 'react';
import { Save, Download } from 'lucide-react';
import { ChartTypeSelector } from './ChartTypeSelector';
import { ChartRenderer } from './ChartRenderer';
import { Message } from '../../pages/Insights';
import { ChartType } from '../../utils/chartRecommendation';

interface InsightMessageProps {
  message: Message;
  onSave: () => void;
  onExport: () => void;
}

export const InsightMessage: React.FC<InsightMessageProps> = ({
  message,
  onSave,
  onExport,
}) => {
  const [selectedChartType, setSelectedChartType] = useState<ChartType | null>(
    null
  );

  const isVizier = message.role === 'vizier';
  const hasChart = message.chartData && message.chartType;
  const activeChartType = selectedChartType || message.chartType;

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
                />
              </div>

              {/* Explanation */}
              {message.explanation && (
                <div className="p-6 border-t border-gray-200 bg-blue-50">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {message.explanation}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="p-4 border-t border-gray-200 flex gap-3">
                <button
                  onClick={onSave}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save to Dashboard
                </button>
                <button
                  onClick={onExport}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightMessage;
