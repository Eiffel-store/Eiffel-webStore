import { apiClient } from './apiClient';
import { User, ApiResponse } from '@/types';

export const customerService = {
  // Get all registered customers from backend MongoDB
  getAllCustomers: async (): Promise<User[]> => {
    try {
      const response = await apiClient.get<ApiResponse<User[]>>('/admin/customers');
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (err) {
      console.warn('Failed to fetch customers from backend API, using fallback:', err);
      return [];
    }
  },

  // Toggle VIP status on backend
  toggleVip: async (id: string | number, isVip?: boolean): Promise<User | null> => {
    try {
      const url = isVip !== undefined 
        ? `/admin/customers/${id}/vip?isVip=${isVip}`
        : `/admin/customers/${id}/vip`;
      const response = await apiClient.patch<ApiResponse<User>>(url);
      return response.data?.data || null;
    } catch (err) {
      console.error('Failed to toggle customer VIP status:', err);
      return null;
    }
  },

  // Adjust customer points on backend
  adjustPoints: async (id: string | number, points: number): Promise<User | null> => {
    try {
      const response = await apiClient.patch<ApiResponse<User>>(`/admin/customers/${id}/points`, {
        points
      });
      return response.data?.data || null;
    } catch (err) {
      console.error('Failed to adjust customer points on backend:', err);
      return null;
    }
  }
};
