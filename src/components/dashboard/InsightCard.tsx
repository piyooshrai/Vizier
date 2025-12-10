import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Download, ArrowRight } from 'lucide-react';
import { ChartRenderer } from '../conversation/ChartRenderer';
import { ChartType } from '../../types';
import { formatTimestamp } from '../../utils/formatters';

interface InsightCardProps {
  id: string;
  question: string;
  answer?: string;
  data: Record<string, unknown>[];
  chartType: ChartType;
  chartTitle?: string;
  savedAt: string;
  onRemove?: (id: string) => void;
  onExport?: (data: Record<string, unknown>[], filename: string) => void;
  isDemoMode?: boolean;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  id,
  question,
  answer,
  data,
  chartType,
  chartTitle,
  savedAt,
  onRemove,
  onExport,
  isDemoMode = false,
}) => {
  const handleExport = () => {
    if (onExport && data.length > 0) {
      onExport(data, question);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(id);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Header */}
      <div className="p-6 border-b border-neutral-100">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-neutral-900 mb-1 truncate">
              {question}
            </h3>
            <p className="text-sm text-neutral-500">
              {isDemoMode ? 'Sample data' : `Saved ${formatTimestamp(new Date(savedAt))}`}
            </p>
          </div>
          {!isDemoMode && onRemove && (
            <button
              onClick={handleRemove}
              className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Remove from dashboard"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {answer && (
          <p className="text-sm text-neutral-600 mt-2 line-clamp-2">{answer}</p>
        )}
      </div>

      {/* Chart */}
      <div className="p-4 bg-neutral-50">
        <ChartRenderer type={chartType} data={data} title={chartTitle} />
      </div>

      {/* Actions */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-neutral-100">
        <Link
          to="/insights"
          state={{ initialQuestion: question }}
          className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Ask follow-up
          <ArrowRight className="w-4 h-4" />
        </Link>

        {onExport && (
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default InsightCard;
