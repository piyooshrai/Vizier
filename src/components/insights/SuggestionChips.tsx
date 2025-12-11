// src/components/insights/SuggestionChips.tsx
import React from 'react';
import { Sparkles } from 'lucide-react';

interface SuggestionChipsProps {
  onSuggestionClick: (suggestion: string) => void;
  suggestions?: string[];
  title?: string;
  variant?: 'default' | 'compact';
}

const defaultSuggestions = [
  'What are my top 10 diagnoses?',
  'Show me patient age distribution',
  'What is my readmission rate trend?',
  'Which patients have the highest costs?',
  'How many total encounters do I have?',
  'Show me encounter volume by month',
];

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({
  onSuggestionClick,
  suggestions,
  title = 'Try asking:',
  variant = 'default',
}) => {
  const displaySuggestions = suggestions || defaultSuggestions;

  if (displaySuggestions.length === 0) {
    return null;
  }

  // Compact variant for follow-up suggestions
  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap gap-2">
        {displaySuggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="text-xs px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700 text-gray-300 hover:border-yellow-500/50 hover:text-yellow-500 transition-all duration-200"
          >
            {suggestion}
          </button>
        ))}
      </div>
    );
  }

  // Default variant with grid layout
  return (
    <div className="mt-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-yellow-500" />
        <span className="text-sm font-medium text-gray-400">{title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {displaySuggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-gray-700 hover:border-yellow-500 text-gray-300 text-sm rounded-xl transition-all text-left"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestionChips;
