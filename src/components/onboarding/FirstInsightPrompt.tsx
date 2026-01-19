// src/components/onboarding/FirstInsightPrompt.tsx

import { Sparkles, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';

interface FirstInsightPromptProps {
  onAskQuestion: (question: string) => void;
}

export const FirstInsightPrompt: React.FC<FirstInsightPromptProps> = ({
  onAskQuestion,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAskedFirstQuestion = localStorage.getItem(
      'onboarding_first_question_asked',
    );
    const isDemoMode = localStorage.getItem('is_demo') === 'true';

    if (!hasAskedFirstQuestion && isDemoMode) {
      setIsVisible(true);
    }
  }, []);

  const handleAskQuestion = (question: string) => {
    localStorage.setItem('onboarding_first_question_asked', 'true');
    setIsVisible(false);
    onAskQuestion(question);
  };

  const handleDismiss = () => {
    localStorage.setItem('onboarding_first_question_asked', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const suggestedQuestion = 'What are my top 10 diagnoses?';

  return (
    <div className="mb-6 animate-slide-up">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-2 border-white/20 rounded-2xl p-6 shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Let's start with a common question
              </h3>
              <p className="text-sm text-gray-400">
                Try this to see Vizier in action
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-4">
          <p className="text-white text-lg">{suggestedQuestion}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleAskQuestion(suggestedQuestion)}
            className="flex-1 px-6 py-3 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl transition-all"
          >
            Ask This Question
          </button>
          <button
            onClick={handleDismiss}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
          >
            I'll ask my own
          </button>
        </div>
      </div>
    </div>
  );
};
