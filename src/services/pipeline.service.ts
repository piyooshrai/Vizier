import type { PipelineStatus, UploadResponse } from '../types';
import api from './api';

export type UploadProgressCallback = (progress: number) => void;

export const pipelineService = {
  uploadAndTrigger: async (
    files: File[],
    onProgress?: UploadProgressCallback,
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await api.post<UploadResponse>(
      '/pipeline/upload_and_trigger',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            onProgress(percentCompleted);
          }
        },
      },
    );

    return response.data;
  },

  // Get pipeline status - PLACEHOLDER implementation
  // Will be connected to real endpoint when available
  getStatus: async (uploadRunId: string): Promise<PipelineStatus> => {
    try {
      const response = await api.get<PipelineStatus>(
        `/pipeline/status/${uploadRunId}`,
      );
      return response.data;
    } catch {
      // Return mock data for now - will be replaced when endpoint is ready
      console.warn('Pipeline status endpoint not available, using mock data');
      return getMockStatus(uploadRunId);
    }
  },

  // Poll for status updates
  pollStatus: async (
    uploadRunId: string,
    onUpdate: (status: PipelineStatus) => void,
    intervalMs: number = 2000,
    maxAttempts: number = 150, // 5 minutes max
  ): Promise<PipelineStatus> => {
    let attempts = 0;

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const status = await pipelineService.getStatus(uploadRunId);
          onUpdate(status);

          if (status.status === 'completed' || status.status === 'failed') {
            resolve(status);
            return;
          }

          attempts++;
          if (attempts >= maxAttempts) {
            reject(new Error('Pipeline processing timed out'));
            return;
          }

          setTimeout(poll, intervalMs);
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  },
};

// Mock status for development - will be removed when real endpoint is available
const mockSteps = [
  { name: 'discover_files', label: 'Discovering file structure' },
  { name: 'validate_files', label: 'Validating healthcare data formats' },
  { name: 'create_schema', label: 'Identifying data relationships' },
  { name: 'load_staging', label: 'Processing patient records' },
  { name: 'analyze_quality', label: 'Analyzing data quality' },
  { name: 'build_analytics', label: 'Building analytics views' },
  { name: 'generate_insights', label: 'Generating initial insights' },
];

function getMockStatus(uploadRunId: string): PipelineStatus {
  // Simulate progress based on time
  const startTime = parseInt(
    localStorage.getItem(`pipeline_start_${uploadRunId}`) || '0',
    10,
  );
  if (!startTime) {
    localStorage.setItem(
      `pipeline_start_${uploadRunId}`,
      Date.now().toString(),
    );
    return {
      status: 'running',
      upload_run_id: uploadRunId,
      completed_steps: [],
      current_step: mockSteps[0].name,
      progress_percent: 0,
    };
  }

  const elapsed = Date.now() - startTime;
  const stepDuration = 3000; // 3 seconds per step for demo
  const currentStepIndex = Math.min(
    Math.floor(elapsed / stepDuration),
    mockSteps.length - 1,
  );
  const progressInStep = (elapsed % stepDuration) / stepDuration;
  const overallProgress = Math.min(
    ((currentStepIndex + progressInStep) / mockSteps.length) * 100,
    100,
  );

  if (overallProgress >= 100) {
    localStorage.removeItem(`pipeline_start_${uploadRunId}`);
    return {
      status: 'completed',
      upload_run_id: uploadRunId,
      completed_steps: mockSteps.map((s) => s.name),
      current_step: null,
      progress_percent: 100,
      insights_summary: {
        total_patients: 12847,
        total_encounters: 47293,
        date_range: 'Jan 2023 - Dec 2024',
      },
    };
  }

  return {
    status: 'running',
    upload_run_id: uploadRunId,
    completed_steps: mockSteps.slice(0, currentStepIndex).map((s) => s.name),
    current_step: mockSteps[currentStepIndex].name,
    progress_percent: Math.round(overallProgress),
  };
}

export default pipelineService;
