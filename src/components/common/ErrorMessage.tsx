import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import type React from 'react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onDismiss,
  className = '',
}) => {
  if (!message) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`
          flex items-start gap-3 p-4
          bg-error-50 border border-error-200 rounded-lg
          ${className}
        `}
      >
        <AlertCircle className="w-5 h-5 text-error-500 flex-shrink-0 mt-0.5" />
        <p className="flex-1 text-sm text-error-700">{message}</p>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="p-1 text-error-400 hover:text-error-600 transition-colors"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorMessage;
