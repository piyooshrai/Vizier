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
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-lg">
        <img
          src="/images/vizier-avatar.png"
          alt="Vizier"
          className="w-full h-full object-cover"
        />
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
