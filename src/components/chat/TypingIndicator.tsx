// src/components/chat/TypingIndicator.tsx
import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-4 animate-slide-up">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-500 flex items-center justify-center flex-shrink-0 shadow-lg">
        <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
        </svg>
      </div>
      <div className="flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-semibold text-gray-900">Vizier</span>
          <span className="text-xs text-gray-400">typing...</span>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl rounded-tl-none p-5 shadow-sm border border-gray-100">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-yellow-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 bg-yellow-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-yellow-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
