// src/components/upload/FileDropZone.tsx

import { FileText, Upload } from 'lucide-react';
import type React from 'react';
import { useCallback, useRef, useState } from 'react';
import {
  ACCEPTED_FILE_TYPES,
  ACCEPTED_MIME_TYPES,
  MAX_FILE_SIZE,
  MAX_FILES_PER_UPLOAD,
} from '../../utils/constants';

interface FileDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  onValidationError?: (message: string) => void;
  selectedFiles: File[];
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFilesSelected,
  onValidationError,
  selectedFiles,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const acceptedTypesLabel = ACCEPTED_FILE_TYPES.map((ext) =>
    ext.replace('.', '').toUpperCase(),
  ).join(', ');

  const validateAndMergeFiles = useCallback(
    (incomingFiles: File[]) => {
      if (incomingFiles.length === 0) return;

      const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      };

      const isAcceptedFile = (file: File) => {
        const lowerName = file.name.toLowerCase();
        return (
          ACCEPTED_FILE_TYPES.some((ext) => lowerName.endsWith(ext)) ||
          ACCEPTED_MIME_TYPES.includes(file.type)
        );
      };

      const invalidTypeFiles = incomingFiles.filter(
        (file) => !isAcceptedFile(file),
      );
      const typeFilteredFiles = incomingFiles.filter((file) =>
        isAcceptedFile(file),
      );

      if (invalidTypeFiles.length > 0) {
        const acceptedList = ACCEPTED_FILE_TYPES.join(', ');
        onValidationError?.(
          `Unsupported file type detected. Please upload one of: ${acceptedList}.`,
        );
      }

      const oversizedFiles = typeFilteredFiles.filter(
        (file) => file.size > MAX_FILE_SIZE,
      );
      const sizeFilteredFiles = typeFilteredFiles.filter(
        (file) => file.size <= MAX_FILE_SIZE,
      );

      if (oversizedFiles.length > 0) {
        const readableLimit = formatFileSize(MAX_FILE_SIZE);
        onValidationError?.(
          `Some files exceed the ${readableLimit} limit. Please upload smaller files.`,
        );
      }

      const remainingSlots = MAX_FILES_PER_UPLOAD - selectedFiles.length;
      if (remainingSlots <= 0) {
        onValidationError?.(
          `You can upload up to ${MAX_FILES_PER_UPLOAD} files per upload.`,
        );
        return;
      }

      const filesToAdd = sizeFilteredFiles.slice(0, remainingSlots);
      if (sizeFilteredFiles.length > remainingSlots) {
        onValidationError?.(
          `Only ${MAX_FILES_PER_UPLOAD} files are allowed per upload.`,
        );
      }

      if (filesToAdd.length > 0) {
        onFilesSelected([...selectedFiles, ...filesToAdd]);
      }
    },
    [selectedFiles, onFilesSelected, onValidationError],
  );

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
      const files = Array.from(e.dataTransfer.files);
      validateAndMergeFiles(files);
    },
    [validateAndMergeFiles],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    validateAndMergeFiles(files);
    e.target.value = '';
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
        accept={ACCEPTED_FILE_TYPES.join(',')}
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
          <span className="text-sm text-gray-300">
            {acceptedTypesLabel} files
          </span>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Your data is encrypted in transit and at rest
        </p>
      </div>
    </button>
  );
};

export default FileDropZone;
