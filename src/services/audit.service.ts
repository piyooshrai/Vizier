import api from './api';

export interface AuditLog {
  id: string;
  user_id: string | null;
  user_email: string | null;
  action: string;
  endpoint: string;
  status_code: number | null;
  execution_time_ms: number | null;
  user_agent: string | null;
  ip_address: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

export const auditService = {
  async getLogs(limit = 50): Promise<AuditLog[]> {
    const response = await api.get<AuditLog[]>('/audit/logs', {
      params: { limit },
    });
    return response.data;
  },

  async downloadCsv(): Promise<Blob> {
    const response = await api.get('/audit/download', {
      responseType: 'blob',
    });
    return response.data as Blob;
  },
};

export default auditService;
