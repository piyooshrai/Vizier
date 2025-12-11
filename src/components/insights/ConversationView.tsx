// src/components/insights/ConversationView.tsx
import React from 'react';
import { InsightMessage } from './InsightMessage';
import { Message } from '../../pages/Insights';

interface ConversationViewProps {
  messages: Message[];
  isProcessing: boolean;
  onSaveInsight: (message: Message) => void;
  onExport: (message: Message) => void;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  messages,
  isProcessing,
  onSaveInsight,
  onExport,
}) => {
  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <InsightMessage
          key={message.id}
          message={message}
          onSave={() => onSaveInsight(message)}
          onExport={() => onExport(message)}
        />
      ))}

      {isProcessing && (
        <div className="flex gap-4 animate-slide-up">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-lg">
            <svg
              className="w-5 h-5 text-black"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-semibold text-white">Vizier</span>
              <span className="text-xs text-gray-400">analyzing...</span>
            </div>
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl rounded-tl-none p-5 shadow-lg border border-gray-200">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0s' }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationView;
