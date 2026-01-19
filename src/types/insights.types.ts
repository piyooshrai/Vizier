import type { ChartType } from './api.types';

export interface SavedInsight {
  id: string;
  title: string;
  question: string;
  sql?: string;
  chartType: ChartType;
  chartData: Record<string, unknown>[];
  summary?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tags?: string[];
  isPinned?: boolean;
}

export interface InsightFilter {
  search?: string;
  chartTypes?: ChartType[];
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  isPinned?: boolean;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  chartType?: ChartType;
  chartData?: Record<string, unknown>[];
  chartTitle?: string;
  sql?: string;
  isLoading?: boolean;
  error?: string;
  followUpQuestions?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface DashboardStats {
  totalInsights: number;
  totalConversations: number;
  recentActivity: {
    date: string;
    count: number;
  }[];
  topChartTypes: {
    type: ChartType;
    count: number;
  }[];
}

export interface ExportOptions {
  format: 'pdf' | 'png' | 'csv' | 'json';
  includeChart: boolean;
  includeData: boolean;
  includeSql: boolean;
}
