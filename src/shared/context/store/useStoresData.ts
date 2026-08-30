import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { StoreLocation } from '@/types';
import { storeService } from '@/services/storeService';
import toast from 'react-hot-toast';

export const useStoresData = (queryClient: QueryClient) => {
  const { data: serverStores = [], isLoading: isStoresLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: () => storeService.getAll().catch(() => []),
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
    retry: 1
  });

  const stores = Array.isArray(serverStores) ? serverStores : [];

  const createStoreMutation = useMutation({
    mutationFn: (s: Partial<StoreLocation>) => storeService.create(s),
    onSuccess: (newStore: StoreLocation) => {
      queryClient.setQueryData<StoreLocation[]>(['stores'], (old: StoreLocation[] | undefined) => [
        newStore,
        ...(old || []).filter((st) => st.id !== newStore.id)
      ]);
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast.success('تمت إضافة الفرع بنجاح');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'فشل إضافة الفرع');
    }
  });

  const updateStoreMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<StoreLocation> }) =>
      storeService.update(id, updates),
    onSuccess: (updatedStore: StoreLocation) => {
      queryClient.setQueryData<StoreLocation[]>(['stores'], (old: StoreLocation[] | undefined) =>
        (old || []).map((st: StoreLocation) => (st.id === updatedStore.id ? updatedStore : st))
      );
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast.success('تم تحديث بيانات الفرع');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'فشل تحديث بيانات الفرع');
    }
  });

  const deleteStoreMutation = useMutation({
    mutationFn: (id: string) => storeService.delete(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['stores'] });
      const prevStores = queryClient.getQueryData<StoreLocation[]>(['stores']);
      if (prevStores) {
        queryClient.setQueryData<StoreLocation[]>(
          ['stores'],
          prevStores.filter((st) => st.id !== id)
        );
      }
      return { prevStores };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast.success('تم حذف الفرع بنجاح');
    },
    onError: (err: any, _id, context) => {
      if (context?.prevStores) {
        queryClient.setQueryData(['stores'], context.prevStores);
      }
      toast.error(err?.message || 'فشل حذف الفرع');
    }
  });

  const addStore = (s: Omit<StoreLocation, 'id'>) => {
    const id = `store-${Date.now()}`;
    const newStore: StoreLocation = { ...s, id };
    createStoreMutation.mutate(newStore);
  };

  const updateStore = (id: string, updates: Partial<StoreLocation>) => {
    updateStoreMutation.mutate({ id, updates });
  };

  const deleteStore = (id: string) => {
    deleteStoreMutation.mutate(id);
  };

  return {
    stores,
    isStoresLoading,
    addStore,
    updateStore,
    deleteStore
  };
};
