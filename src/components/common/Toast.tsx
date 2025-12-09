import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-success-600" />,
  error: <AlertCircle className="w-5 h-5 text-error-600" />,
  info: <Info className="w-5 h-5 text-primary-600" />,
};

const bgMap: Record<ToastType, string> = {
  success: 'bg-success-50 border-success-200',
  error: 'bg-error-50 border-error-200',
  info: 'bg-primary-50 border-primary-200',
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`
        fixed bottom-6 right-6 z-50
        flex items-center gap-3 px-4 py-3
        bg-white border rounded-lg shadow-lg
        ${bgMap[type]}
      `}
    >
      {iconMap[type]}
      <p className="text-sm font-medium text-neutral-900">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 text-neutral-400 hover:text-neutral-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// Toast container for managing multiple toasts
interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type?: ToastType }>;
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => onRemove(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
