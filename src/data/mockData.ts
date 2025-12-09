import { VannaResponse, ChartType } from '../types';
import { SavedInsight } from '../utils/savedInsights';

interface MockQAResponse {
  question: string;
  answer: string;
  data: Record<string, unknown>[];
  chart: ChartType;
  chartTitle?: string;
  followUpQuestions?: string[];
}

interface MockHealthcareData {
  summary: {
    totalPatients: number;
    totalEncounters: number;
    dateRange: {
      start: string;
      end: string;
    };
    topConditions: Array<{ name: string; count: number; percentage: number }>;
    ageDistribution: Array<{ range: string; count: number; percentage: number }>;
    readmissionRate: number;
    averageEncounterCost: number;
  };
  qaResponses: Record<string, MockQAResponse>;
  defaultResponse: {
    answer: string;
    data: null;
    chart: null;
  };
}

export const mockHealthcareData: MockHealthcareData = {
  summary: {
    totalPatients: 12847,
    totalEncounters: 47293,
    dateRange: {
      start: '2023-01-01',
      end: '2024-12-31',
    },
    topConditions: [
      { name: 'Essential Hypertension', count: 2847, percentage: 22.1 },
      { name: 'Type 2 Diabetes', count: 1923, percentage: 15.0 },
      { name: 'Hyperlipidemia', count: 1456, percentage: 11.3 },
      { name: 'Chronic Obstructive Pulmonary Disease', count: 892, percentage: 6.9 },
      { name: 'Coronary Artery Disease', count: 734, percentage: 5.7 },
    ],
    ageDistribution: [
      { range: '0-18', count: 1823, percentage: 14.2 },
      { range: '19-35', count: 2156, percentage: 16.8 },
      { range: '36-50', count: 3421, percentage: 26.6 },
      { range: '51-65', count: 3289, percentage: 25.6 },
      { range: '65+', count: 2158, percentage: 16.8 },
    ],
    readmissionRate: 12.3,
    averageEncounterCost: 4567,
  },

  qaResponses: {
    'top diagnoses': {
      question: 'What are my top diagnoses?',
      answer: "I found your most common diagnoses. Here's what I see:",
      data: [
        { diagnosis: 'Essential Hypertension', patients: 2847, icd10: 'I10' },
        { diagnosis: 'Type 2 Diabetes Mellitus', patients: 1923, icd10: 'E11.9' },
        { diagnosis: 'Hyperlipidemia', patients: 1456, icd10: 'E78.5' },
        { diagnosis: 'COPD', patients: 892, icd10: 'J44.9' },
        { diagnosis: 'Coronary Artery Disease', patients: 734, icd10: 'I25.10' },
        { diagnosis: 'Atrial Fibrillation', patients: 623, icd10: 'I48.91' },
        { diagnosis: 'Heart Failure', patients: 567, icd10: 'I50.9' },
        { diagnosis: 'Chronic Kidney Disease', patients: 489, icd10: 'N18.9' },
        { diagnosis: 'Obesity', patients: 445, icd10: 'E66.9' },
        { diagnosis: 'Anxiety Disorder', patients: 398, icd10: 'F41.9' },
      ],
      chart: 'bar_chart',
      chartTitle: 'Top 10 Diagnoses by Patient Volume',
      followUpQuestions: [
        'Show me trends for hypertension over time',
        'What is the average age of diabetic patients?',
        'Which providers treat the most COPD patients?',
      ],
    },
    'patient demographics': {
      question: 'Show me patient demographics',
      answer: "Here's the breakdown of your patient population by age group:",
      data: [
        { age_group: '0-18', count: 1823, percentage: 14.2 },
        { age_group: '19-35', count: 2156, percentage: 16.8 },
        { age_group: '36-50', count: 3421, percentage: 26.6 },
        { age_group: '51-65', count: 3289, percentage: 25.6 },
        { age_group: '65+', count: 2158, percentage: 16.8 },
      ],
      chart: 'pie_chart',
      chartTitle: 'Patient Age Distribution',
      followUpQuestions: [
        'Show me gender breakdown',
        'What are the top diagnoses for patients over 65?',
        'How does insurance type vary by age group?',
      ],
    },
    'readmission': {
      question: 'What is my readmission rate?',
      answer:
        "Your 30-day readmission rate is 12.3%, which is below the national average of 14.5%. Here's the trend over the past 12 months:",
      data: [
        { month: 'Jan 2024', rate: 13.2 },
        { month: 'Feb 2024', rate: 12.8 },
        { month: 'Mar 2024', rate: 13.5 },
        { month: 'Apr 2024', rate: 12.9 },
        { month: 'May 2024', rate: 12.4 },
        { month: 'Jun 2024', rate: 12.1 },
        { month: 'Jul 2024', rate: 11.8 },
        { month: 'Aug 2024', rate: 12.3 },
        { month: 'Sep 2024', rate: 12.6 },
        { month: 'Oct 2024', rate: 12.2 },
        { month: 'Nov 2024', rate: 11.9 },
        { month: 'Dec 2024', rate: 12.3 },
      ],
      chart: 'line_chart',
      chartTitle: '30-Day Readmission Rate Trend',
      followUpQuestions: [
        'Which conditions have the highest readmission rates?',
        'Compare readmission rates by provider',
        'What are common causes of readmission?',
      ],
    },
    'high cost': {
      question: 'Which patients have the highest costs?',
      answer:
        "Here are your top 10 highest-cost patients. These patients may benefit from care coordination programs:",
      data: [
        { patient_id: 'P-8472', total_cost: 124567, encounters: 23, primary_diagnosis: 'CHF' },
        { patient_id: 'P-2341', total_cost: 98234, encounters: 18, primary_diagnosis: 'COPD' },
        { patient_id: 'P-9876', total_cost: 87456, encounters: 15, primary_diagnosis: 'CAD' },
        { patient_id: 'P-4521', total_cost: 76234, encounters: 21, primary_diagnosis: 'Diabetes' },
        { patient_id: 'P-7632', total_cost: 68923, encounters: 14, primary_diagnosis: 'CKD' },
        { patient_id: 'P-1298', total_cost: 62145, encounters: 12, primary_diagnosis: 'Stroke' },
        { patient_id: 'P-5567', total_cost: 58934, encounters: 19, primary_diagnosis: 'ESRD' },
        { patient_id: 'P-3345', total_cost: 54321, encounters: 11, primary_diagnosis: 'Cancer' },
        { patient_id: 'P-8891', total_cost: 51234, encounters: 16, primary_diagnosis: 'Sepsis' },
        { patient_id: 'P-6623', total_cost: 48765, encounters: 13, primary_diagnosis: 'AMI' },
      ],
      chart: 'table',
      chartTitle: 'Top 10 Highest Cost Patients',
      followUpQuestions: [
        'What conditions drive the highest costs?',
        'Show me cost trends over time',
        'Compare costs by insurance type',
      ],
    },
    'encounters': {
      question: 'Show me encounters by month',
      answer: "Here's your encounter volume over the past year:",
      data: [
        { month: 'Jan 2024', encounters: 3847 },
        { month: 'Feb 2024', encounters: 3623 },
        { month: 'Mar 2024', encounters: 4156 },
        { month: 'Apr 2024', encounters: 3892 },
        { month: 'May 2024', encounters: 4023 },
        { month: 'Jun 2024', encounters: 3945 },
        { month: 'Jul 2024', encounters: 4234 },
        { month: 'Aug 2024', encounters: 4089 },
        { month: 'Sep 2024', encounters: 3967 },
        { month: 'Oct 2024', encounters: 4178 },
        { month: 'Nov 2024', encounters: 3856 },
        { month: 'Dec 2024', encounters: 4483 },
      ],
      chart: 'line_chart',
      chartTitle: 'Monthly Encounter Volume',
      followUpQuestions: [
        'Break down encounters by type',
        'Which days have the highest volume?',
        'Show me no-show rates by month',
      ],
    },
    'provider': {
      question: 'Which providers see the most patients?',
      answer: "Here's a breakdown of patient volume by provider:",
      data: [
        { provider: 'Dr. Sarah Johnson', patients: 1245, specialty: 'Internal Medicine' },
        { provider: 'Dr. Michael Chen', patients: 1123, specialty: 'Family Medicine' },
        { provider: 'Dr. Emily Rodriguez', patients: 987, specialty: 'Cardiology' },
        { provider: 'Dr. James Williams', patients: 876, specialty: 'Pulmonology' },
        { provider: 'Dr. Lisa Thompson', patients: 845, specialty: 'Endocrinology' },
        { provider: 'Dr. Robert Davis', patients: 789, specialty: 'Nephrology' },
        { provider: 'Dr. Amanda Wilson', patients: 734, specialty: 'Internal Medicine' },
        { provider: 'Dr. David Brown', patients: 698, specialty: 'Geriatrics' },
      ],
      chart: 'horizontal_bar_chart',
      chartTitle: 'Patient Volume by Provider',
      followUpQuestions: [
        'What is the average wait time by provider?',
        'Compare patient satisfaction by provider',
        'Show me referral patterns between providers',
      ],
    },
    'length of stay': {
      question: 'What is my average length of stay?',
      answer:
        "Your average length of stay is 4.2 days, which is slightly below the benchmark of 4.5 days. Here's how it varies by condition:",
      data: [
        { condition: 'Pneumonia', avg_los: 5.8, benchmark: 5.5 },
        { condition: 'Heart Failure', avg_los: 6.2, benchmark: 6.0 },
        { condition: 'COPD Exacerbation', avg_los: 4.9, benchmark: 5.2 },
        { condition: 'Hip Replacement', avg_los: 2.8, benchmark: 3.0 },
        { condition: 'Knee Replacement', avg_los: 2.5, benchmark: 2.8 },
        { condition: 'AMI', avg_los: 4.1, benchmark: 4.5 },
        { condition: 'Stroke', avg_los: 5.5, benchmark: 5.8 },
      ],
      chart: 'bar_chart',
      chartTitle: 'Average Length of Stay by Condition',
      followUpQuestions: [
        'What factors correlate with longer stays?',
        'Show me LOS trends over time',
        'Compare LOS by insurance type',
      ],
    },
    'gender': {
      question: 'Show me gender breakdown',
      answer: "Here's the gender distribution of your patient population:",
      data: [
        { gender: 'Female', count: 6938, percentage: 54.0 },
        { gender: 'Male', count: 5782, percentage: 45.0 },
        { gender: 'Other/Unknown', count: 127, percentage: 1.0 },
      ],
      chart: 'pie_chart',
      chartTitle: 'Patient Gender Distribution',
      followUpQuestions: [
        'How do diagnoses differ by gender?',
        'Compare utilization patterns by gender',
        'Show me preventive care rates by gender',
      ],
    },
    'insurance': {
      question: 'Show me patients by insurance type',
      answer: "Here's how your patients are distributed across insurance types:",
      data: [
        { insurance: 'Medicare', count: 4523, percentage: 35.2 },
        { insurance: 'Commercial', count: 3987, percentage: 31.0 },
        { insurance: 'Medicaid', count: 2341, percentage: 18.2 },
        { insurance: 'Self-Pay', count: 1234, percentage: 9.6 },
        { insurance: 'Other', count: 762, percentage: 5.9 },
      ],
      chart: 'donut_chart',
      chartTitle: 'Patient Insurance Distribution',
      followUpQuestions: [
        'Compare outcomes by insurance type',
        'What is the payer mix trend over time?',
        'Show me denial rates by payer',
      ],
    },
  },

  defaultResponse: {
    answer:
      "That's a great question! In the demo, I can show you insights about:\n\n- Top diagnoses by volume\n- Patient demographics\n- Readmission rates\n- High-cost patients\n- Encounter trends\n- Provider performance\n- Length of stay metrics\n\nTry asking one of these to see sample healthcare analytics!",
    data: null,
    chart: null,
  },
};

