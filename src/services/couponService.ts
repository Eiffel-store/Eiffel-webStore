import { apiClient } from './apiClient';
import { Coupon, ApiResponse } from '../types';

export const couponService = {
  validate: async (code: string, orderAmount: number): Promise<Coupon> => {
    const response = await apiClient.post<ApiResponse<Coupon>>('/coupons/validate', { code, orderAmount });
    return response.data.data;
  },

  getAll: async (): Promise<Coupon[]> => {
    const response = await apiClient.get<ApiResponse<Coupon[]>>('/coupons');
    return response.data.data;
  },

  create: async (coupon: Partial<Coupon>): Promise<Coupon> => {
    const response = await apiClient.post<ApiResponse<Coupon>>('/coupons', coupon);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/coupons/${id}`);
  },
};
