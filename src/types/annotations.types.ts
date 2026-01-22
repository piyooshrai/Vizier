export type VisibilityScope = 'Public' | 'Private';

export interface NoteCreate {
  note_content: string;
  saved_chart_id: string;
  visibility_scope?: VisibilityScope;
}

export interface NotePublic {
  id: string;
  note_content: string;
  visibility_scope?: VisibilityScope;
  saved_chart_id: string;
  user_id: string;
  author_name: string;
  created_at: string;
}
