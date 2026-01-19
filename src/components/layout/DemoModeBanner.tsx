import { Sparkles } from 'lucide-react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';

export const DemoModeBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <p className="text-sm text-amber-900">
            <span className="font-semibold">Demo Mode</span> - You're exploring
            with sample healthcare data (12,847 patients, 47,293 encounters).{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="ml-2 underline hover:text-amber-950 font-medium"
            >
              Create your account to upload your own data
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemoModeBanner;
