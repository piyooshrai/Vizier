// src/components/upload/ProcessingAnimation.tsx
import React from 'react';
import { Check } from 'lucide-react';

interface ProcessingStep {
  name: string;
  completed: boolean;
}

interface ProcessingAnimationProps {
  steps: ProcessingStep[];
  progress: number;
}

export const ProcessingAnimation: React.FC<ProcessingAnimationProps> = ({
  steps,
  progress,
}) => {
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

      <div className="relative w-full max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Avatar and branding */}
          <div className="flex flex-col items-center lg:items-start space-y-8">
            {/* Avatar */}
            <div className="w-64 h-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-gray-800 flex items-center justify-center">
              <svg
                className="w-32 h-32 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
            </div>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-xl">
                <svg
                  className="w-7 h-7 text-black"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
              </div>
              <span className="text-3xl font-bold text-white tracking-wide">
                VIZIER
              </span>
            </div>

            {/* Conversational message */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl max-w-md border border-gray-300/20">
              <p className="text-gray-800 leading-relaxed">
                Analyzing your data... I can see this is encounter data from your
                healthcare system. I'm identifying patient cohorts, diagnostic
                patterns, and outcome indicators.
              </p>
            </div>
          </div>

          {/* Right side - Progress */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-300/20">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Processing your files...
              </h2>
              <p className="text-gray-600">
                {steps.filter((s) => s.completed).length} of {steps.length}{' '}
                steps complete
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-4 mb-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    step.completed
                      ? 'bg-green-50 border-2 border-green-500'
                      : 'bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.completed
                        ? 'bg-green-500'
                        : 'bg-gray-300 animate-pulse'
                    }`}
                  >
                    {step.completed && (
                      <Check className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <span
                    className={`font-medium ${
                      step.completed ? 'text-green-900' : 'text-gray-700'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Overall progress</span>
                <span className="font-semibold text-gray-900">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gray-900 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingAnimation;
