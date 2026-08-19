import { apiClient } from './apiClient';
import { HomePageSettings, ApiResponse } from '../types';

export const homeSettingsService = {
  getHomeSettings: async (): Promise<HomePageSettings> => {
    const response = await apiClient.get<ApiResponse<HomePageSettings>>('/home-settings');
    return response.data.data;
  },

  updateHomeSettings: async (settings: HomePageSettings): Promise<HomePageSettings> => {
    const response = await apiClient.put<ApiResponse<HomePageSettings>>('/home-settings', settings);
    return response.data.data;
  },
};
