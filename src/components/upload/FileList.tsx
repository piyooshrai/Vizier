import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';

interface FileItem {
  file: File;
  isValid: boolean;
  error?: string;
}

interface FileListProps {
  files: FileItem[];
  onRemove: (index: number) => void;
  onClearAll?: () => void;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  onRemove,
  onClearAll,
}) => {
  const validFilesCount = files.filter((f) => f.isValid).length;
  const totalSize = files
    .filter((f) => f.isValid)
    .reduce((acc, f) => acc + f.file.size, 0);

  if (files.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-neutral-700">
          {validFilesCount} file{validFilesCount !== 1 ? 's' : ''} ready
          {totalSize > 0 && ` (${formatFileSize(totalSize)} total)`}
        </p>
        {onClearAll && (
          <button
            onClick={onClearAll}
            className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* File List */}
      <div className="space-y-2">
        <AnimatePresence>
          {files.map((item, index) => (
            <motion.div
              key={`${item.file.name}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className={`
                flex items-center gap-3 p-3 rounded-lg border
                ${
                  item.isValid
                    ? 'bg-white border-neutral-200 hover:border-neutral-300'
                    : 'bg-error-50 border-error-200'
                }
                transition-colors
              `}
            >
              {/* File Icon */}
              <div
                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                  ${item.isValid ? 'bg-primary-50' : 'bg-error-100'}
                `}
              >
                {item.isValid ? (
                  <FileText className="w-5 h-5 text-primary-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-error-500" />
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {item.file.name}
                </p>
                {item.isValid ? (
                  <p className="text-xs text-neutral-500">
                    {formatFileSize(item.file.size)}
                  </p>
                ) : (
                  <p className="text-xs text-error-600">{item.error}</p>
                )}
              </div>

              {/* Status Icon */}
              {item.isValid && (
                <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0" />
              )}

              {/* Remove Button */}
              <button
                onClick={() => onRemove(index)}
                className="p-1 hover:bg-neutral-100 rounded transition-colors flex-shrink-0"
                aria-label="Remove file"
              >
                <X className="w-4 h-4 text-neutral-400 hover:text-neutral-600" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FileList;
