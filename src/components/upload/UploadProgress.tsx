import { motion } from 'framer-motion';
import { CheckCircle, Loader2, Upload } from 'lucide-react';
import type React from 'react';

interface UploadProgressProps {
  files: File[];
  progress: number; // 0-100
  currentFileIndex: number;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  files,
  progress,
  currentFileIndex,
}) => {
  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-neutral-700">
            Uploading your files securely...
          </span>
          <span className="text-neutral-500">{Math.round(progress)}%</span>
        </div>

        <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* File List */}
      <div className="space-y-2">
        {files.map((file, index) => {
          const isCompleted = index < currentFileIndex;
          const isCurrent = index === currentFileIndex;
          const isPending = index > currentFileIndex;

          return (
            <div
              key={`${file.name}-${index}`}
              className={`
                flex items-center gap-3 p-3 rounded-lg
                ${isCurrent ? 'bg-primary-50 border border-primary-200' : 'bg-neutral-50'}
              `}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                {isCompleted && (
                  <CheckCircle className="w-5 h-5 text-success-500" />
                )}
                {isCurrent && (
                  <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
                )}
                {isPending && <Upload className="w-5 h-5 text-neutral-300" />}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={`
                    text-sm font-medium truncate
                    ${isCompleted ? 'text-success-600' : ''}
                    ${isCurrent ? 'text-primary-700' : ''}
                    ${isPending ? 'text-neutral-400' : ''}
                  `}
                >
                  {file.name}
                </p>
              </div>

              <span
                className={`
                  text-xs
                  ${isCompleted ? 'text-success-500' : ''}
                  ${isCurrent ? 'text-primary-600' : ''}
                  ${isPending ? 'text-neutral-400' : ''}
                `}
              >
                {isCompleted && 'Done'}
                {isCurrent && 'Uploading...'}
                {isPending && 'Waiting'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UploadProgress;
