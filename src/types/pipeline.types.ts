export type PipelineStep =
  | 'upload'
  | 'validation'
  | 'parsing'
  | 'transformation'
  | 'deduplication'
  | 'enrichment'
  | 'loading'
  | 'indexing'
  | 'complete';

export interface PipelineStepInfo {
  id: PipelineStep;
  label: string;
  description: string;
  estimatedDuration?: number; // in seconds
}

export const PIPELINE_STEPS: PipelineStepInfo[] = [
  {
    id: 'upload',
    label: 'Uploading',
    description: 'Securely transferring your files',
    estimatedDuration: 10,
  },
  {
    id: 'validation',
    label: 'Validating',
    description: 'Checking file format and structure',
    estimatedDuration: 5,
  },
  {
    id: 'parsing',
    label: 'Parsing',
    description: 'Reading and extracting data',
    estimatedDuration: 15,
  },
  {
    id: 'transformation',
    label: 'Transforming',
    description: 'Converting to standard format',
    estimatedDuration: 20,
  },
  {
    id: 'deduplication',
    label: 'Deduplicating',
    description: 'Removing duplicate records',
    estimatedDuration: 10,
  },
  {
    id: 'enrichment',
    label: 'Enriching',
    description: 'Adding derived metrics',
    estimatedDuration: 15,
  },
  {
    id: 'loading',
    label: 'Loading',
    description: 'Storing in secure database',
    estimatedDuration: 20,
  },
  {
    id: 'indexing',
    label: 'Indexing',
    description: 'Optimizing for fast queries',
    estimatedDuration: 10,
  },
  {
    id: 'complete',
    label: 'Complete',
    description: 'Ready for analysis',
    estimatedDuration: 0,
  },
];

export interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'uploading' | 'validating' | 'valid' | 'invalid' | 'error';
  progress: number;
  error?: string;
  validationErrors?: string[];
}

export interface UploadSession {
  id: string;
  files: UploadFile[];
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  startedAt?: string;
  completedAt?: string;
  uploadRunId?: string;
}

export interface DataSummary {
  totalRecords: number;
  totalPatients?: number;
  totalEncounters?: number;
  dateRange?: {
    start: string;
    end: string;
  };
  dataTypes: {
    type: string;
    count: number;
  }[];
  qualityScore?: number;
  issues?: {
    severity: 'info' | 'warning' | 'error';
    message: string;
    count: number;
  }[];
}

export interface SupportedFileType {
  extension: string;
  mimeType: string;
  label: string;
  description: string;
  maxSize: number; // in bytes
}

export const SUPPORTED_FILE_TYPES: SupportedFileType[] = [
  {
    extension: '.csv',
    mimeType: 'text/csv',
    label: 'CSV',
    description: 'Comma-separated values',
    maxSize: 100 * 1024 * 1024, // 100MB
  },
  {
    extension: '.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    label: 'Excel',
    description: 'Microsoft Excel spreadsheet',
    maxSize: 50 * 1024 * 1024, // 50MB
  },
  {
    extension: '.xls',
    mimeType: 'application/vnd.ms-excel',
    label: 'Excel (Legacy)',
    description: 'Microsoft Excel 97-2003',
    maxSize: 50 * 1024 * 1024, // 50MB
  },
  {
    extension: '.json',
    mimeType: 'application/json',
    label: 'JSON',
    description: 'JavaScript Object Notation',
    maxSize: 100 * 1024 * 1024, // 100MB
  },
  {
    extension: '.parquet',
    mimeType: 'application/octet-stream',
    label: 'Parquet',
    description: 'Apache Parquet columnar format',
    maxSize: 500 * 1024 * 1024, // 500MB
  },
];
