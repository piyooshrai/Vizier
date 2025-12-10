// src/components/upload/FileDropZone.tsx
import React, { useCallback, useState } from 'react';
import { Upload, FileText } from 'lucide-react';

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
          file.name.endsWith('.xls')
      );

      if (files.length > 0) {
        onFilesSelected([...selectedFiles, ...files]);
      }
    },
    [selectedFiles, onFilesSelected]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected([...selectedFiles, ...files]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-3xl p-12 text-center
        transition-all duration-300 cursor-pointer
        ${
          isDragging
            ? 'border-yellow-500 bg-yellow-500/5 scale-[1.02]'
            : 'border-gray-700 bg-gray-800/30 hover:border-yellow-500/50 hover:bg-gray-800/50'
        }
      `}
    >
      <input
        type="file"
        multiple
        accept=".csv,.xlsx,.xls"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      <div className="pointer-events-none">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Upload className="w-10 h-10 text-black" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-3">
          {isDragging ? 'Drop your files here' : 'Drop your files here'}
        </h3>

        <p className="text-gray-400 mb-6">
          or click to browse your computer
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
          <FileText className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-gray-300">
            CSV, XLSX, or XLS files
          </span>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Your data is encrypted in transit and at rest
        </p>
      </div>
    </div>
  );
};

export default FileDropZone;
