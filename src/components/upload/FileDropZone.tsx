import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, AlertCircle, CheckCircle } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';

interface FileDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  acceptedTypes?: string[];
}

interface FileWithValidation {
  file: File;
  isValid: boolean;
  error?: string;
}

const MAX_FILE_SIZE_DEFAULT = 100 * 1024 * 1024; // 100MB
const ACCEPTED_TYPES_DEFAULT = ['.csv'];

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFilesSelected,
  maxFileSize = MAX_FILE_SIZE_DEFAULT,
  maxFiles = 10,
  acceptedTypes = ACCEPTED_TYPES_DEFAULT,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileWithValidation[]>([]);

  const validateFile = useCallback(
    (file: File): FileWithValidation => {
      // Check file extension
      const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      if (!acceptedTypes.includes(extension)) {
        return {
          file,
          isValid: false,
          error: `Only CSV files are supported. Please upload .csv files from your EHR system.`,
        };
      }

      // Check file size
      if (file.size > maxFileSize) {
        return {
          file,
          isValid: false,
          error: `File size limit is ${formatFileSize(maxFileSize)} per file.`,
        };
      }

      return { file, isValid: true };
    },
    [acceptedTypes, maxFileSize]
  );

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const totalFiles = selectedFiles.length + fileArray.length;

      if (totalFiles > maxFiles) {
        alert(`You can upload a maximum of ${maxFiles} files at once.`);
        return;
      }

      const validatedFiles = fileArray.map(validateFile);
      setSelectedFiles((prev) => [...prev, ...validatedFiles]);

      // Notify parent only of valid files
      const validFiles = validatedFiles
        .filter((f) => f.isValid)
        .map((f) => f.file);
      if (validFiles.length > 0) {
        const allValidFiles = [
          ...selectedFiles.filter((f) => f.isValid).map((f) => f.file),
          ...validFiles,
        ];
        onFilesSelected(allValidFiles);
      }
    },
    [maxFiles, selectedFiles, validateFile, onFilesSelected]
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
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      setSelectedFiles((prev) => {
        const newFiles = prev.filter((_, i) => i !== index);
        const validFiles = newFiles.filter((f) => f.isValid).map((f) => f.file);
        onFilesSelected(validFiles);
        return newFiles;
      });
    },
    [onFilesSelected]
  );

  const clearAll = useCallback(() => {
    setSelectedFiles([]);
    onFilesSelected([]);
  }, [onFilesSelected]);

  const validFilesCount = selectedFiles.filter((f) => f.isValid).length;
  const totalSize = selectedFiles
    .filter((f) => f.isValid)
    .reduce((acc, f) => acc + f.file.size, 0);

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <motion.div
        className={`
          relative border-2 border-dashed rounded-xl p-8
          transition-colors duration-200 cursor-pointer
          ${
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : 'border-neutral-300 hover:border-primary-400 hover:bg-neutral-50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center text-center">
          <div
            className={`
              w-16 h-16 rounded-full flex items-center justify-center mb-4
              ${isDragging ? 'bg-primary-100' : 'bg-neutral-100'}
            `}
          >
            <Upload
              className={`w-7 h-7 ${isDragging ? 'text-primary-600' : 'text-neutral-400'}`}
            />
          </div>

          <p className="text-base font-medium text-neutral-700 mb-1">
            {isDragging
              ? 'Drop your files here'
              : 'Drop your CSV files here, or click to browse'}
          </p>
          <p className="text-sm text-neutral-500">
            Accepted: patients.csv, encounters.csv, conditions.csv, and more
          </p>
          <p className="text-xs text-neutral-400 mt-2">
            Max {formatFileSize(maxFileSize)} per file
          </p>
        </div>
      </motion.div>

      {/* Selected Files */}
      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-700">
                {validFilesCount} file{validFilesCount !== 1 ? 's' : ''} ready
                {totalSize > 0 && ` (${formatFileSize(totalSize)} total)`}
              </p>
              <button
                onClick={clearAll}
                className="text-sm text-neutral-500 hover:text-neutral-700"
              >
                Clear all
              </button>
            </div>

            <div className="space-y-2">
              {selectedFiles.map((item, index) => (
                <motion.div
                  key={`${item.file.name}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border
                    ${
                      item.isValid
                        ? 'bg-white border-neutral-200'
                        : 'bg-error-50 border-error-200'
                    }
                  `}
                >
                  <div
                    className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${item.isValid ? 'bg-primary-50' : 'bg-error-100'}
                    `}
                  >
                    {item.isValid ? (
                      <FileText className="w-5 h-5 text-primary-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-error-500" />
                    )}
                  </div>

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

                  {item.isValid && (
                    <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0" />
                  )}

                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 hover:bg-neutral-100 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-neutral-400" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileDropZone;
