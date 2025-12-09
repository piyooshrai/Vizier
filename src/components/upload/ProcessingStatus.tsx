import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';
import { PipelineStatus } from '../../types';
import { pipelineService } from '../../services';

interface ProcessingStatusProps {
  uploadRunId: string;
  onComplete: (status: PipelineStatus) => void;
  onError: (error: string) => void;
}

interface ProcessingStep {
  id: string;
  label: string;
  description: string;
}

const PROCESSING_STEPS: ProcessingStep[] = [
  {
    id: 'discover_files',
    label: 'Discovering file structure',
    description: 'Identifying the format of your healthcare data',
  },
  {
    id: 'validate_files',
    label: 'Validating healthcare data',
    description: 'Ensuring data quality and completeness',
  },
  {
    id: 'create_schema',
    label: 'Mapping data relationships',
    description: 'Understanding how your data connects',
  },
  {
    id: 'load_staging',
    label: 'Processing patient records',
    description: 'Organizing your healthcare data for analysis',
  },
  {
    id: 'analyze_quality',
    label: 'Analyzing data quality',
    description: 'Identifying patterns and anomalies',
  },
  {
    id: 'build_analytics',
    label: 'Building analytics views',
    description: 'Creating optimized views for fast queries',
  },
  {
    id: 'generate_insights',
    label: 'Generating initial insights',
    description: 'Preparing your data for exploration',
  },
];

const CONVERSATIONAL_MESSAGES = [
  "I can see this is healthcare encounter data. Let me organize it properly...",
  "Interesting patterns emerging in your patient demographics...",
  "I'm identifying diagnostic codes and mapping relationships...",
  "Building connections between patients, encounters, and conditions...",
  "Almost there! Creating the analytics layer for fast queries...",
];

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  uploadRunId,
  onComplete,
  onError,
}) => {
  const [status, setStatus] = useState<PipelineStatus | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);

  // Poll for status updates
  useEffect(() => {
    let isMounted = true;

    const pollStatus = async () => {
      try {
        await pipelineService.pollStatus(
          uploadRunId,
          (newStatus) => {
            if (isMounted) {
              setStatus(newStatus);
              if (newStatus.status === 'completed') {
                onComplete(newStatus);
              } else if (newStatus.status === 'failed') {
                onError(newStatus.error_message || 'Processing failed');
              }
            }
          },
          2000,
          150
        );
      } catch (error) {
        if (isMounted) {
          onError(error instanceof Error ? error.message : 'Processing failed');
        }
      }
    };

    pollStatus();

    return () => {
      isMounted = false;
    };
  }, [uploadRunId, onComplete, onError]);

  // Rotate conversational messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % CONVERSATIONAL_MESSAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentStepIndex = status
    ? PROCESSING_STEPS.findIndex((s) => s.id === status.current_step)
    : 0;

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* Left side - Avatar and message */}
      <div className="flex flex-col items-center text-center lg:sticky lg:top-8">
        {/* Vizier Avatar */}
        <motion.div
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-lg mb-6"
        >
          <svg viewBox="0 0 24 24" className="w-16 h-16 text-white" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9L12 15L18 9" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="6" r="2" fill="currentColor" />
          </svg>
        </motion.div>

        <h3 className="text-xl font-semibold text-neutral-900 mb-2">Vizier</h3>

        {/* Conversational message */}
        <motion.div
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-neutral-100 rounded-2xl rounded-tl-sm px-6 py-4 max-w-sm"
        >
          <p className="text-neutral-700">
            {CONVERSATIONAL_MESSAGES[messageIndex]}
          </p>
        </motion.div>
      </div>

      {/* Right side - Progress steps */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">
            Analyzing your data...
          </h3>
          <span className="text-sm font-medium text-primary-600">
            {status?.progress_percent || 0}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${status?.progress_percent || 0}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Steps list */}
        <div className="space-y-3">
          {PROCESSING_STEPS.map((step, index) => {
            const isCompleted =
              status?.completed_steps.includes(step.id) || false;
            const isCurrent = status?.current_step === step.id;
            const isPending = index > currentStepIndex;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  flex items-start gap-3 p-3 rounded-lg transition-colors
                  ${isCurrent ? 'bg-primary-50' : ''}
                `}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {isCompleted && (
                    <CheckCircle className="w-5 h-5 text-success-500" />
                  )}
                  {isCurrent && (
                    <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
                  )}
                  {isPending && (
                    <Circle className="w-5 h-5 text-neutral-300" />
                  )}
                </div>

                <div className="flex-1">
                  <p
                    className={`
                      text-sm font-medium
                      ${isCompleted ? 'text-success-700' : ''}
                      ${isCurrent ? 'text-primary-700' : ''}
                      ${isPending ? 'text-neutral-400' : ''}
                    `}
                  >
                    {step.label}
                  </p>
                  <p
                    className={`
                      text-xs mt-0.5
                      ${isCompleted ? 'text-success-600' : ''}
                      ${isCurrent ? 'text-primary-600' : ''}
                      ${isPending ? 'text-neutral-400' : ''}
                    `}
                  >
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;
