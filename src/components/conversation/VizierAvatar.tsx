import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface VizierAvatarProps {
  state?: 'idle' | 'thinking' | 'success' | 'speaking';
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

const sizeStyles = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-20 h-20',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
};

export const VizierAvatar: React.FC<VizierAvatarProps> = ({
  state = 'idle',
  size = 'md',
  showName = false,
}) => {
  const isAnimated = state === 'thinking' || state === 'speaking';

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className={`
          ${sizeStyles[size]}
          relative bg-gradient-to-br from-primary-500 to-primary-700
          rounded-full flex items-center justify-center shadow-md
        `}
        animate={
          isAnimated
            ? {
                scale: [1, 1.05, 1],
              }
            : undefined
        }
        transition={
          isAnimated
            ? {
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : undefined
        }
      >
        {/* Logo Icon */}
        <svg
          viewBox="0 0 24 24"
          className={`${iconSizes[size]} text-white`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <motion.path
            d="M6 9L12 15L18 9"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={
              state === 'speaking'
                ? { d: ['M6 9L12 15L18 9', 'M6 11L12 13L18 11', 'M6 9L12 15L18 9'] }
                : undefined
            }
            transition={
              state === 'speaking'
                ? { duration: 0.5, repeat: Infinity }
                : undefined
            }
          />
          <circle cx="12" cy="6" r="1.5" fill="currentColor" />
        </svg>

        {/* Success overlay */}
        {state === 'success' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 bg-success-500 rounded-full flex items-center justify-center"
          >
            <Check className={`${iconSizes[size]} text-white`} />
          </motion.div>
        )}

        {/* Thinking pulse ring */}
        {state === 'thinking' && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary-400"
            animate={{
              scale: [1, 1.3],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}
      </motion.div>

      {showName && (
        <span className="text-sm font-medium text-neutral-700">Vizier</span>
      )}
    </div>
  );
};

export default VizierAvatar;
