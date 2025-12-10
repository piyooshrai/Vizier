import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, MessageSquare } from 'lucide-react';
import { Button } from '../common';

interface UploadCompleteProps {
  summary?: {
    totalPatients?: number;
    totalEncounters?: number;
    dateRange?: string;
  };
  onStartAsking?: () => void;
}

export const UploadComplete: React.FC<UploadCompleteProps> = ({
  summary,
  onStartAsking,
}) => {
  const navigate = useNavigate();

  const handleStartAsking = () => {
    if (onStartAsking) {
      onStartAsking();
    } else {
      navigate('/insights');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-[60vh] flex items-center justify-center"
    >
      <div className="max-w-2xl w-full text-center px-4">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-12 h-12 text-success-600" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-neutral-900 mb-3"
        >
          Analysis complete!
        </motion.h1>

        {/* Summary */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-neutral-600 mb-8 max-w-lg mx-auto"
        >
          {summary ? (
            <>
              I've structured{' '}
              <span className="font-semibold text-neutral-900">
                {summary.totalEncounters?.toLocaleString() || 'your'}
              </span>{' '}
              encounters across{' '}
              <span className="font-semibold text-neutral-900">
                {summary.totalPatients?.toLocaleString() || 'your'}
              </span>{' '}
              unique patients. Ready to answer your questions.
            </>
          ) : (
            "Your data has been processed and is ready for analysis. I'm ready to answer your questions."
          )}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={handleStartAsking}
            size="lg"
            className="inline-flex items-center gap-3 px-8 py-4 text-lg"
          >
            <MessageSquare className="w-5 h-5" />
            Start asking questions
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Sample Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-6 bg-white rounded-2xl shadow-card max-w-lg mx-auto"
        >
          <h3 className="font-semibold text-neutral-900 mb-4">Try asking me:</h3>
          <div className="space-y-2 text-left">
            {[
              'What are my top 10 diagnoses by volume?',
              'Show me readmission rates by condition',
              'Which patients have the highest costs?',
              'What is my average length of stay?',
            ].map((question, i) => (
              <button
                key={i}
                onClick={() => {
                  navigate('/insights', { state: { initialQuestion: question } });
                }}
                className="flex items-start gap-2 text-neutral-700 hover:text-primary-600 transition-colors w-full text-left"
              >
                <span className="text-primary-600 mt-0.5">•</span>
                <span>{question}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UploadComplete;
