import { apiClient } from './apiClient';
import { ApiResponse, ExchangeRequest } from '@/types';

export const exchangeService = {
  create: async (request: Partial<ExchangeRequest>): Promise<ExchangeRequest> => {
    const response = await apiClient.post<ApiResponse<ExchangeRequest>>('/exchanges', request);
    return response.data.data;
  },

  getMyRequests: async (email?: string): Promise<ExchangeRequest[]> => {
    const response = await apiClient.get<ApiResponse<ExchangeRequest[]>>('/exchanges/my-requests', {
      params: email ? { email } : undefined,
    });
    return response.data.data || [];
  },

  getByOrderId: async (orderId: string): Promise<ExchangeRequest[]> => {
    const response = await apiClient.get<ApiResponse<ExchangeRequest[]>>(`/exchanges/order/${orderId}`);
    return response.data.data || [];
  },

  getAll: async (): Promise<ExchangeRequest[]> => {
    const response = await apiClient.get<ApiResponse<ExchangeRequest[]>>('/exchanges');
    return response.data.data || [];
  },

  getById: async (id: string): Promise<ExchangeRequest> => {
    const response = await apiClient.get<ApiResponse<ExchangeRequest>>(`/exchanges/${id}`);
    return response.data.data;
  },

  updateStatus: async (
    id: string,
    status: string,
    adminNotes?: string
  ): Promise<ExchangeRequest> => {
    const response = await apiClient.patch<ApiResponse<ExchangeRequest>>(`/exchanges/${id}/status`, {
      status,
      adminNotes,
    });
    return response.data.data;
  },
};
