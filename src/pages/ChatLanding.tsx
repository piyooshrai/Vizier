// src/pages/ChatLanding.tsx
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoalCard } from '../components/chat/GoalCard';
import { InlineAuth } from '../components/chat/InlineAuth';
import { MessageBubble } from '../components/chat/MessageBubble';
import { TrustBadges } from '../components/chat/TrustBadges';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { useAuth } from '../hooks/useAuth';

interface Message {
  id: string;
  role: 'vizier' | 'user';
  content: string;
  timestamp: Date;
  showAuth?: boolean;
}

const ChatLanding: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithDemo } = useAuth();
  // Initialize with greeting message directly
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'vizier',
      content:
        "Good evening. I'm Vizier, your healthcare analytics intelligence.\n\nI help executive teams transform complex healthcare data into clear, actionable insights—through conversation, not dashboards.\n\nWhat would you like to accomplish?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showGoals, setShowGoals] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length || isTyping) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isTyping]);

  const handleGoalSelect = (goal: string) => {
    const goalMessages: Record<string, string> = {
      outcomes: 'I want to improve patient outcomes and reduce readmissions',
      operations: 'I need to optimize our operations and improve efficiency',
      revenue: 'I want to maximize revenue and improve billing compliance',
    };

    setInputValue(goalMessages[goal]);
    setShowGoals(false);
    setTimeout(() => handleSendMessage(goalMessages[goal]), 300);
  };

  const handleSendMessage = (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setShowGoals(false);

    // Show typing indicator
    setIsTyping(true);

    // Simulate Vizier response
    setTimeout(() => {
      setIsTyping(false);

      const vizierResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'vizier',
        content:
          "Excellent. I can help you with that.\n\nTo provide you with personalized insights, I'll need access to your healthcare data. I can work with exports from Epic, Cerner, Allscripts, or most EHR systems.\n\nLet's get you set up. What's your work email?",
        timestamp: new Date(),
        showAuth: true,
      };

      setMessages((prev) => [...prev, vizierResponse]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDemo = async () => {
    try {
      await loginWithDemo();
      navigate('/upload');
    } catch (error) {
      console.error('Demo failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative">
      {/* Subtle grid overlay */}
      <div
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-xl">
                <img
                  src="/images/vizier-avatar.png"
                  alt="Vizier"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-3xl font-bold text-white tracking-wide">
                VIZIER
              </span>
            </div>
            <p className="text-gray-400 text-sm font-light tracking-wide">
              Healthcare Analytics Intelligence
            </p>
          </div>

          {/* Main Chat Interface */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-300/20">
            {/* Messages Area */}
            <div className="p-8 space-y-6 min-h-[500px] max-h-[600px] overflow-y-auto">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {isTyping && <TypingIndicator />}

              {/* Goal Cards - Show after initial message, hide after selection */}
              {showGoals && messages.length === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 px-14 animate-fade-in">
                  <GoalCard
                    icon="outcomes"
                    title="Patient Outcomes"
                    description="Quality measures, readmissions"
                    color="blue"
                    onClick={() => handleGoalSelect('outcomes')}
                  />
                  <GoalCard
                    icon="operations"
                    title="Operations"
                    description="Efficiency, capacity, flow"
                    color="green"
                    onClick={() => handleGoalSelect('operations')}
                  />
                  <GoalCard
                    icon="revenue"
                    title="Revenue"
                    description="Optimization, compliance"
                    color="purple"
                    onClick={() => handleGoalSelect('revenue')}
                  />
                </div>
              )}

              {/* Inline Auth Form */}
              {messages.at(-1)?.showAuth && (
                <div className="px-14">
                  <InlineAuth onComplete={() => navigate('/upload')} />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    rows={1}
                    placeholder="Describe your challenge in your own words..."
                    className="w-full px-5 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 resize-none text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim()}
                  className="px-6 py-3.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  aria-label="Send message"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-labelledby="send-icon-title"
                  >
                    <title id="send-icon-title">Send Icon</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>

              {/* Demo hint and Sign in */}
              <div className="mt-4 flex flex-col items-center justify-center gap-3">
                <div className="flex items-center justify-center gap-2 text-xs">
                  <span className="text-gray-400">Not ready to commit?</span>
                  <button
                    type="button"
                    onClick={handleDemo}
                    className="text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-labelledby="demo-icon-title"
                    >
                      <title id="demo-icon-title">Demo Icon</title>
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    Try with sample data
                  </button>
                </div>

                <div className="w-full max-w-[200px] border-t border-gray-100/50" />

                <div className="text-xs text-gray-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="font-semibold text-gray-900 hover:text-gray-700 transition-colors"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <TrustBadges />
        </div>
      </div>
    </div>
  );
};

export default ChatLanding;
