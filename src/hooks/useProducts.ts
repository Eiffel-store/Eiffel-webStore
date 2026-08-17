import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService, ProductQueryParams } from '../services/productService';
import { Product } from '../types';

export const useProducts = (params?: ProductQueryParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
};

export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: () => productService.getByCategory(category),
    enabled: !!category,
  });
};

export const useBestSellers = () => {
  return useQuery({
    queryKey: ['products', 'bestSellers'],
    queryFn: () => productService.getBestSellers(),
    staleTime: 1000 * 60 * 10,
  });
};

export const useNewArrivals = () => {
  return useQuery({
    queryKey: ['products', 'newArrivals'],
    queryFn: () => productService.getNewArrivals(),
    staleTime: 1000 * 60 * 10,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Product>) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
