import { apiClient } from './apiClient';
import { Order, ApiResponse } from '../types';

export const orderService = {
  create: async (orderData: Partial<Order>): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>('/orders', orderData);
    return response.data.data;
  },

  getAll: async (): Promise<Order[]> => {
    const response = await apiClient.get<ApiResponse<Order[]>>('/orders');
    return response.data.data;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<ApiResponse<Order[]>>('/orders/my-orders');
    return response.data.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data;
  },

  updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, null, {
      params: { status }
    });
    return response.data.data;
  },
};
