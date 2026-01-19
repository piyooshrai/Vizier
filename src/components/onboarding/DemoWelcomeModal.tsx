// src/components/onboarding/DemoWelcomeModal.tsx

import { Activity, Sparkles, TrendingUp, Users, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';

interface DemoWelcomeModalProps {
  onStartTour: () => void;
  onClose: () => void;
}

export const DemoWelcomeModal: React.FC<DemoWelcomeModalProps> = ({
  onStartTour,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen this before
    const hasSeenWelcome = localStorage.getItem('onboarding_welcome_shown');
    const isDemoMode = localStorage.getItem('is_demo') === 'true';

    if (!hasSeenWelcome && isDemoMode) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('onboarding_welcome_shown', 'true');
    setIsVisible(false);
    onClose();
  };

  const handleStartTour = () => {
    localStorage.setItem('onboarding_welcome_shown', 'true');
    setIsVisible(false);
    onStartTour();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl max-w-2xl w-full shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="p-8 border-b border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-black"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Vizier Logo"
                >
                  <title>Vizier Logo</title>
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">
                  Welcome to Vizier Demo
                </h2>
                <p className="text-gray-400 mt-1">
                  Explore healthcare analytics intelligence
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            You're exploring sample data from a mid-sized healthcare system. No
            account needed—just experience how Vizier transforms complex
            healthcare data into conversational insights.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <Users className="w-8 h-8 text-white mb-2" />
              <p className="text-2xl font-bold text-white">12,847</p>
              <p className="text-sm text-gray-400">Patients</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <Activity className="w-8 h-8 text-white mb-2" />
              <p className="text-2xl font-bold text-white">47,293</p>
              <p className="text-sm text-gray-400">Encounters</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <TrendingUp className="w-8 h-8 text-white mb-2" />
              <p className="text-2xl font-bold text-white">10 months</p>
              <p className="text-sm text-gray-400">Data range</p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">
                  Ask questions in plain English
                </p>
                <p className="text-sm text-gray-400">
                  "What are my top diagnoses?" or "Show me readmission trends"
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">
                  Get intelligent visualizations
                </p>
                <p className="text-sm text-gray-400">
                  Charts chosen automatically based on your question and data
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">
                  Save and export insights
                </p>
                <p className="text-sm text-gray-400">
                  Build a library of analytics for your team
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleStartTour}
              className="flex-1 px-6 py-4 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl transition-all shadow-lg"
            >
              Take a Quick Tour
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all border border-gray-700"
            >
              Skip to Dashboard
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Ready to upload your own data?{' '}
            <a href="/" className="text-white hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
