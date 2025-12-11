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
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg flex-shrink-0">
            <img
              src="/vizier-avatar.svg"
              alt="Vizier"
              className="w-full h-full object-cover"
            />
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
