// Application constants

export const APP_NAME = 'Vizier';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'AI-Powered Healthcare Analytics Platform';

// API Configuration
export const API_TIMEOUT = 120000; // 2 minutes
export const MAX_RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 1000; // 1 second

// File Upload
export const MAX_FILE_SIZE = 10000 * 1024 * 1024; // 10GB
export const MAX_FILES_PER_UPLOAD = 100;
export const ACCEPTED_FILE_TYPES = [
  '.csv',
  '.xlsx',
  '.xls',
  '.json',
  '.parquet',
];
export const ACCEPTED_MIME_TYPES = [
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/json',
  'application/octet-stream',
];

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Session & Authentication
export const TOKEN_STORAGE_KEY = 'access_token';
export const USER_STORAGE_KEY = 'user';
export const DEMO_MODE_KEY = 'demo_mode';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// UI Constants
export const SIDEBAR_WIDTH = 256; // pixels
export const TOPBAR_HEIGHT = 64; // pixels
export const MOBILE_BREAKPOINT = 1024; // pixels
export const TOAST_DURATION = 5000; // milliseconds
export const DEBOUNCE_DELAY = 300; // milliseconds

// Chart Colors (from design system)
export const CHART_COLORS = {
  primary: [
    '#2563EB', // primary-600
    '#3B82F6', // primary-500
    '#60A5FA', // primary-400
    '#93C5FD', // primary-300
    '#BFDBFE', // primary-200
  ],
  secondary: [
    '#7C3AED', // secondary-600
    '#8B5CF6', // secondary-500
    '#A78BFA', // secondary-400
    '#C4B5FD', // secondary-300
    '#DDD6FE', // secondary-200
  ],
  success: ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
  warning: ['#D97706', '#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A'],
  error: ['#DC2626', '#EF4444', '#F87171', '#FCA5A5', '#FECACA'],
  categorical: [
    '#2563EB', // blue
    '#7C3AED', // purple
    '#059669', // green
    '#D97706', // amber
    '#DC2626', // red
    '#0891B2', // cyan
    '#DB2777', // pink
    '#4F46E5', // indigo
    '#65A30D', // lime
    '#EA580C', // orange
  ],
};

// Animation Durations
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Date Formats
export const DATE_FORMAT = {
  short: 'MM/DD/YYYY',
  long: 'MMMM D, YYYY',
  withTime: 'MM/DD/YYYY HH:mm',
  iso: 'YYYY-MM-DD',
  time: 'HH:mm',
};

// Healthcare-specific Constants
export const HEALTHCARE_METRICS = {
  readmissionDays: 30,
  lengthOfStayThreshold: 7,
  mortalityRiskLevels: ['Low', 'Medium', 'High', 'Critical'],
};

// Demo Mode Data
export const DEMO_USER = {
  id: 'demo-user-001',
  email: 'demo@vizier.health',
  first_name: 'Demo',
  last_name: 'User',
  role: 'hospital_administrator',
  created_at: '2024-01-01T00:00:00Z',
};

// Error Messages
export const ERROR_MESSAGES = {
  network:
    "I'm having trouble connecting. Please check your internet connection.",
  timeout: 'This request is taking longer than expected. Please try again.',
  unauthorized: 'Your session has expired. Please log in again.',
  forbidden: "You don't have permission to perform this action.",
  notFound: 'The requested resource was not found.',
  serverError: 'Something went wrong on our end. Please try again later.',
  validationError: 'Please check your input and try again.',
  uploadError: 'There was a problem uploading your file. Please try again.',
  processingError:
    'There was a problem processing your data. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  profileUpdated: 'Profile updated successfully!',
  passwordChanged: 'Password changed successfully!',
  dataUploaded: 'Data uploaded successfully!',
  insightSaved: 'Insight saved to dashboard!',
  settingsSaved: 'Settings saved successfully!',
};

// Query Suggestions for Demo Mode
export const DEMO_QUERY_SUGGESTIONS = [
  'What is the average length of stay by department?',
  'Show me readmission rates by diagnosis',
  'What are the top 10 diagnoses by patient count?',
  'How has patient volume changed over time?',
  'What is the distribution of patients by age group?',
  'Show me the mortality rate trends',
  'What are the busiest days of the week?',
  'Compare outcomes across different facilities',
];
