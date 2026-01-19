// src/pages/Insights.tsx
import React, { useState, useEffect, useRef } from 'react';
import { QueryInput } from '../components/insights/QueryInput';
import { SuggestionChips } from '../components/insights/SuggestionChips';
import { ConversationView } from '../components/insights/ConversationView';
import { vannaService } from '../services/vanna.service';
import { recommendChartType } from '../utils/chartRecommendation';
import { FirstInsightPrompt } from '../components/onboarding/FirstInsightPrompt';
import { UpgradePrompt } from '../components/onboarding/UpgradePrompt';

export interface Message {
  id: string;
  role: 'user' | 'vizier';
  content: string;
  timestamp: Date;
  chartType?: string;
  chartData?: Record<string, unknown>[];
  explanation?: string;
  chartReason?: string;
}

const Insights: React.FC = () => {
  // Initialize with greeting message directly
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'vizier',
      content:
        "Hi! I'm ready to answer questions about your healthcare data. What would you like to explore?",
      timestamp: new Date(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

      // Use chart recommendation engine if results exist
      let chartType = response.chart_type;
      let chartReason = '';

      if (response.results && response.results.length > 0) {
        const recommendation = recommendChartType(response.results, text);
        // Use service chart type if specified, otherwise use recommendation
        if (!chartType || chartType === 'table') {
          chartType = recommendation.type;
        }
        chartReason = recommendation.reason;
      }

      const vizierMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'vizier',
        content: response.summary || "Here's what I found:",
        timestamp: new Date(),
        chartType: chartType,
        chartData: response.results,
        explanation: response.follow_up_questions?.length
          ? `You might also want to explore: ${response.follow_up_questions.slice(0, 2).join(', ')}`
          : undefined,
        chartReason: chartReason,
      };
      setMessages((prev) => [...prev, vizierMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'vizier',
        content: "I'm sorry, I encountered an error while processing your question. Please try again.",
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
    const interactions = parseInt(sessionStorage.getItem('demo_interactions') || '0');
    sessionStorage.setItem('demo_interactions', (interactions + 1).toString());
  };

  // Handler for saving insight to dashboard
  const handleSaveInsight = (message: Message) => {
    // Find the question that preceded this answer
    const messageIndex = messages.findIndex((m) => m.id === message.id);
    const questionMessage = messageIndex > 0 ? messages[messageIndex - 1] : null;

    // Save to localStorage for dashboard
    const savedInsights = JSON.parse(
      localStorage.getItem('saved_insights') || '[]'
    );

    const newInsight = {
      id: message.id,
      question: questionMessage?.content || 'Unknown question',
      answer: message.content,
      chartType: message.chartType,
      chartData: message.chartData,
      timestamp: message.timestamp,
      explanation: message.explanation,
    };

    savedInsights.push(newInsight);
    localStorage.setItem('saved_insights', JSON.stringify(savedInsights));

    // Track interaction for upgrade prompt
    const interactions = parseInt(sessionStorage.getItem('demo_interactions') || '0');
    sessionStorage.setItem('demo_interactions', (interactions + 1).toString());

    alert('Insight saved to dashboard!');
  };

  // Handler for exporting data to CSV
  const handleExport = (message: Message) => {
    if (!message.chartData) return;

    // Convert to CSV
    const csv = convertToCSV(message.chartData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vizier-export-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Convert data array to CSV string
  const convertToCSV = (data: Record<string, unknown>[]): string => {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        // Escape commas and quotes in values
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
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
            onSaveInsight={handleSaveInsight}
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
