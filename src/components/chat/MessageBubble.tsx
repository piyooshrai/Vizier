// src/components/chat/MessageBubble.tsx
import React from 'react';

interface Message {
  id: string;
  role: 'vizier' | 'user';
  content: string;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isVizier = message.role === 'vizier';

  return (
    <div
      className={`flex gap-4 ${isVizier ? '' : 'justify-end'} animate-slide-up`}
    >
      {isVizier && (
        <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 shadow-lg">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
          </svg>
        </div>
      )}

      <div className={`flex-1 ${!isVizier && 'max-w-[70%]'}`}>
        <div
          className={`flex items-baseline gap-2 mb-1 ${
            isVizier ? '' : 'justify-end'
          }`}
        >
          {isVizier && (
            <>
              <span className="font-semibold text-gray-900">Vizier</span>
              <span className="text-xs text-gray-400">now</span>
            </>
          )}
          {!isVizier && (
            <>
              <span className="text-xs text-gray-400">now</span>
              <span className="font-semibold text-gray-900">You</span>
            </>
          )}
        </div>

        <div
          className={`rounded-2xl p-5 shadow-lg ${
            isVizier
              ? 'bg-gradient-to-br from-gray-50 to-white rounded-tl-none border border-gray-100'
              : 'bg-gray-900 rounded-tr-none'
          }`}
        >
          <p
            className={`leading-relaxed whitespace-pre-line ${
              isVizier ? 'text-gray-800' : 'text-white'
            }`}
          >
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
};
