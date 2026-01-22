import type { AlertCreate, AlertPublic } from '../types';
import api from './api';

export const alertsService = {
  async getAlerts(): Promise<AlertPublic[]> {
    const response = await api.get<AlertPublic[]>('/alerts/');
    return response.data;
  },

  async createAlert(data: AlertCreate): Promise<AlertPublic> {
    const response = await api.post<AlertPublic>('/alerts/', data);
    return response.data;
  },

  async deleteAlert(alertId: string): Promise<void> {
    await api.delete(`/alerts/${alertId}`);
  },
};

export default alertsService;
