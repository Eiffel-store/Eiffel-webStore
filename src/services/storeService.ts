import { apiClient } from './apiClient';
import { StoreLocation, ApiResponse } from '../types';

export const storeService = {
  getAll: async (): Promise<StoreLocation[]> => {
    const response = await apiClient.get<ApiResponse<StoreLocation[]>>('/stores');
    return response.data.data;
  },

  getById: async (id: string): Promise<StoreLocation> => {
    const response = await apiClient.get<ApiResponse<StoreLocation>>(`/stores/${id}`);
    return response.data.data;
  },

  create: async (storeData: Partial<StoreLocation>): Promise<StoreLocation> => {
    const response = await apiClient.post<ApiResponse<StoreLocation>>('/stores', storeData);
    return response.data.data;
  },

  update: async (id: string, storeData: Partial<StoreLocation>): Promise<StoreLocation> => {
    const response = await apiClient.put<ApiResponse<StoreLocation>>(`/stores/${id}`, storeData);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/stores/${id}`);
  },
};
