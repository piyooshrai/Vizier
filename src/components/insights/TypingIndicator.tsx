import React from 'react';
import { motion } from 'framer-motion';

interface TypingIndicatorProps {
  message?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  message = 'Vizier is thinking...',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-4"
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md">
        <motion.svg
          viewBox="0 0 24 24"
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <path d="M6 9L12 15L18 9" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="6" r="1.5" fill="currentColor" />
        </motion.svg>
      </div>

      {/* Typing Bubble */}
      <div className="bg-white rounded-2xl rounded-tl-md shadow-card px-6 py-4">
        <div className="flex items-center gap-3">
          {/* Animated Dots */}
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 bg-primary-400 rounded-full"
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* Message */}
          <span className="text-sm text-neutral-500">{message}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
