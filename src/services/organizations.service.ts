import type { User } from '../types';
import api from './api';

export interface InvitePublic {
  token: string;
  expires_at: string;
  organization_id: string;
}

export const organizationsService = {
  async listMembers(): Promise<User[]> {
    const response = await api.get<User[]>('/organizations/members');
    return response.data;
  },

  async inviteMember(email: string, role: string): Promise<InvitePublic> {
    const response = await api.post<InvitePublic>('/organizations/invite', {
      email,
      role,
    });
    return response.data;
  },

  async updateMemberRole(userId: string, role: string): Promise<User> {
    const response = await api.patch<User>(`/organizations/members/${userId}`, {
      role,
    });
    return response.data;
  },

  async removeMember(userId: string): Promise<void> {
    await api.delete(`/organizations/members/${userId}`);
  },
};

export default organizationsService;
