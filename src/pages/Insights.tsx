// src/pages/Insights.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { QueryInput } from '../components/insights/QueryInput';
import { SuggestionChips } from '../components/insights/SuggestionChips';
import { ConversationView } from '../components/insights/ConversationView';

export interface Message {
  id: string;
  role: 'user' | 'vizier';
  content: string;
  timestamp: Date;
  chartType?: string;
  chartData?: any;
  explanation?: string;
  chartReason?: string;
}

const Insights: React.FC = () => {
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting
    setMessages([
      {
        id: '1',
        role: 'vizier',
        content:
          "Hi! I'm ready to answer questions about your healthcare data. What would you like to explore?",
        timestamp: new Date(),
      },
    ]);

    // Check if there's an initial question from navigation
    if (location.state?.initialQuestion) {
      setTimeout(() => {
        handleSendMessage(location.state.initialQuestion);
      }, 500);
    }
  }, []);

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

    // Placeholder - will be implemented in Phase 3
    setTimeout(() => {
      const vizierMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'vizier',
        content:
          "I'll answer that question in Phase 3 when we add the chart rendering and demo data.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, vizierMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
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
  const convertToCSV = (data: any[]): string => {
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
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-xl px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-500 flex items-center justify-center shadow-lg">
            <svg
              className="w-5 h-5 text-black"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
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

      {/* Input Area */}
      <div className="border-t border-gray-800 bg-black/50 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <QueryInput
            value={inputValue}
            onChange={setInputValue}
            onSend={() => handleSendMessage()}
            disabled={isProcessing}
          />
        </div>
      </div>
    </div>
  );
};

export { Insights };
export default Insights;
