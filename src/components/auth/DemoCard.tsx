import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Sparkles, Loader2 } from 'lucide-react';

export const DemoCard: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithDemo } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDemoClick = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await loginWithDemo();
      navigate('/dashboard');
    } catch (err) {
      setError('Demo login failed. Please try again.');
      console.error('Demo login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
      <div className="flex items-start gap-4">
        {/* Avatar preview */}
        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white shadow-md">
          <img
            src="/vizier-avatar.svg"
            alt="Vizier Demo"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = 'data:image/svg+xml,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56">
                  <defs>
                    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#FBBF24"/>
                      <stop offset="100%" style="stop-color:#F59E0B"/>
                    </linearGradient>
                  </defs>
                  <rect width="56" height="56" fill="url(#bg)"/>
                  <text x="50%" y="50%" font-family="system-ui, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle" dy=".35em">V</text>
                </svg>
              `);
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-neutral-900">Try the demo</h3>
          </div>

          <p className="text-sm text-neutral-700 mb-4 leading-relaxed">
            See how I analyze <span className="font-semibold">12,847 patients</span> and <span className="font-semibold">47,293 encounters</span>.
            Ask me: <span className="italic">"What are my top diagnoses?"</span>
          </p>

          {error && (
            <p className="text-sm text-red-600 mb-3">{error}</p>
          )}

          <button
            onClick={handleDemoClick}
            disabled={isLoading}
            className="
              w-full py-2.5 px-4
              bg-white hover:bg-neutral-50
              text-neutral-900 font-medium rounded-lg
              border border-neutral-300
              transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2
              text-sm
            "
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Starting demo...' : 'Start demo (no signup required)'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoCard;
