import React, { createContext, useContext, useState, useCallback } from 'react';
import { vannaService, createUserMessage, createVizierMessage, Message } from '../services';
import { VannaResponse } from '../types';

interface VizierContextType {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  suggestions: string[];
  askQuestion: (question: string) => Promise<void>;
  clearMessages: () => void;
  loadSuggestions: () => Promise<void>;
}

const VizierContext = createContext<VizierContextType | undefined>(undefined);

// Generate conversational responses based on the data
function generateConversationalResponse(data: VannaResponse): string {
  const results = data.results;

  if (!results || results.length === 0) {
    return "I looked through your data but couldn't find any results for that question. Could you try rephrasing it?";
  }

  const count = results.length;

  // Generic response based on chart type
  const responses: Record<string, string> = {
    bar_chart: `I found ${count} categories in your data. Here's what I see:`,
    line_chart: `I've analyzed the trend across ${count} data points. Here's the pattern:`,
    pie_chart: `I've broken down your data into ${count} segments:`,
    donut_chart: `Here's how your data is distributed across ${count} categories:`,
    big_number: `Here's the key metric you asked about:`,
    table: `I found ${count} records that match your query:`,
    horizontal_bar_chart: `Here's a comparison across ${count} items:`,
    histogram: `I've analyzed the distribution of your data:`,
    box_plot: `Here's the statistical summary of your data:`,
    gauge_chart: `Here's the current status:`,
  };

  return responses[data.chart_type] || `I found ${count} results for your question:`;
}

export const VizierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([
    createVizierMessage(
      "Hello! I'm Vizier, your healthcare analytics assistant. I've analyzed your data and I'm ready to help you find insights. What would you like to know?"
    ),
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([
    'What are my top 10 diagnoses by patient volume?',
    'Show me patient demographics breakdown',
    'What is my readmission rate?',
  ]);

  const askQuestion = useCallback(async (question: string) => {
    // Add user message
    const userMessage = createUserMessage(question);
    setMessages((prev) => [...prev, userMessage]);

    // Add loading message from Vizier
    const loadingMessage = createVizierMessage('', undefined, true);
    setMessages((prev) => [...prev, loadingMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await vannaService.ask(question);

      // Replace loading message with actual response
      const vizierMessage = createVizierMessage(
        generateConversationalResponse(response),
        response
      );

      setMessages((prev) => {
        const withoutLoading = prev.filter((m) => m.id !== loadingMessage.id);
        return [...withoutLoading, vizierMessage];
      });

      // Update suggestions if provided
      if (response.follow_up_questions && response.follow_up_questions.length > 0) {
        setSuggestions(response.follow_up_questions);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';

      const vizierErrorMessage = createVizierMessage(
        "I'm sorry, I had trouble understanding that question. Could you try rephrasing it?",
        undefined,
        false,
        true
      );

      setMessages((prev) => {
        const withoutLoading = prev.filter((m) => m.id !== loadingMessage.id);
        return [...withoutLoading, vizierErrorMessage];
      });

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([
      createVizierMessage(
        "Hello! I'm Vizier, your healthcare analytics assistant. I've analyzed your data and I'm ready to help you find insights. What would you like to know?"
      ),
    ]);
    setError(null);
  }, []);

  const loadSuggestions = useCallback(async () => {
    try {
      const newSuggestions = await vannaService.getSuggestions();
      setSuggestions(newSuggestions);
    } catch {
      // Keep default suggestions on error
    }
  }, []);

  return (
    <VizierContext.Provider
      value={{
        messages,
        isLoading,
        error,
        suggestions,
        askQuestion,
        clearMessages,
        loadSuggestions,
      }}
    >
      {children}
    </VizierContext.Provider>
  );
};

export const useVizier = (): VizierContextType => {
  const context = useContext(VizierContext);
  if (!context) {
    throw new Error('useVizier must be used within VizierProvider');
  }
  return context;
};

export default VizierContext;
