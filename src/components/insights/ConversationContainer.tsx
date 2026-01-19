import { AnimatePresence } from 'framer-motion';
import type React from 'react';
import { useEffect, useRef } from 'react';
import type { VannaResponse } from '../../types';
import { MessageBubble } from './MessageBubble';
import { SuggestionChips } from './SuggestionChips';
import { TypingIndicator } from './TypingIndicator';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: VannaResponse;
  isLoading?: boolean;
  isError?: boolean;
}

interface ConversationContainerProps {
  messages: Message[];
  isLoading?: boolean;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  onSaveInsight?: (data: VannaResponse) => void;
  savedQuestions?: Set<string>;
  emptyStateContent?: React.ReactNode;
}

export const ConversationContainer: React.FC<ConversationContainerProps> = ({
  messages,
  isLoading = false,
  suggestions = [],
  onSuggestionClick,
  onSaveInsight,
  savedQuestions = new Set(),
  emptyStateContent,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Show empty state if no messages
  if (messages.length === 0 && emptyStateContent) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        {emptyStateContent}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-6 custom-scrollbar"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              id={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
              data={message.data}
              isLoading={message.isLoading}
              isError={message.isError}
              onSave={onSaveInsight}
              isSaved={
                message.data ? savedQuestions.has(message.content) : false
              }
            />
          ))}

          {/* Typing Indicator */}
          {isLoading && !messages.some((m) => m.isLoading) && (
            <TypingIndicator key="typing" />
          )}
        </AnimatePresence>

        {/* Follow-up Suggestions */}
        {!isLoading && suggestions.length > 0 && messages.length > 0 && (
          <div className="pt-4">
            <SuggestionChips
              suggestions={suggestions}
              onSuggestionClick={onSuggestionClick || (() => {})}
              title="You might also want to ask:"
              variant="compact"
            />
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ConversationContainer;
