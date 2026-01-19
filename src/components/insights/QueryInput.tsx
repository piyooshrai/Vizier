// src/components/insights/QueryInput.tsx

import { Send } from 'lucide-react';
import type React from 'react';

interface QueryInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export const QueryInput: React.FC<QueryInputProps> = ({
  value,
  onChange,
  onSend,
  disabled,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex gap-3 items-end">
      <div className="flex-1">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask me anything about your healthcare data..."
          disabled={disabled}
          rows={1}
          className="w-full px-5 py-3.5 bg-gray-800 border-2 border-gray-700 rounded-2xl focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 resize-none text-white placeholder-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className="px-6 py-3.5 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};

export default QueryInput;
