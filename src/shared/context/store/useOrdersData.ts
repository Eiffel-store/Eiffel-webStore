import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { Order } from '@/types';
import { orderService } from '@/services/orderService';
import toast from 'react-hot-toast';

export const useOrdersData = (queryClient: QueryClient, isAdminOrStaff: boolean) => {
  const { data: serverOrders = [], isLoading: isOrdersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getAll().catch(() => []),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 15,
    enabled: Boolean(isAdminOrStaff),
    retry: 1
  });

  const orders = Array.isArray(serverOrders) ? serverOrders : [];

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order['status'] }) =>
      orderService.updateStatus(id, status),
    onSuccess: (updatedOrder: Order) => {
      queryClient.setQueryData<Order[]>(['orders'], (old: Order[] | undefined) =>
        (old || []).map((o: Order) => (o.id === updatedOrder.id ? updatedOrder : o))
      );
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', 'my-orders'] });
      toast.success('تم تحديث حالة الطلب');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'فشل تحديث حالة الطلب');
    }
  });

  const addOrder = (order: Order) => {
    queryClient.setQueryData<Order[]>(['orders'], (old: Order[] | undefined) => [
      order,
      ...(old || []).filter((o: Order) => o.id !== order.id)
    ]);
    queryClient.invalidateQueries({ queryKey: ['orders'] });
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    updateOrderStatusMutation.mutate({ id: orderId, status });
  };

  const deleteOrder = (orderId: string) => {
    updateOrderStatusMutation.mutate({ id: orderId, status: 'Cancelled' });
    queryClient.setQueryData<Order[]>(['orders'], (old: Order[] | undefined) =>
      (old || []).filter((o: Order) => o.id !== orderId)
    );
  };

  return {
    orders,
    isOrdersLoading,
    addOrder,
    updateOrderStatus,
    deleteOrder
  };
};
