import { apiClient } from './apiClient';
import { ApiResponse, BlacklistEntry } from '../types';

export interface CreateBlacklistRequest {
  phone?: string;
  email?: string;
  ip?: string;
  deviceFingerprint?: string;
  customerName?: string;
  reason?: string;
  orderId?: string;
}

export const blacklistService = {
  getAll: async (): Promise<BlacklistEntry[]> => {
    const response = await apiClient.get<ApiResponse<BlacklistEntry[]>>('/admin/blacklist');
    return response.data.data || [];
  },

  add: async (payload: CreateBlacklistRequest): Promise<BlacklistEntry> => {
    const response = await apiClient.post<ApiResponse<BlacklistEntry>>('/admin/blacklist', payload);
    return response.data.data;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete<ApiResponse<string>>(`/admin/blacklist/${id}`);
    return response.data.success;
  },
};
