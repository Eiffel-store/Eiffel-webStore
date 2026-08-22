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

export const normalizeProduct = (p: any): Product => {
  if (!p) return p;
  const name =
    p.name ||
    p.nameAr ||
    p.nameEn ||
    (p.id === 'prod-1787247537255' || p.category === 'accessories'
      ? 'ساعة سكمي العسكرية الفاخرة'
      : 'جاكيت إيفل من الصوف والجلد الفاخر');
  const subtitle =
    p.subtitle ||
    p.subtitleAr ||
    p.subtitleEn ||
    p.descriptionAr ||
    p.descriptionEn ||
    p.description ||
    'قطعة أزياء حصرية بإصدار محدود';

  return {
    ...p,
    name,
    nameAr: p.nameAr || name,
    nameEn: p.nameEn || (p.id === 'prod-1787247537255' ? 'SKMEI Luxury Military Watch' : 'EIFFEL Atelier Leather & Wool Jacket'),
    subtitle,
    subtitleAr: p.subtitleAr || subtitle,
    subtitleEn: p.subtitleEn || 'Exclusive limited edition luxury piece'
  };
};

export const productService = {
  getAll: async (params?: ProductQueryParams): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products', { params });
    const list = response.data.data || [];
    return list.map(normalizeProduct);
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return normalizeProduct(response.data.data);
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(`/products/category/${category}`);
    const list = response.data.data || [];
    return list.map(normalizeProduct);
  },

  getBestSellers: async (): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products/best-sellers');
    const list = response.data.data || [];
    return list.map(normalizeProduct);
  },

  getNewArrivals: async (): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products/new-arrivals');
    const list = response.data.data || [];
    return list.map(normalizeProduct);
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
