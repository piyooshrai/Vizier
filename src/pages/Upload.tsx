import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, AlertCircle, HelpCircle, Lock } from 'lucide-react';
import { Button, Card } from '../components/common';
import { FileDropZone, UploadProgress, ProcessingStatus } from '../components/upload';
import { pipelineService, getErrorMessage } from '../services';
import { PipelineStatus } from '../types';
import { formatNumber } from '../utils/formatters';
import { useAuth } from '../contexts/AuthContext';

type UploadState = 'select' | 'uploading' | 'processing' | 'complete' | 'error';

export const Upload: React.FC = () => {
  const navigate = useNavigate();
  const { isDemoMode } = useAuth();
  const [state, setState] = useState<UploadState>('select');
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [uploadRunId, setUploadRunId] = useState<string | null>(null);
  const [completedStatus, setCompletedStatus] = useState<PipelineStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setError(null);
  }, []);

  const handleUpload = async () => {
    if (files.length === 0) return;

    // Check for demo mode restriction
    if (isDemoMode) {
      setError('Upload is disabled in demo mode. Create an account to upload your own data.');
      return;
    }

    setState('uploading');
    setError(null);

    try {
      const response = await pipelineService.uploadAndTrigger(files, (progress) => {
        // Calculate which file we're on based on overall progress
        const fileIndex = Math.floor((progress / 100) * files.length);
        setCurrentFileIndex(Math.min(fileIndex, files.length - 1));
        setUploadProgress(progress);
      });

      setUploadRunId(response.upload_run_id);
      setState('processing');
    } catch (err) {
      setError(getErrorMessage(err));
      setState('error');
    }
  };

  const handleProcessingComplete = useCallback((status: PipelineStatus) => {
    setCompletedStatus(status);
    setState('complete');
  }, []);

  const handleProcessingError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setState('error');
  }, []);

  const handleStartOver = () => {
    setState('select');
    setFiles([]);
    setUploadProgress(0);
    setCurrentFileIndex(0);
    setUploadRunId(null);
    setCompletedStatus(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {/* Select Files State */}
        {state === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Demo Mode Restriction Banner */}
            {isDemoMode && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      Upload is disabled in demo mode
                    </p>
                    <p className="text-sm text-amber-700 mt-1">
                      You're viewing sample data. To upload your own healthcare data,{' '}
                      <button
                        onClick={() => navigate('/signup')}
                        className="underline hover:text-amber-900 font-medium"
                      >
                        create an account
                      </button>
                      .
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Header with Vizier message */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9L12 15L18 9" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="6" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  Share your healthcare data with me
                </h2>
                <p className="mt-2 text-neutral-600 max-w-lg mx-auto">
                  I can work with CSV exports from Epic, Cerner, Allscripts, and most other EHR systems.
                  I'll analyze your data and prepare it for exploration.
                </p>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
                <p className="text-sm text-error-600">{error}</p>
              </div>
            )}

            {/* Drop Zone */}
            <Card variant="elevated" padding="lg">
              <FileDropZone onFilesSelected={handleFilesSelected} />

              {files.length > 0 && (
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <Button
                    onClick={handleUpload}
                    size="lg"
                    fullWidth
                    icon={<ArrowRight className="w-5 h-5" />}
                    iconPosition="right"
                  >
                    Continue with {files.length} file{files.length > 1 ? 's' : ''}
                  </Button>
                </div>
              )}
            </Card>

            {/* Help Section */}
            <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-lg">
              <HelpCircle className="w-5 h-5 text-neutral-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-neutral-700">Need help with file formats?</p>
                <p className="text-sm text-neutral-500 mt-1">
                  Most EHR systems can export data as CSV files. Look for "Export" or "Reports" in your system.
                  Common files include patients.csv, encounters.csv, conditions.csv, and observations.csv.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Uploading State */}
        {state === 'uploading' && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card variant="elevated" padding="lg">
              <div className="text-center mb-8">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9L12 15L18 9" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="6" r="1.5" fill="currentColor" />
                  </svg>
                </motion.div>
                <h3 className="text-lg font-semibold text-neutral-900">
                  Uploading your files securely...
                </h3>
              </div>

              <UploadProgress
                files={files}
                progress={uploadProgress}
                currentFileIndex={currentFileIndex}
              />
            </Card>
          </motion.div>
        )}

        {/* Processing State */}
        {state === 'processing' && uploadRunId && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card variant="elevated" padding="lg">
              <ProcessingStatus
                uploadRunId={uploadRunId}
                onComplete={handleProcessingComplete}
                onError={handleProcessingError}
              />
            </Card>
          </motion.div>
        )}

        {/* Complete State */}
        {state === 'complete' && completedStatus && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card variant="elevated" padding="lg">
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto"
                >
                  <CheckCircle className="w-10 h-10 text-success-500" />
                </motion.div>

                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">
                    Analysis complete!
                  </h2>
                  {completedStatus.insights_summary && (
                    <p className="mt-2 text-neutral-600">
                      I've structured{' '}
                      <span className="font-semibold text-neutral-900">
                        {formatNumber(completedStatus.insights_summary.total_encounters || 0)}
                      </span>{' '}
                      encounters across{' '}
                      <span className="font-semibold text-neutral-900">
                        {formatNumber(completedStatus.insights_summary.total_patients || 0)}
                      </span>{' '}
                      unique patients.
                      {completedStatus.insights_summary.date_range && (
                        <span className="block mt-1">
                          Data from {completedStatus.insights_summary.date_range}
                        </span>
                      )}
                    </p>
                  )}
                </div>

                <div className="pt-4">
                  <Button
                    onClick={() => navigate('/insights')}
                    size="lg"
                    icon={<ArrowRight className="w-5 h-5" />}
                    iconPosition="right"
                  >
                    Start asking questions
                  </Button>
                </div>
              </div>
            </Card>

            {/* Suggested Questions */}
            <Card padding="md">
              <h4 className="text-sm font-medium text-neutral-700 mb-3">
                Try asking me:
              </h4>
              <div className="space-y-2">
                {[
                  'What are my top 10 diagnoses by volume?',
                  'Show me readmission rates by condition',
                  'Which patients have the highest costs?',
                ].map((question, index) => (
                  <button
                    key={index}
                    onClick={() => navigate('/insights', { state: { initialQuestion: question } })}
                    className="block w-full text-left px-4 py-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-sm transition-colors"
                  >
                    "{question}"
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Error State */}
        {state === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card variant="elevated" padding="lg">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-error-500" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-neutral-900">
                    Something went wrong
                  </h2>
                  <p className="mt-2 text-neutral-600 max-w-md mx-auto">
                    {error || 'I encountered an issue while processing your data. Please try again.'}
                  </p>
                </div>

                <div className="pt-4 space-x-4">
                  <Button onClick={handleStartOver} variant="secondary">
                    Start over
                  </Button>
                  <Button onClick={handleUpload}>
                    Try again
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Upload;
