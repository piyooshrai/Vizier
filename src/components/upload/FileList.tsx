// src/components/upload/FileList.tsx
import React from 'react';
import { FileText, X, Check } from 'lucide-react';

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onRemove }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-3">
      {files.map((file, index) => (
        <div
          key={index}
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center gap-4 hover:border-gray-500 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">{file.name}</p>
            <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
          </div>

          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5 text-green-500" />
          </div>

          <button
            onClick={() => onRemove(index)}
            className="w-8 h-8 rounded-full hover:bg-red-500/20 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default FileList;
