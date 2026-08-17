import { apiClient } from './apiClient';
import { StoreSettings, ApiResponse } from '../types';

export const settingsService = {
  getSettings: async (): Promise<StoreSettings> => {
    const response = await apiClient.get<ApiResponse<StoreSettings>>('/settings');
    return response.data.data;
  },

  updateSettings: async (settings: Partial<StoreSettings>): Promise<StoreSettings> => {
    const response = await apiClient.put<ApiResponse<StoreSettings>>('/settings', settings);
    return response.data.data;
  },
};
