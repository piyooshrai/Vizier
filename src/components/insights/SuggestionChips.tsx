import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SuggestionChipsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  title?: string;
  variant?: 'default' | 'compact';
}

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({
  suggestions,
  onSuggestionClick,
  title,
  variant = 'default',
}) => {
  if (suggestions.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const chipVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  if (variant === 'compact') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-2"
      >
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            variants={chipVariants}
            onClick={() => onSuggestionClick(suggestion)}
            className="
              text-xs px-3 py-1.5 rounded-full
              bg-white border border-neutral-200
              text-neutral-700 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50
              transition-all duration-200
            "
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {suggestion}
          </motion.button>
        ))}
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {title && (
        <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <Sparkles className="w-4 h-4 text-primary-500" />
          <span>{title}</span>
        </div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-2"
      >
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            variants={chipVariants}
            onClick={() => onSuggestionClick(suggestion)}
            className="
              px-4 py-2.5 rounded-xl
              bg-white border border-neutral-200
              text-sm text-neutral-700
              hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50
              hover:shadow-sm
              transition-all duration-200
              text-left
            "
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {suggestion}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default SuggestionChips;
