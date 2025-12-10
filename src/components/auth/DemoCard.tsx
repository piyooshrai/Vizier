import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Play, Loader2 } from 'lucide-react';

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
    <button
      onClick={handleDemoClick}
      disabled={isLoading}
      className="
        w-full p-4
        bg-slate-50 hover:bg-slate-100
        rounded-xl border border-slate-200
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        group text-left
      "
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-900">
            {isLoading ? 'Starting demo...' : 'Try the interactive demo'}
          </p>
          <p className="text-sm text-slate-500 truncate">
            Explore with 12,847 sample patients — no signup needed
          </p>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </button>
  );
};

export default DemoCard;
