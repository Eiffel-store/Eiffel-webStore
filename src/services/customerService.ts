import { apiClient } from './apiClient';
import { User, ApiResponse, PageResponse } from '@/types';

export const customerService = {
  // Get all registered customers from backend MongoDB
  getAllCustomers: async (): Promise<User[]> => {
    try {
      const response = await apiClient.get<ApiResponse<User[] | PageResponse<User>>>('/admin/customers');
      if (response.data && response.data.data) {
        if (Array.isArray(response.data.data)) {
          return response.data.data;
        } else if ((response.data.data as PageResponse<User>).content) {
          return (response.data.data as PageResponse<User>).content;
        }
      }
      return [];
    } catch (err) {
      console.warn('Failed to fetch customers from backend API, using fallback:', err);
      return [];
    }
  },

  // Get paginated customers with search and tier filters
  getPaginatedCustomers: async (params: { page: number; size: number; search?: string; tier?: string }): Promise<PageResponse<User> | null> => {
    try {
      const query = new URLSearchParams();
      query.append('page', String(params.page));
      query.append('size', String(params.size));
      if (params.search) query.append('search', params.search);
      if (params.tier && params.tier !== 'all') query.append('tier', params.tier);

      const response = await apiClient.get<ApiResponse<PageResponse<User>>>(`/admin/customers?${query.toString()}`);
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (err) {
      console.error('Failed to fetch paginated customers:', err);
      return null;
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
