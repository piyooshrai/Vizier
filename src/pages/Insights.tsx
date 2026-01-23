// src/pages/Insights.tsx
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { ConversationView } from '../components/insights/ConversationView';
import { QueryInput } from '../components/insights/QueryInput';
import { SuggestionChips } from '../components/insights/SuggestionChips';
import { FirstInsightPrompt } from '../components/onboarding/FirstInsightPrompt';
import { UpgradePrompt } from '../components/onboarding/UpgradePrompt';
import { vannaService } from '../services/vanna.service';
import type { ChartType } from '../types';
import { recommendChartType } from '../utils/chartRecommendation';

export interface Message {
  id: string;
  role: 'user' | 'vizier';
  content: string;
  timestamp: Date;
  chartType?: ChartType;
  chartData?: Record<string, unknown>[];
  explanation?: string;
  chartReason?: string;
  /** For vizier messages, stores the original user question that prompted this response */
  originalQuestion?: string;
  /** For vizier messages, stores the SQL query that was generated */
  sqlQuery?: string;
}

const INSIGHTS_CONVERSATION_STORAGE_KEY = 'vizier_insights_conversation_v1';

type StoredMessage = Omit<Message, 'timestamp'> & { timestamp: string };

const loadStoredMessages = (): Message[] | null => {
  if (typeof globalThis.window === 'undefined') return null;
  const stored = globalThis.localStorage.getItem(
    INSIGHTS_CONVERSATION_STORAGE_KEY,
  );
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored) as StoredMessage[];
    if (!Array.isArray(parsed) || parsed.length === 0) return null;

    return parsed.map((message) => ({
      ...message,
      timestamp: new Date(message.timestamp),
    }));
  } catch (error) {
    console.warn('Failed to load saved Vizier conversation:', error);
    globalThis.localStorage.removeItem(INSIGHTS_CONVERSATION_STORAGE_KEY);
    return null;
  }
};

const persistMessages = (messages: Message[]) => {
  if (typeof globalThis.window === 'undefined') return;
  const stored: StoredMessage[] = messages.map((message) => ({
    ...message,
    timestamp: message.timestamp.toISOString(),
  }));
  try {
    globalThis.localStorage.setItem(
      INSIGHTS_CONVERSATION_STORAGE_KEY,
      JSON.stringify(stored),
    );
  } catch (error) {
    console.warn('Failed to persist Vizier conversation:', error);
  }
};

const clearStoredMessages = () => {
  if (typeof globalThis.window === 'undefined') return;
  globalThis.localStorage.removeItem(INSIGHTS_CONVERSATION_STORAGE_KEY);
};

const Insights: React.FC = () => {
  const defaultMessages: Message[] = [
    {
      id: '1',
      role: 'vizier',
      content:
        "Hi! I'm ready to answer questions about your healthcare data. What would you like to explore?",
      timestamp: new Date(),
    },
  ];
  // Initialize from storage to avoid wiping on route changes
  const [messages, setMessages] = useState<Message[]>(
    () => loadStoredMessages() ?? defaultMessages,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    persistMessages(messages);
  }, [messages]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Scrolling should trigger whenever messages or processing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || isProcessing) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    // Call Vanna service for response
    try {
      const response = await vannaService.ask(text);

      const hasResults = Boolean(
        response.results && response.results.length > 0,
      );

      // Use chart recommendation engine if results exist
      let chartType = response.chart_type;
      let chartReason = '';

      if (hasResults) {
        const recommendation = recommendChartType(response.results ?? [], text);
        // Use service chart type if specified, otherwise use recommendation
        if (!chartType || chartType === 'table') {
          chartType = recommendation.type;
        }
        chartReason = recommendation.reason;
      }

      const noDataMessage =
        response.summary ||
        "I couldn't find any data for that question. Try asking about a different metric or time range.";

      const vizierMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'vizier',
        content: hasResults
          ? response.summary || "Here's what I found:"
          : noDataMessage,
        timestamp: new Date(),
        chartType: hasResults ? chartType : undefined,
        chartData: hasResults ? response.results : undefined,
        explanation:
          hasResults && response.follow_up_questions?.length
            ? `You might also want to explore: ${response.follow_up_questions.slice(0, 2).join(', ')}`
            : undefined,
        chartReason: hasResults ? chartReason : undefined,
        originalQuestion: text, // Store the original user question for this response
        sqlQuery: response.sql, // Store the SQL query for saving to dashboard
      };
      setMessages((prev) => [...prev, vizierMessage]);
    } catch (error) {
      console.error('Error processing question:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'vizier',
        content:
          "I'm sorry, I encountered an error while processing your question. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  // Handler for first question from onboarding
  const handleFirstQuestion = (question: string) => {
    handleSendMessage(question);

    // Track interaction for upgrade prompt
    const interactions = Number.parseInt(
      sessionStorage.getItem('demo_interactions') || '0',
      10,
    );
    sessionStorage.setItem('demo_interactions', (interactions + 1).toString());
  };

  const handleClearChat = () => {
    clearStoredMessages();
    setMessages(defaultMessages);
  };

  // Handler for exporting data to CSV
  const handleExport = (message: Message) => {
    if (!message.chartData) return;

    // Convert to CSV
    const csv = convertToCSV(message.chartData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = globalThis.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vizier-export-${Date.now()}.csv`;
    a.click();
    globalThis.URL.revokeObjectURL(url);
  };

  // Convert data array to CSV string
  const convertToCSV = (data: Record<string, unknown>[]): string => {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          // Escape commas and quotes in values
          if (
            typeof value === 'string' &&
            (value.includes(',') || value.includes('"'))
          ) {
            return `"${value.replaceAll('"', '""')}"`;
          }
          return value;
        })
        .join(','),
    );

    return [headers.join(','), ...rows].join('\n');
  };

  const showSuggestions = messages.length === 1 && !isProcessing;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header - fixed */}
      <div className="flex-shrink-0 border-b border-gray-800 bg-black/50 backdrop-blur-xl px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg">
            <img
              src="/images/vizier-avatar.png"
              alt="Vizier"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Ask Vizier</h1>
            <p className="text-sm text-gray-400">
              Conversational healthcare analytics
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* First Question Prompt */}
          <FirstInsightPrompt onAskQuestion={handleFirstQuestion} />

          <ConversationView
            messages={messages}
            isProcessing={isProcessing}
            onExport={handleExport}
          />

          {showSuggestions && (
            <SuggestionChips onSuggestionClick={handleSuggestionClick} />
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input - fixed */}
      <div className="flex-shrink-0 border-t border-gray-800 bg-black/50 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <QueryInput
            value={inputValue}
            onChange={setInputValue}
            onSend={() => handleSendMessage()}
            onClear={handleClearChat}
            disabled={isProcessing}
          />
        </div>
      </div>

      {/* Upgrade Prompt */}
      <UpgradePrompt />
    </div>
  );
};

export { Insights };
export default Insights;
