import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import { ChatInterface, QueryInput } from '../components/conversation';
import { Toast } from '../components/common';
import { VizierProvider, useVizier } from '../contexts/VizierContext';
import { VannaResponse } from '../types';
import { savedInsightsManager } from '../utils/savedInsights';

const InsightsContent: React.FC = () => {
  const location = useLocation();
  const { messages, isLoading, suggestions, askQuestion, clearMessages, loadSuggestions } =
    useVizier();
  const [savedQuestions, setSavedQuestions] = useState<Set<string>>(new Set());
  const [showToast, setShowToast] = useState(false);

  // Load already saved questions on mount
  useEffect(() => {
    const saved = savedInsightsManager.getAll();
    setSavedQuestions(new Set(saved.map((s) => s.question)));
  }, []);

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

  // Handle saving insight to dashboard
  const handleSaveInsight = useCallback((question: string, data: VannaResponse) => {
    if (!data.results || data.results.length === 0) return;

    savedInsightsManager.save({
      question,
      answer: data.summary || "Here's what I found:",
      data: data.results,
      chartType: data.chart_type,
      chartTitle: data.chart_title,
    });

    setSavedQuestions((prev) => new Set(prev).add(question));
    setShowToast(true);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-4xl mx-auto px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-semibold text-white">
            Ask Vizier
          </h2>
        </div>

        <button
          onClick={clearMessages}
          className="
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
            text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors
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
          onSaveInsight={handleSaveInsight}
          savedQuestions={savedQuestions}
        />
      </div>

      {/* Input area */}
      <div className="sticky bottom-0 pt-4">
        <QueryInput onSubmit={askQuestion} isLoading={isLoading} />

        {/* Suggestions */}
        {messages.length <= 1 && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
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
                    bg-gray-800/50 border border-gray-700
                    text-gray-300 hover:border-yellow-500/50 hover:text-yellow-500
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

      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <Toast
            message="Insight saved to dashboard!"
            type="success"
            onClose={() => setShowToast(false)}
          />
        )}
      </AnimatePresence>
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
