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
  airflow_run_id: string;
  status: string;
  message: string;
  target_schema?: string;
  uploaded_files?: string[];
}

export interface PipelineStatus {
  status:
    | 'pending'
    | 'running'
    | 'completed'
    | 'complete'
    | 'failed'
    | 'not_found'
    | 'success';
  airflow_run_id: string;
  started_at?: string;
  completed_steps?: string[];
  current_step?: string | null;
  progress_percent: number;
  error_message?: string | null;
  insights_summary?: {
    total_patients?: number;
    total_encounters?: number;
    date_range?: string;
  };
}

export interface VannaQuestion {
  question: string;
}

export interface VannaCharts {
  primary_chart: ChartType;
  alternative_charts?: string[];
  reasoning?: string;
}

export interface VannaResponse {
  status?: string;
  question: string;
  generated_title?: string;
  sql: string;
  // API returns 'result' but we also support 'results' for backwards compatibility
  result?: Record<string, unknown>[];
  results?: Record<string, unknown>[];
  // API returns 'charts' object, but we also support flat 'chart_type' for backwards compatibility
  charts?: VannaCharts;
  chart_type?: ChartType;
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
