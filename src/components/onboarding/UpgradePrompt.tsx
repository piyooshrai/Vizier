// src/components/onboarding/UpgradePrompt.tsx

import { ArrowRight, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export const UpgradePrompt: React.FC = () => {
  const { isDemoMode } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isDemoMode) return;

    // Track interactions
    const interactions = Number.parseInt(
      sessionStorage.getItem('demo_interactions') || '0',
      10,
    );

    // Show after 3 interactions (questions asked, insights saved, etc.)
    if (interactions >= 3 && !sessionStorage.getItem('upgrade_prompt_shown')) {
      setIsVisible(true);
    }
  }, [isDemoMode]);

  const handleDismiss = () => {
    sessionStorage.setItem('upgrade_prompt_shown', 'true');
    setIsVisible(false);
  };

  if (!isVisible || !isDemoMode) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-md animate-slide-up">
      <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-white/20 rounded-2xl p-6 shadow-2xl">
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-2">
          Ready to analyze your own data?
        </h3>
        <p className="text-gray-400 mb-6">
          You've explored the demo. Now see what Vizier can do with your actual
          healthcare data.
        </p>

        <a
          href="/"
          className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl transition-all"
        >
          Create Your Account
          <ArrowRight className="w-5 h-5" />
        </a>

        <p className="text-xs text-gray-500 mt-3 text-center">
          Free trial • No credit card required
        </p>
      </div>
    </div>
  );
};
