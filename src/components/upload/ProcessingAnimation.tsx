import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ProcessingAnimationProps {
  completedSteps: string[];
  currentStep: string;
  progress: number;
}

const allSteps = [
  'Patient demographics recognized',
  'Diagnosis codes validated',
  'Encounter patterns identified',
  'Quality measures detected',
];

export const ProcessingAnimation: React.FC<ProcessingAnimationProps> = ({
  completedSteps,
  currentStep,
  progress,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 p-4">
      <div className="max-w-5xl w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Avatar and branding */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center lg:items-start space-y-6"
          >
            {/* Avatar */}
            <div className="w-48 h-48 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-24 h-24 text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 9L12 15L18 9" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="6" r="2" fill="currentColor" />
              </svg>
            </div>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9L12 15L18 9" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="6" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <span className="text-3xl font-bold text-neutral-900">VIZIER</span>
            </div>

            {/* Conversational message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-card max-w-md"
            >
              <p className="text-neutral-700 leading-relaxed">
                Analyzing your data... I can see this is encounter data from your healthcare system.
                I'm identifying patient cohorts, diagnostic patterns, and outcome indicators.
              </p>
            </motion.div>
          </motion.div>

          {/* Right side - Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-8 shadow-2xl"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
                Analyzing {allSteps.length} data sources...
              </h2>
              <p className="text-neutral-500">
                {completedSteps.length} of {allSteps.length} complete
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-4 mb-8">
              {allSteps.map((step, index) => {
                const isComplete = completedSteps.includes(step);
                const isCurrent = currentStep === step;

                return (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      flex items-center gap-4 p-4 rounded-xl transition-all duration-300
                      ${isComplete
                        ? 'bg-success-50'
                        : isCurrent
                          ? 'bg-primary-50'
                          : 'bg-neutral-50'
                      }
                    `}
                  >
                    <div
                      className={`
                        w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
                        ${isComplete
                          ? 'bg-success-500'
                          : isCurrent
                            ? 'bg-primary-500'
                            : 'bg-neutral-300'
                        }
                      `}
                    >
                      {isComplete && <Check className="w-4 h-4 text-white" />}
                      {isCurrent && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-2 h-2 bg-white rounded-full"
                        />
                      )}
                    </div>
                    <span
                      className={`
                        font-medium
                        ${isComplete
                          ? 'text-success-900'
                          : isCurrent
                            ? 'text-primary-900'
                            : 'text-neutral-600'
                        }
                      `}
                    >
                      {step}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Progress</span>
                <span className="font-semibold text-primary-700">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingAnimation;
