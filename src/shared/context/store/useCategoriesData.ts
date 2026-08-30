import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { CategoryItem } from '@/types';
import { categoryService } from '@/services/categoryService';
import toast from 'react-hot-toast';

export const useCategoriesData = (queryClient: QueryClient) => {
  const { data: serverCategories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll().catch(() => []),
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
    retry: 1
  });

  const categories = Array.isArray(serverCategories) ? serverCategories : [];

  const createCategoryMutation = useMutation({
    mutationFn: (cat: Partial<CategoryItem>) => categoryService.create(cat),
    onSuccess: (newCat: CategoryItem) => {
      queryClient.setQueryData<CategoryItem[]>(['categories'], (old: CategoryItem[] | undefined) => [
        newCat,
        ...(old || []).filter((c) => c.id !== newCat.id)
      ]);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('تمت إضافة القسم بنجاح');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'فشل إضافة القسم');
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CategoryItem> }) =>
      categoryService.update(id, updates),
    onSuccess: (updatedCat: CategoryItem) => {
      queryClient.setQueryData<CategoryItem[]>(['categories'], (old: CategoryItem[] | undefined) =>
        (old || []).map((c: CategoryItem) => (c.id === updatedCat.id ? updatedCat : c))
      );
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('تم تحديث القسم بنجاح');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'فشل تحديث القسم');
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] });
      const prevCategories = queryClient.getQueryData<CategoryItem[]>(['categories']);
      if (prevCategories) {
        queryClient.setQueryData<CategoryItem[]>(
          ['categories'],
          prevCategories.filter((c) => c.id !== id)
        );
      }
      return { prevCategories };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('تم حذف القسم بنجاح');
    },
    onError: (err: any, _id, context) => {
      if (context?.prevCategories) {
        queryClient.setQueryData(['categories'], context.prevCategories);
      }
      toast.error(err?.message || 'فشل حذف القسم');
    }
  });

  const addCategory = (catData: Omit<CategoryItem, 'id'>) => {
    const id = catData.nameEn ? catData.nameEn.toLowerCase().replace(/\s+/g, '-') : `cat-${Date.now()}`;
    const newCat: CategoryItem = { ...catData, id };
    createCategoryMutation.mutate(newCat);
  };

  const updateCategory = (id: string, updates: Partial<CategoryItem>) => {
    updateCategoryMutation.mutate({ id, updates });
  };

  const deleteCategory = (id: string) => {
    deleteCategoryMutation.mutate(id);
  };

  return {
    categories,
    isCategoriesLoading,
    addCategory,
    updateCategory,
    deleteCategory
  };
};
