import { apiClient } from './apiClient';
import { Banner, BannerPlacement, ApiResponse } from '../types';

export const bannerService = {
  getActiveBanners: async (placement?: BannerPlacement): Promise<Banner[]> => {
    const params = placement ? { placement } : {};
    const response = await apiClient.get<ApiResponse<Banner[]>>('/banners', { params });
    return response.data.data;
  },

  getAllBanners: async (placement?: BannerPlacement): Promise<Banner[]> => {
    const params = placement ? { placement } : {};
    const response = await apiClient.get<ApiResponse<Banner[]>>('/banners/all', { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<Banner> => {
    const response = await apiClient.get<ApiResponse<Banner>>(`/banners/${id}`);
    return response.data.data;
  },

  create: async (banner: Partial<Banner>): Promise<Banner> => {
    const response = await apiClient.post<ApiResponse<Banner>>('/banners', banner);
    return response.data.data;
  },

  update: async (id: string, banner: Partial<Banner>): Promise<Banner> => {
    const response = await apiClient.put<ApiResponse<Banner>>(`/banners/${id}`, banner);
    return response.data.data;
  },

  toggleStatus: async (id: string): Promise<Banner> => {
    const response = await apiClient.patch<ApiResponse<Banner>>(`/banners/${id}/toggle-status`);
    return response.data.data;
  },

  reorder: async (bannerIds: string[]): Promise<void> => {
    await apiClient.patch<ApiResponse<void>>('/banners/reorder', bannerIds);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/banners/${id}`);
  },

  trackImpression: async (id: string): Promise<void> => {
    try {
      await apiClient.post(`/banners/${id}/track-impression`);
    } catch {
      // ignore tracking error
    }
  },

  trackClick: async (id: string): Promise<void> => {
    try {
      await apiClient.post(`/banners/${id}/track-click`);
    } catch {
      // ignore tracking error
    }
  },
};
