import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import { ChatInterface, QueryInput } from '../components/conversation';
import { VizierProvider, useVizier } from '../contexts/VizierContext';

const InsightsContent: React.FC = () => {
  const location = useLocation();
  const { messages, isLoading, suggestions, askQuestion, clearMessages, loadSuggestions } =
    useVizier();

  // Handle initial question from navigation state (e.g., from Upload page)
  useEffect(() => {
    const initialQuestion = location.state?.initialQuestion;
    if (initialQuestion) {
      askQuestion(initialQuestion);
      // Clear the state so it doesn't re-trigger
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.initialQuestion, askQuestion]);

  // Load suggestions on mount
  useEffect(() => {
    loadSuggestions();
  }, [loadSuggestions]);

  const handleSuggestionClick = (suggestion: string) => {
    askQuestion(suggestion);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-neutral-900">
            Healthcare Insights
          </h2>
        </div>

        <button
          onClick={clearMessages}
          className="
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
            text-neutral-500 hover:bg-neutral-100 transition-colors
          "
        >
          <RefreshCw className="w-4 h-4" />
          New conversation
        </button>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-4">
        <ChatInterface
          messages={messages}
          onSuggestionClick={handleSuggestionClick}
        />
      </div>

      {/* Input area */}
      <div className="sticky bottom-0 bg-gradient-to-t from-neutral-50 via-neutral-50 to-transparent pt-4">
        <QueryInput onSubmit={askQuestion} isLoading={isLoading} />

        {/* Suggestions */}
        {messages.length <= 1 && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <p className="text-xs text-neutral-500 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="
                    text-sm px-4 py-2 rounded-lg
                    bg-white border border-neutral-200
                    text-neutral-700 hover:border-primary-300 hover:text-primary-600
                    hover:shadow-sm transition-all
                  "
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export const Insights: React.FC = () => {
  return (
    <VizierProvider>
      <InsightsContent />
    </VizierProvider>
  );
};

export default Insights;
