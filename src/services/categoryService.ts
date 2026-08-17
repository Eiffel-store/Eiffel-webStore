import { apiClient } from './apiClient';
import { CategoryItem, ApiResponse } from '../types';

export const categoryService = {
  getAll: async (): Promise<CategoryItem[]> => {
    const response = await apiClient.get<ApiResponse<CategoryItem[]>>('/categories');
    return response.data.data;
  },

  create: async (category: Partial<CategoryItem>): Promise<CategoryItem> => {
    const response = await apiClient.post<ApiResponse<CategoryItem>>('/categories', category);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};
