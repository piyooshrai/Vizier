import api from './api';

export interface PinnedChart {
  id: string;
  query_text: string;
  sql_query?: string;
  chart_type: string;
  chart_data: Record<string, unknown>[];
  title?: string;
  explanation?: string;
  created_at: string;
  size?: 'small' | 'medium' | 'large';
  position?: number;
}

export interface SaveChartRequest {
  query_text: string;
  sql_query?: string;
  chart_type: string;
  chart_data: Record<string, unknown>[];
  title?: string;
  explanation?: string;
}

// Check if demo mode
const isDemoMode = (): boolean => {
  return localStorage.getItem('is_demo') === 'true';
};

export const chartsService = {
  /**
   * Get all pinned charts for the current user
   */
  async getCharts(): Promise<PinnedChart[]> {
    if (isDemoMode()) {
      // Demo: Load from localStorage
      const saved = localStorage.getItem('pinned_charts');
      return saved ? JSON.parse(saved) : [];
    }

    // Production: Load from backend
    const response = await api.get<PinnedChart[]>('/charts/');
    return response.data;
  },

  /**
   * Save a chart to the dashboard
   */
  async saveChart(chart: SaveChartRequest): Promise<PinnedChart> {
    if (isDemoMode()) {
      // Demo: Save to localStorage
      const saved = JSON.parse(localStorage.getItem('pinned_charts') || '[]');

      const newChart: PinnedChart = {
        id: `chart-${Date.now()}`,
        ...chart,
        created_at: new Date().toISOString(),
        size: 'medium',
      };

      saved.push(newChart);
      localStorage.setItem('pinned_charts', JSON.stringify(saved));

      return newChart;
    }

    // Production: Save to backend
    const response = await api.post<PinnedChart>('/charts/', chart);
    return response.data;
  },

  /**
   * Delete a chart from the dashboard
   */
  async deleteChart(chartId: string): Promise<void> {
    if (isDemoMode()) {
      // Demo: Remove from localStorage
      const saved = JSON.parse(localStorage.getItem('pinned_charts') || '[]');
      const updated = saved.filter((c: PinnedChart) => c.id !== chartId);
      localStorage.setItem('pinned_charts', JSON.stringify(updated));
      return;
    }

    // Production: Delete from backend
    await api.delete(`/charts/${chartId}`);
  },

  /**
   * Check if a chart is already pinned (by query text)
   */
  async isChartPinned(queryText: string): Promise<boolean> {
    const charts = await this.getCharts();
    return charts.some((c) => c.query_text === queryText);
  },

  /**
   * Update chart size
   */
  async updateChartSize(
    chartId: string,
    size: 'small' | 'medium' | 'large',
  ): Promise<void> {
    if (isDemoMode()) {
      const saved = JSON.parse(localStorage.getItem('pinned_charts') || '[]');
      const updated = saved.map((c: PinnedChart) =>
        c.id === chartId ? { ...c, size } : c,
      );
      localStorage.setItem('pinned_charts', JSON.stringify(updated));
      return;
    }

    // Production: Update on backend (would need endpoint)
    // await api.patch(`/charts/${chartId}`, { size });
  },

  /**
   * Get count of pinned charts
   */
  async getChartCount(): Promise<number> {
    const charts = await this.getCharts();
    return charts.length;
  },
};

export default chartsService;
