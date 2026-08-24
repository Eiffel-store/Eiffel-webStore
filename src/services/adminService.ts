import { apiClient } from './apiClient';
import { ApiResponse } from '../types';

export interface DashboardStats {
  totalRevenue: number;
  currency: string;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalCustomers: number;
  averageOrderValue: number;
}

export interface AdminUserData {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: 'ROLE_ADMIN' | 'ROLE_STAFF' | 'ROLE_CUSTOMER';
  tier?: string;
}

export const adminService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/admin/dashboard');
    return response.data.data;
  },

  getUsers: async (role?: string): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/admin/users', {
      params: role ? { role } : undefined,
    });
    return response.data.data;
  },

  createUser: async (user: AdminUserData): Promise<any> => {
    const response = await apiClient.post<ApiResponse<any>>('/admin/users', user);
    return response.data.data;
  },

  updateUserRole: async (id: number | string, role: string): Promise<any> => {
    const response = await apiClient.patch<ApiResponse<any>>(`/admin/users/${id}/role`, { role });
    return response.data.data;
  },

  deleteUser: async (id: number | string): Promise<void> => {
    await apiClient.delete(`/admin/users/${id}`);
  },

  clearCache: async (): Promise<string> => {
    const response = await apiClient.post<ApiResponse<void>>('/admin/cache/clear');
    return response.data.message || 'تم مسح الكاش بنجاح';
  },
};
