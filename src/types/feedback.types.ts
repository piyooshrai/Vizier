export type FeedbackCategory =
  | 'Feature Request'
  | 'Improvement Suggestion'
  | 'Bug Report'
  | 'General Feedback';

export interface FeedbackCreate {
  category: FeedbackCategory;
  suggestion: string;
}

export interface FeedbackPublic extends FeedbackCreate {
  id: string;
  user_id: string;
  created_at: string;
}
