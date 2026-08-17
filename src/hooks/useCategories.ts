import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/categoryService';
import { CategoryItem } from '../types';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
    staleTime: 1000 * 60 * 15,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: Partial<CategoryItem>) => categoryService.create(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
