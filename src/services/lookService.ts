import { apiClient } from './apiClient';
import { Look, ApiResponse } from '../types';

export const lookService = {
  getActiveLooks: async (): Promise<Look[]> => {
    const response = await apiClient.get<ApiResponse<Look[]>>('/looks');
    return response.data.data || [];
  },

  getAllLooks: async (): Promise<Look[]> => {
    const response = await apiClient.get<ApiResponse<Look[]>>('/looks/all');
    return response.data.data || [];
  },

  getById: async (id: string): Promise<Look> => {
    const response = await apiClient.get<ApiResponse<Look>>(`/looks/${id}`);
    return response.data.data;
  },

  create: async (look: Partial<Look>): Promise<Look> => {
    const response = await apiClient.post<ApiResponse<Look>>('/looks', look);
    return response.data.data;
  },

  update: async (id: string, look: Partial<Look>): Promise<Look> => {
    const response = await apiClient.put<ApiResponse<Look>>(`/looks/${id}`, look);
    return response.data.data;
  },

  toggleStatus: async (id: string): Promise<Look> => {
    const response = await apiClient.patch<ApiResponse<Look>>(`/looks/${id}/toggle-active`);
    return response.data.data;
  },

  reorder: async (orderedIds: string[]): Promise<void> => {
    await apiClient.put<ApiResponse<void>>('/looks/reorder', orderedIds);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/looks/${id}`);
  },
};
