import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic } from 'lucide-react';
import { VizierAvatar } from './VizierAvatar';

interface QueryInputProps {
  onSubmit: (question: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const QueryInput: React.FC<QueryInputProps> = ({
  onSubmit,
  isLoading = false,
  placeholder = 'Ask me anything about your healthcare data...',
}) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [value]);

  const handleSubmit = () => {
    const trimmedValue = value.trim();
    if (trimmedValue && !isLoading) {
      onSubmit(trimmedValue);
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm">
      <div className="flex items-end gap-3 p-3">
        <div className="flex-shrink-0 pb-1">
          <VizierAvatar
            size="sm"
            state={isLoading ? 'thinking' : 'idle'}
          />
        </div>

        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            rows={1}
            className="
              w-full resize-none border-0 bg-transparent
              text-neutral-900 placeholder:text-neutral-400
              focus:outline-none focus:ring-0
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            style={{ maxHeight: '150px' }}
          />
        </div>

        <div className="flex items-center gap-2 pb-1">
          {/* Voice input (placeholder for future) */}
          <button
            type="button"
            className="
              p-2 rounded-lg text-neutral-400
              hover:text-neutral-600 hover:bg-neutral-100
              transition-colors disabled:opacity-50
            "
            disabled
            title="Voice input coming soon"
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Submit button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!value.trim() || isLoading}
            className={`
              p-2 rounded-lg transition-colors
              ${
                value.trim() && !isLoading
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-neutral-100 text-neutral-400'
              }
              disabled:cursor-not-allowed
            `}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default QueryInput;
