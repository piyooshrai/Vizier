import api from './api';
import { VannaQuestion, VannaResponse } from '../types';

export const vannaService = {
  ask: async (question: string): Promise<VannaResponse> => {
    const response = await api.post<VannaResponse>('/vanna/ask', { question } as VannaQuestion);
    return response.data;
  },

  // Get suggested questions based on the current data
  getSuggestions: async (): Promise<string[]> => {
    try {
      const response = await api.get<{ suggestions: string[] }>('/vanna/suggestions');
      return response.data.suggestions;
    } catch {
      // Return default suggestions if endpoint not available
      return [
        'What are my top 10 diagnoses by patient volume?',
        'Show me patient demographics breakdown',
        'What is my average length of stay by condition?',
        'Which patients have the highest readmission rates?',
        'Show me encounter trends over the last 12 months',
      ];
    }
  },
};

// Conversation message types for the chat interface
export interface Message {
  id: string;
  type: 'user' | 'vizier';
  content: string;
  timestamp: Date;
  data?: VannaResponse;
  isLoading?: boolean;
  isError?: boolean;
}

// Helper to create a user message
export function createUserMessage(content: string): Message {
  return {
    id: `user-${Date.now()}`,
    type: 'user',
    content,
    timestamp: new Date(),
  };
}

// Helper to create a Vizier message
export function createVizierMessage(
  content: string,
  data?: VannaResponse,
  isLoading = false,
  isError = false
): Message {
  return {
    id: `vizier-${Date.now()}`,
    type: 'vizier',
    content,
    timestamp: new Date(),
    data,
    isLoading,
    isError,
  };
}

export default vannaService;
