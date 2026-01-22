import type { FeedbackCreate, FeedbackPublic } from '../types';
import api from './api';

export const feedbackService = {
  async submitFeedback(data: FeedbackCreate): Promise<FeedbackPublic> {
    const response = await api.post<FeedbackPublic>('/feedback/', data);
    return response.data;
  },
};

export default feedbackService;
