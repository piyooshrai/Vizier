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
          'Content-Type': undefined,
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const total = progressEvent.total || progressEvent.estimated || 100;
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / total,
            );
            onProgress(percentCompleted);
          }
        },
      },
    );

    return response.data;
  },

  // Get pipeline status
  getStatus: async (uploadRunId: string): Promise<PipelineStatus> => {
    const response = await api.get<PipelineStatus>(
      `/pipeline/status/${uploadRunId}`,
    );
    return response.data;
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

          if (
            status.status === 'completed' ||
            status.status === 'complete' ||
            status.status === 'success' ||
            status.status === 'failed' ||
            status.status === 'not_found'
          ) {
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

export default pipelineService;
