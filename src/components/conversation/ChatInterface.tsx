import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VizierAvatar } from './VizierAvatar';
import { ResultsDisplay } from './ResultsDisplay';
import { ThreeDotsLoader } from '../common/LoadingSpinner';
import { Message } from '../../services';
import { VannaResponse } from '../../types';
import { formatTimestamp } from '../../utils/formatters';

interface ChatInterfaceProps {
  messages: Message[];
  onSuggestionClick?: (suggestion: string) => void;
  onSaveInsight?: (question: string, data: VannaResponse) => void;
  savedQuestions?: Set<string>;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSuggestionClick,
  onSaveInsight,
  savedQuestions = new Set(),
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col space-y-6">
      <AnimatePresence mode="popLayout">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex gap-3 ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {/* Vizier avatar */}
            {message.type === 'vizier' && (
              <div className="flex-shrink-0">
                <VizierAvatar
                  size="sm"
                  state={message.isLoading ? 'thinking' : 'idle'}
                />
              </div>
            )}

            {/* Message content */}
            <div
              className={`
                max-w-[80%] rounded-2xl px-4 py-3
                ${
                  message.type === 'user'
                    ? 'bg-primary-600 text-white rounded-br-sm'
                    : 'bg-neutral-100 text-neutral-900 rounded-bl-sm'
                }
                ${message.isError ? 'bg-error-50 border border-error-200' : ''}
              `}
            >
              {/* Loading indicator */}
              {message.isLoading && (
                <div className="py-1">
                  <ThreeDotsLoader />
                </div>
              )}

              {/* Text content */}
              {!message.isLoading && message.content && (
                <p
                  className={`text-sm leading-relaxed ${
                    message.isError ? 'text-error-700' : ''
                  }`}
                >
                  {message.content}
                </p>
              )}

              {/* Data visualization */}
              {!message.isLoading && message.data && (
                <div className="mt-4">
                  <ResultsDisplay
                    data={message.data}
                    onSave={onSaveInsight ? (data) => onSaveInsight(message.content, data) : undefined}
                    isSaved={savedQuestions.has(message.content)}
                  />
                </div>
              )}

              {/* Follow-up suggestions */}
              {!message.isLoading &&
                message.type === 'vizier' &&
                message.data?.follow_up_questions &&
                message.data.follow_up_questions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <p className="text-xs text-neutral-500 mb-2">
                      You might also want to know:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {message.data.follow_up_questions.slice(0, 3).map((question, i) => (
                        <button
                          key={i}
                          onClick={() => onSuggestionClick?.(question)}
                          className="
                            text-xs px-3 py-1.5 rounded-full
                            bg-white border border-neutral-200
                            text-neutral-700 hover:border-primary-300 hover:text-primary-600
                            transition-colors
                          "
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Timestamp (shown on hover) */}
              <div
                className={`
                  text-xs mt-2 opacity-0 hover:opacity-100 transition-opacity
                  ${message.type === 'user' ? 'text-primary-200' : 'text-neutral-400'}
                `}
              >
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatInterface;