// Helper function to find the best matching response
export function findMockResponse(question: string): VannaResponse {
  const questionLower = question.toLowerCase();

  // Keywords to match against responses
  const keywordMap: Record<string, string[]> = {
    'top diagnoses': ['diagnos', 'top', 'condition', 'icd', 'disease'],
    'patient demographics': ['demographic', 'age', 'population', 'breakdown'],
    readmission: ['readmission', 'readmit', '30-day', 'return'],
    'high cost': ['cost', 'expensive', 'high cost', 'highest cost', 'spending'],
    encounters: ['encounter', 'visit', 'volume', 'trend', 'monthly'],
    provider: ['provider', 'doctor', 'physician', 'who sees'],
    'length of stay': ['length of stay', 'los', 'stay', 'days'],
    gender: ['gender', 'male', 'female', 'sex'],
    insurance: ['insurance', 'payer', 'medicare', 'medicaid', 'commercial'],
  };

  // Find the best matching response
  for (const [responseKey, keywords] of Object.entries(keywordMap)) {
    for (const keyword of keywords) {
      if (questionLower.includes(keyword)) {
        const response = mockHealthcareData.qaResponses[responseKey];
        if (response) {
          return {
            question: question,
            sql: '-- Demo mode: no SQL generated',
            results: response.data,
            chart_type: response.chart,
            chart_title: response.chartTitle,
            summary: response.answer,
            follow_up_questions: response.followUpQuestions,
          };
        }
      }
    }
  }

  // Return default response if no match
  return {
    question: question,
    sql: '-- Demo mode: no SQL generated',
    results: [],
    chart_type: 'table',
    summary: mockHealthcareData.defaultResponse.answer,
    follow_up_questions: [
      'What are my top diagnoses?',
      'Show me patient demographics',
      'What is my readmission rate?',
      'Which patients have the highest costs?',
      'Show me encounters by month',
    ],
  };
}

