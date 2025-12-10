// src/components/dashboard/EmptyDashboard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, MessageSquare } from 'lucide-react';

interface EmptyDashboardProps {
  isDemoMode?: boolean;
}

export const EmptyDashboard: React.FC<EmptyDashboardProps> = ({
  isDemoMode = false,
}) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-16">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
        <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-white mb-3">
        Your dashboard is empty
      </h2>

      <p className="text-gray-400 max-w-md mx-auto mb-8">
        {isDemoMode
          ? 'Explore the insights page and save your favorite visualizations here for quick access.'
          : 'Save insights from your conversations to build your personalized dashboard.'}
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
        {isDemoMode ? (
          <button
            onClick={() => navigate('/insights')}
            className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold rounded-xl transition-all shadow-lg inline-flex items-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            Start asking questions
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate('/upload')}
              className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold rounded-xl transition-all shadow-lg inline-flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Upload data
            </button>
            <button
              onClick={() => navigate('/insights')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all border border-gray-600 shadow-lg inline-flex items-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Ask questions
            </button>
          </>
        )}
      </div>

      {/* Tips */}
      <div className="p-6 bg-gray-900/50 rounded-xl max-w-lg mx-auto border border-gray-700">
        <h3 className="font-semibold text-white mb-4">
          How to build your dashboard
        </h3>
        <div className="space-y-3 text-left">
          {[
            'Ask questions in the Insights page',
            'Click "Save to Dashboard" on any visualization',
            'Your saved insights will appear here',
          ].map((tip, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-black">{index + 1}</span>
              </div>
              <p className="text-sm text-gray-300">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyDashboard;
