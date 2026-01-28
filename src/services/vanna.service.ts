import { demoSuggestions, findMockResponse } from '../data/mockData';
import type { VannaResponse } from '../types';
import api from './api';
import { chartsService } from './charts.service';

// Check if user is in demo mode
const isDemoMode = (): boolean => {
  return localStorage.getItem('is_demo') === 'true';
};

export const vannaService = {
  ask: async (question: string): Promise<VannaResponse> => {
    // Check if in demo mode - return mock data
    if (isDemoMode()) {
      // Simulate API delay for realistic UX
      await new Promise((resolve) =>
        setTimeout(resolve, 1200 + Math.random() * 800),
      );

      // Return mock response
      return findMockResponse(question);
    }

    // Real API call for non-demo users
    const response = await api.post<VannaResponse>('/vanna/ask', { question });
    const data = response.data;

    // Normalize the response to handle both old and new API formats
    const normalizedData: VannaResponse = {
      ...data,
      // Use 'result' if 'results' is not present
      results: data.results || data.result || [],
      // Use charts.primary_chart if chart_type is not present
      chart_type: data.chart_type || data.charts?.primary_chart || 'table',
      // Use generated_title as chart_title if not present
      chart_title: data.chart_title || data.generated_title,
      // Ensure sql always exists for downstream usage
      sql: data.sql || '',
    };

    if (normalizedData.status === 'existing_chart' && normalizedData.chart_id) {
      try {
        const existingChart = await chartsService.getChartById(
          normalizedData.chart_id,
        );
        if (existingChart) {
          return {
            ...normalizedData,
            message:
              normalizedData.message ||
              'You have already saved a chart for this question.',
            summary:
              normalizedData.summary ||
              normalizedData.message ||
              'You have already saved a chart for this question.',
            question: existingChart.query_text || normalizedData.question,
            chart_title: existingChart.title || normalizedData.chart_title,
            chart_type: existingChart.chart_type,
            results: existingChart.chart_data ?? [],
            sql: existingChart.sql_query || normalizedData.sql,
          };
        }
      } catch {
        // Fall through to normalized response if lookup fails
      }
    }

    return normalizedData;
  },

  // Get suggested questions based on the current data
  getSuggestions: async (): Promise<string[]> => {
    // Return demo suggestions in demo mode
    if (isDemoMode()) {
      return demoSuggestions;
    }

    try {
      const response = await api.get<{ suggestions: string[] }>(
        '/vanna/suggestions',
      );
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
  isError = false,
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
