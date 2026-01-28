// src/pages/Upload.tsx
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadGuidanceCard } from '../components/onboarding/UploadGuidanceCard';
import { FileDropZone } from '../components/upload/FileDropZone';
import { FileList } from '../components/upload/FileList';
import { ProcessingAnimation } from '../components/upload/ProcessingAnimation';
import { UploadComplete } from '../components/upload/UploadComplete';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../services/api';
import { pipelineService } from '../services/pipeline.service';

type UploadState =
  | 'initial'
  | 'uploading'
  | 'processing'
  | 'complete'
  | 'error';

interface ProcessingStep {
  name: string;
  completed: boolean;
}

const Upload: React.FC = () => {
  const navigate = useNavigate();
  const { isDemoMode } = useAuth();
  const [uploadState, setUploadState] = useState<UploadState>('initial');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [error, setError] = useState('');

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    setError('');
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    // Demo mode simulation
    if (isDemoMode) {
      await simulateDemoUpload();
      return;
    }

    // Real upload
    try {
      setUploadState('uploading');

      const response = await pipelineService.uploadAndTrigger(
        selectedFiles,
        (progress) => setUploadProgress(progress),
      );

      setUploadState('processing');
      await pollPipelineStatus(response.airflow_run_id);
    } catch (err: unknown) {
      console.error('Upload failed:', err);
      // Log the full response for debugging
      const axiosError = err as {
        response?: { data?: unknown; status?: number };
      };
      if (axiosError.response) {
        console.error('Response status:', axiosError.response.status);
        console.error(
          'Response data:',
          JSON.stringify(axiosError.response.data, null, 2),
        );
      }
      const message = getErrorMessage(err);
      setError(message);
      setUploadState('error');
    }
  };

  const simulateDemoUpload = async () => {
    setUploadState('uploading');

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setUploadProgress(i);
    }

    setUploadState('processing');

    // Processing steps
    const steps = [
      'Patient demographics recognized',
      'Diagnosis codes validated',
      'Encounter patterns identified',
      'Care plans analyzed',
      'Quality measures detected',
    ];

    setProcessingSteps(steps.map((name) => ({ name, completed: false })));

    // Simulate each step
    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setProcessingSteps((prev) =>
        prev.map((step, idx) =>
          idx === i ? { ...step, completed: true } : step,
        ),
      );

      setProcessingProgress(((i + 1) / steps.length) * 100);
    }

    setUploadState('complete');
    localStorage.setItem('demo_data_loaded', 'true');

    // Redirect after 2 seconds
    setTimeout(() => navigate('/insights'), 2000);
  };

  const pollPipelineStatus = async (runId: string) => {
    try {
      const finalStatus = await pipelineService.pollStatus(
        runId,
        (status) => {
          const steps = (status.completed_steps || []).map((name) => ({
            name,
            completed: true,
          }));
          setProcessingSteps(steps);
          setProcessingProgress(status.progress_percent || 0);
        },
        3000,
      );

      if (finalStatus.insights_summary) {
        localStorage.setItem(
          'vizier_insights_summary',
          JSON.stringify(finalStatus.insights_summary),
        );
      }
      localStorage.setItem('vizier_has_data', 'true');
      setUploadState('complete');
      setTimeout(() => navigate('/insights'), 2000);
    } catch (err: unknown) {
      console.error('Status check failed:', err);
      const message = getErrorMessage(err);
      setError(message);
      setUploadState('error');
    }
  };

  // Initial state
  if (uploadState === 'initial') {
    return (
      <div className="h-full overflow-hidden">
        <div className="h-full overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">
                Share your data with me
              </h1>
              <p className="text-xl text-gray-400">
                I can work with CSV exports from Epic, Cerner, Allscripts, or
                most EHR systems
              </p>
            </div>

            {/* Upload Guidance Card */}
            <UploadGuidanceCard />

            {/* File Drop Zone */}
            <FileDropZone
              onFilesSelected={handleFilesSelected}
              selectedFiles={selectedFiles}
              onValidationError={setError}
            />

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="mt-8">
                <FileList files={selectedFiles} onRemove={handleRemoveFile} />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                {error}
              </div>
            )}

            {/* Continue Button */}
            {selectedFiles.length > 0 && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={handleUpload}
                  className="px-8 py-4 bg-white hover:bg-gray-100 text-black font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl text-lg"
                >
                  Continue with {selectedFiles.length} file
                  {selectedFiles.length === 1 ? '' : 's'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Uploading state
  if (uploadState === 'uploading') {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <svg
              className="w-10 h-10 text-black animate-pulse"
              fill="currentColor"
              viewBox="0 0 24 24"
              focusable="false"
            >
              <title>Uploading Progress</title>
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">
            Uploading securely...
          </h2>

          <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
            <div
              className="bg-white h-3 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>

          <p className="text-gray-400">{uploadProgress}% complete</p>
        </div>
      </div>
    );
  }

  // Processing state
  if (uploadState === 'processing') {
    return (
      <ProcessingAnimation
        steps={processingSteps}
        progress={processingProgress}
      />
    );
  }

  // Complete state
  if (uploadState === 'complete') {
    return <UploadComplete />;
  }

  // Error state
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            focusable="false"
          >
            <title>Upload Error</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-400 mb-8">{error}</p>

        <button
          type="button"
          onClick={() => {
            setUploadState('initial');
            setError('');
            setSelectedFiles([]);
          }}
          className="px-6 py-3 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl transition-all"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

export { Upload };
export default Upload;