// Demo suggestions for the insights page
export const demoSuggestions = [
  'What are my top 10 diagnoses?',
  'Show me patient demographics',
  'What is my readmission rate?',
  'Which patients have the highest costs?',
  'Show me encounters by month',
  'Which providers see the most patients?',
];

// Demo saved insights for the dashboard
export const demoSavedInsights: SavedInsight[] = [
  {
    id: 'demo_1',
    question: 'What are my top 5 diagnoses?',
    answer: "I found your most common diagnoses. Here's what I see:",
    data: mockHealthcareData.qaResponses['top diagnoses'].data.slice(0, 5),
    chartType: 'bar_chart',
    chartTitle: 'Top 5 Diagnoses by Patient Volume',
    savedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: 'demo_2',
    question: 'Show me patient demographics',
    answer: "Here's the breakdown of your patient population by age group:",
    data: mockHealthcareData.qaResponses['patient demographics'].data,
    chartType: 'pie_chart',
    chartTitle: 'Patient Age Distribution',
    savedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
  {
    id: 'demo_3',
    question: 'What is my readmission rate?',
    answer:
      "Your 30-day readmission rate is 12.3%, which is below the national average of 14.5%.",
    data: mockHealthcareData.qaResponses['readmission'].data,
    chartType: 'line_chart',
    chartTitle: '30-Day Readmission Rate Trend',
    savedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
  },
];

export default mockHealthcareData;
