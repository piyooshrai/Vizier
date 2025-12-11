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
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 shadow-lg flex-shrink-0">
          <img
            src="/vizier-avatar.svg"
            alt="Vizier"
            className="w-full h-full object-cover"
          />
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
