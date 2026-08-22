import { apiClient } from './apiClient';
import { Product, ApiResponse } from '../types';

export interface ProductQueryParams {
  category?: string;
  subCategory?: string;
  minPrice?: number;
  maxPrice?: number;
  query?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'asc' | 'desc';
}

export const productService = {
  getAll: async (params?: ProductQueryParams): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products', { params });
    return response.data.data || [];
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(`/products/category/${category}`);
    return response.data.data || [];
  },

  getBestSellers: async (): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products/best-sellers');
    return response.data.data || [];
  },

  getNewArrivals: async (): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products/new-arrivals');
    return response.data.data || [];
  },

  create: async (productData: Partial<Product>): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>('/products', productData);
    return response.data.data;
  },

  update: async (id: string, productData: Partial<Product>): Promise<Product> => {
    const response = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, productData);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  adjustStock: async (id: string, delta: number): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(`/products/${id}/stock`, null, {
      params: { delta }
    });
    return response.data.data;
  },
};
