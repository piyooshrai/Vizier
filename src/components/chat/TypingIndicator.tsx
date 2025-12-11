// src/components/chat/TypingIndicator.tsx
import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-4 animate-slide-up">
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 shadow-lg flex-shrink-0">
        <img
          src="/vizier-avatar.svg"
          alt="Vizier"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-semibold text-gray-900">Vizier</span>
          <span className="text-xs text-gray-400">typing...</span>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl rounded-tl-none p-5 shadow-sm border border-gray-100">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
