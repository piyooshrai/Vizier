import { motion } from 'framer-motion';
import { CheckCircle, Code, Download, Pin } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import type { VannaResponse } from '../../types';
import { formatTimestamp } from '../../utils/formatters';
import { ChartRenderer } from './ChartRenderer';

interface MessageBubbleProps {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: VannaResponse;
  isLoading?: boolean;
  isError?: boolean;
  onSave?: (data: VannaResponse) => void;
  isSaved?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  role,
  content,
  timestamp,
  data,
  isLoading,
  isError,
  onSave,
  isSaved = false,
}) => {
  const [showSql, setShowSql] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = () => {
    if (onSave && data && !isSaved) {
      onSave(data);
      setJustSaved(true);
    }
  };

  const handleExport = () => {
    if (!data?.results || data.results.length === 0) return;

    const columns = Object.keys(data.results[0]);
    const csvContent = [
      columns.join(','),
      ...data.results.map((row) =>
        columns
          .map((col) => {
            const value = row[col];
            const stringValue = String(value ?? '');
            if (stringValue.includes(',') || stringValue.includes('"')) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          })
          .join(','),
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `vizier-export-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const showSavedState = isSaved || justSaved;

  if (role === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <div className="bg-primary-600 text-white px-6 py-3 rounded-2xl rounded-br-md max-w-2xl">
          <p className="leading-relaxed">{content}</p>
          <p className="text-xs text-primary-200 mt-2 text-right">
            {formatTimestamp(timestamp)}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4"
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-lg">
        <img
          src="/images/vizier-avatar.png"
          alt="Vizier"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 max-w-3xl">
        <div
          className={`
            bg-white rounded-2xl rounded-tl-md shadow-card p-6
            ${isError ? 'border border-error-200 bg-error-50' : ''}
          `}
        >
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-primary-400 rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
              <span className="text-sm text-neutral-500">Thinking...</span>
            </div>
          )}

          {/* Text Content */}
          {!isLoading && content && (
            <p
              className={`leading-relaxed ${
                isError ? 'text-error-700' : 'text-neutral-700'
              }`}
            >
              {content}
            </p>
          )}

          {/* Chart/Results */}
          {!isLoading && data?.results && data.results.length > 0 && (
            <div className="mt-4 bg-neutral-50 rounded-lg p-4">
              <ChartRenderer
                type={data.chart_type}
                data={data.results}
                title={data.chart_title}
              />
            </div>
          )}

          {/* Actions */}
          {!isLoading && data?.results && data.results.length > 0 && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-neutral-100">
              {showSavedState ? (
                <span className="flex items-center gap-1.5 text-sm text-success-600">
                  <CheckCircle className="w-4 h-4" />
                  Saved
                </span>
              ) : (
                onSave && (
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    <Pin className="w-4 h-4" />
                    Save to Dashboard
                  </button>
                )
              )}

              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>

              {data.sql && (
                <button
                  onClick={() => setShowSql(!showSql)}
                  className={`
                    flex items-center gap-1.5 text-sm transition-colors
                    ${showSql ? 'text-primary-600' : 'text-neutral-600 hover:text-neutral-900'}
                  `}
                >
                  <Code className="w-4 h-4" />
                  {showSql ? 'Hide SQL' : 'Show SQL'}
                </button>
              )}
            </div>
          )}

          {/* SQL Block */}
          {showSql && data?.sql && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4"
            >
              <pre className="bg-neutral-900 text-neutral-100 rounded-lg p-4 text-sm overflow-x-auto">
                <code>{data.sql}</code>
              </pre>
            </motion.div>
          )}
        </div>

        {/* Timestamp */}
        <p className="text-xs text-neutral-400 mt-2 ml-2">
          {formatTimestamp(timestamp)}
        </p>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
