import { motion } from 'framer-motion';
import { Check, CheckCircle, Code, Copy, Download, Pin } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import type { VannaResponse } from '../../types';
import { coerceToString } from '../../utils/formatters';
import { ChartRenderer } from './ChartRenderer';

interface ResultsDisplayProps {
  data: VannaResponse;
  onSave?: (data: VannaResponse) => void;
  isSaved?: boolean;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  data,
  onSave,
  isSaved = false,
}) => {
  const [showSql, setShowSql] = useState(false);
  const [copied, setCopied] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = () => {
    if (onSave && !isSaved) {
      onSave(data);
      setJustSaved(true);
    }
  };

  const showSavedState = isSaved || justSaved;

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(data.sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy SQL:', error);
    }
  };

  const handleExportCsv = () => {
    if (!data.results || data.results.length === 0) return;

    const columns = Object.keys(data.results[0]);
    const csvContent = [
      columns.join(','),
      ...data.results.map((row) =>
        columns
          .map((col) => {
            const value = row[col];
            // Escape quotes and wrap in quotes if contains comma
            // Escape quotes and wrap in quotes if contains comma
            const stringValue = coerceToString(value);
            if (stringValue.includes(',') || stringValue.includes('"')) {
              return `"${stringValue.replaceAll('"', '""')}"`;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Chart/Table */}
      <div className="bg-neutral-50 rounded-lg p-4">
        <ChartRenderer
          type={data.chart_type}
          data={data.results}
          title={data.chart_title}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Show SQL toggle */}
        <button
          type="button"
          onClick={() => setShowSql(!showSql)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
            transition-colors
            ${
              showSql
                ? 'bg-neutral-200 text-neutral-700'
                : 'text-neutral-500 hover:bg-neutral-100'
            }
          `}
        >
          <Code className="w-4 h-4" />
          {showSql ? 'Hide SQL' : 'Show SQL'}
        </button>

        {/* Export CSV */}
        {data.results && data.results.length > 0 && (
          <button
            type="button"
            onClick={handleExportCsv}
            className="
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
              text-neutral-500 hover:bg-neutral-100 transition-colors
            "
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        )}

        {/* Save to Dashboard */}
        {onSave &&
          data.results &&
          data.results.length > 0 &&
          (showSavedState ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-success-600">
              <CheckCircle className="w-4 h-4" />
              Saved
            </span>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              className="
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
                text-primary-600 hover:bg-primary-50 transition-colors font-medium
              "
            >
              <Pin className="w-4 h-4" />
              Save to Dashboard
            </button>
          ))}
      </div>

      {/* SQL Code Block */}
      {showSql && data.sql && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="relative"
        >
          <pre className="bg-neutral-900 text-neutral-100 rounded-lg p-4 text-sm overflow-x-auto">
            <code>{data.sql}</code>
          </pre>

          <button
            type="button"
            onClick={handleCopySql}
            className="
              absolute top-2 right-2 p-2 rounded-lg
              bg-neutral-800 hover:bg-neutral-700
              text-neutral-400 hover:text-neutral-200
              transition-colors
            "
            title="Copy SQL"
          >
            {copied ? (
              <Check className="w-4 h-4 text-success-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </motion.div>
      )}

      {/* Summary */}
      {data.summary && (
        <p className="text-sm text-neutral-600 italic">{data.summary}</p>
      )}
    </motion.div>
  );
};

export default ResultsDisplay;
