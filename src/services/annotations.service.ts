import type { NoteCreate, NotePublic } from '../types';
import api from './api';

export const annotationsService = {
  async getAnnotations(chartId: string): Promise<NotePublic[]> {
    const response = await api.get<NotePublic[]>(
      `/api/v1/annotations/${chartId}`,
    );
    return response.data;
  },

  async createAnnotation(data: NoteCreate): Promise<NotePublic> {
    const response = await api.post<NotePublic>('/api/v1/annotations/', data);
    return response.data;
  },

  async deleteAnnotation(noteId: string): Promise<void> {
    await api.delete(`/api/v1/annotations/${noteId}`);
  },
};

export default annotationsService;
