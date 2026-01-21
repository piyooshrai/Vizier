// src/components/upload/FileDropZone.tsx

import { FileText, Upload } from 'lucide-react';
import type React from 'react';
import { useCallback, useRef, useState } from 'react';

interface FileDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFilesSelected,
  selectedFiles,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files).filter(
        (file) =>
          file.type === 'text/csv' ||
          file.name.endsWith('.csv') ||
          file.type === 'application/vnd.ms-excel' ||
          file.name.endsWith('.xlsx') ||
          file.name.endsWith('.xls'),
      );

      if (files.length > 0) {
        onFilesSelected([...selectedFiles, ...files]);
      }
    },
    [selectedFiles, onFilesSelected],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected([...selectedFiles, ...files]);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <button
      type="button"
      aria-label="File upload dropzone"
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        w-full block relative border border-gray-700/50 rounded-3xl p-12 text-center
        transition-all duration-300 cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500
        ${
          isDragging
            ? 'border-white bg-white/5 scale-[1.02]'
            : 'hover:border-gray-500 bg-gray-900/50 hover:bg-gray-800/50'
        }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".csv,.xlsx,.xls"
        onChange={handleFileInput}
        className="hidden"
      />

      <div className="pointer-events-none relative z-10">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Upload className="w-10 h-10 text-black" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-3">
          Drop your files here
        </h3>

        <p className="text-gray-400 mb-6">or click to browse your computer</p>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
          <FileText className="w-4 h-4 text-white" />
          <span className="text-sm text-gray-300">CSV, XLSX, or XLS files</span>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Your data is encrypted in transit and at rest
        </p>
      </div>
    </button>
  );
};

export default FileDropZone;
