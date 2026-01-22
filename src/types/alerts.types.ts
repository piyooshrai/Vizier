export type AlertMetric =
  | 'Readmission Rate (%)'
  | 'Average Length of Stay (Days)'
  | 'High Risk Patient Rate (%)'
  | 'Care Gap Rate (%)';

export type AlertCondition = 'Greater than' | 'Less than' | 'Equal to';

export interface AlertCreate {
  metric: AlertMetric;
  condition: AlertCondition;
  threshold_value: number;
  email_notification?: boolean;
  sms_notification?: boolean;
}

export interface AlertPublic extends AlertCreate {
  id: string;
  user_id: string;
  is_triggered: boolean;
  created_at: string;
  last_triggered_at: string | null;
}
