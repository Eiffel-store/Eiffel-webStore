import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { Look } from '@/types';
import { lookService } from '@/services/lookService';
import toast from 'react-hot-toast';

export const useLooksData = (queryClient: QueryClient, isAdminOrStaff: boolean) => {
  // All looks (Admin/Staff only)
  const { data: serverAllLooks = [], isLoading: isAllLooksLoading } = useQuery({
    queryKey: ['looks', 'all'],
    queryFn: () => lookService.getAllLooks().catch(() => []),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    enabled: Boolean(isAdminOrStaff),
    retry: 1
  });

  // Active looks (Storefront)
  const { data: serverActiveLooks = [], isLoading: isActiveLooksLoading } = useQuery({
    queryKey: ['looks', 'active'],
    queryFn: () => lookService.getActiveLooks().catch(() => []),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1
  });

  const isLooksLoading = isActiveLooksLoading || (isAdminOrStaff && isAllLooksLoading);
  const looks = Array.isArray(serverAllLooks) && serverAllLooks.length > 0
    ? serverAllLooks
    : (Array.isArray(serverActiveLooks) ? serverActiveLooks : []);
  const activeLooks = Array.isArray(serverActiveLooks) ? serverActiveLooks : [];

  // Mutations
  const addLookMutation = useMutation({
    mutationFn: (look: Partial<Look>) => lookService.create(look),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['looks'] });
      toast.success('تمت إضافة الإطلالة بنجاح');
    },
  });

  const updateLookMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Look> }) =>
      lookService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['looks'] });
      toast.success('تم تحديث الإطلالة بنجاح');
    },
  });

  const toggleLookStatusMutation = useMutation({
    mutationFn: (id: string) => lookService.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['looks'] });
      toast.success('تم تعديل حالة الإطلالة');
    },
  });

  const reorderLooksMutation = useMutation({
    mutationFn: (ids: string[]) => lookService.reorder(ids),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['looks'] }),
  });

  const deleteLookMutation = useMutation({
    mutationFn: (id: string) => lookService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['looks'] });
      toast.success('تم حذف الإطلالة بنجاح');
    },
  });

  const addLook = async (look: Partial<Look>) => {
    return await addLookMutation.mutateAsync(look);
  };

  const updateLook = async (id: string, updates: Partial<Look>) => {
    return await updateLookMutation.mutateAsync({ id, updates });
  };

  const deleteLook = async (id: string) => {
    await deleteLookMutation.mutateAsync(id);
  };

  const toggleLookStatus = async (id: string) => {
    return await toggleLookStatusMutation.mutateAsync(id);
  };

  const reorderLooks = async (ids: string[]) => {
    await reorderLooksMutation.mutateAsync(ids);
  };

  return {
    looks,
    activeLooks,
    isLooksLoading,
    addLook,
    updateLook,
    deleteLook,
    toggleLookStatus,
    reorderLooks
  };
};
