// src/components/upload/UploadComplete.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

export const UploadComplete: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
      {/* Subtle grid overlay */}
      <div
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative w-full max-w-2xl text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-8 shadow-2xl">
          <CheckCircle className="w-14 h-14 text-white" />
        </div>

        <h1 className="text-5xl font-bold text-white mb-4">
          Analysis complete!
        </h1>

        <p className="text-2xl text-gray-300 mb-12 max-w-xl mx-auto leading-relaxed">
          I've structured 47,293 encounters across 12,847 unique patients.
          Ready to answer your questions.
        </p>

        <button
          onClick={() => navigate('/insights')}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 text-black font-bold rounded-2xl transition-all shadow-lg hover:shadow-2xl text-lg"
        >
          Start asking questions
          <ArrowRight className="w-6 h-6" />
        </button>

        <div className="mt-16 p-8 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl max-w-lg mx-auto border border-yellow-500/10">
          <h3 className="font-semibold text-gray-900 mb-4 text-lg">
            Try asking me:
          </h3>
          <div className="space-y-3 text-left">
            {[
              'What are my top 10 diagnoses by volume?',
              'Show me readmission rates by condition',
              'Which patients have the highest costs?',
              'What is my average length of stay?',
            ].map((question, i) => (
              <div
                key={i}
                className="flex items-start gap-3 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                <span>{question}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadComplete;
