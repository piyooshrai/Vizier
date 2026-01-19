import type { ChartType } from '../types';

export interface SavedInsight {
  id: string;
  question: string;
  answer: string;
  data: Record<string, unknown>[];
  chartType: ChartType;
  chartTitle?: string;
  savedAt: string;
}

const STORAGE_KEY = 'saved_insights';

export const savedInsightsManager = {
  // Get all saved insights
  getAll: (): SavedInsight[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  // Save a new insight
  save: (insight: Omit<SavedInsight, 'id' | 'savedAt'>): SavedInsight => {
    const newInsight: SavedInsight = {
      ...insight,
      id: `insight_${Date.now()}`,
      savedAt: new Date().toISOString(),
    };

    const existing = savedInsightsManager.getAll();
    const updated = [newInsight, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return newInsight;
  },

  // Remove an insight
  remove: (id: string): void => {
    const existing = savedInsightsManager.getAll();
    const filtered = existing.filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  // Check if already saved (by question text)
  isSaved: (question: string): boolean => {
    const existing = savedInsightsManager.getAll();
    return existing.some(
      (i) => i.question.toLowerCase() === question.toLowerCase(),
    );
  },

  // Clear all saved insights
  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },
};

export default savedInsightsManager;
