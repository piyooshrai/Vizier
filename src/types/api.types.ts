export interface ApiError {
  detail: string;
  status_code?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface UploadResponse {
  upload_run_id: string;
  status: string;
  message: string;
}

export interface PipelineStatus {
  status: 'pending' | 'running' | 'completed' | 'failed';
  upload_run_id: string;
  completed_steps: string[];
  current_step: string | null;
  progress_percent: number;
  error_message?: string;
  insights_summary?: {
    total_patients?: number;
    total_encounters?: number;
    date_range?: string;
  };
}

export interface VannaQuestion {
  question: string;
}

export interface VannaResponse {
  question: string;
  sql: string;
  results: Record<string, unknown>[];
  chart_type: ChartType;
  chart_title?: string;
  summary?: string;
  follow_up_questions?: string[];
}

export type ChartType =
  | 'bar_chart'
  | 'line_chart'
  | 'pie_chart'
  | 'donut_chart'
  | 'gauge_chart'
  | 'big_number'
  | 'table'
  | 'horizontal_bar_chart'
  | 'histogram'
  | 'box_plot';
