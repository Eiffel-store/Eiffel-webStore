import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { Coupon } from '@/types';
import { couponService } from '@/services/couponService';
import toast from 'react-hot-toast';

export const useCouponsData = (queryClient: QueryClient) => {
  const { data: serverCoupons = [], isLoading: isCouponsLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: () => couponService.getAll().catch(() => []),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    retry: 1
  });

  const coupons = Array.isArray(serverCoupons) ? serverCoupons : [];

  const createCouponMutation = useMutation({
    mutationFn: (coupon: Partial<Coupon>) => couponService.create(coupon),
    onSuccess: (newCoupon: Coupon) => {
      queryClient.setQueryData<Coupon[]>(['coupons'], (old: Coupon[] | undefined) => [
        newCoupon,
        ...(old || []).filter((c) => c.id !== newCoupon.id)
      ]);
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('تم إنشاء كوبون الخصم بنجاح');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'فشل إنشاء الكوبون');
    }
  });

  const updateCouponMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Coupon> }) =>
      couponService.update(id, updates),
    onSuccess: (updatedCoupon: Coupon) => {
      queryClient.setQueryData<Coupon[]>(['coupons'], (old: Coupon[] | undefined) =>
        (old || []).map((c: Coupon) => (c.id === updatedCoupon.id ? updatedCoupon : c))
      );
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('تم تحديث كوبون الخصم');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'فشل تحديث الكوبون');
    }
  });

  const deleteCouponMutation = useMutation({
    mutationFn: (id: string) => couponService.delete(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['coupons'] });
      const prevCoupons = queryClient.getQueryData<Coupon[]>(['coupons']);
      if (prevCoupons) {
        queryClient.setQueryData<Coupon[]>(
          ['coupons'],
          prevCoupons.filter((c) => c.id !== id)
        );
      }
      return { prevCoupons };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('تم حذف الكوبون');
    },
    onError: (err: any, _id, context) => {
      if (context?.prevCoupons) {
        queryClient.setQueryData(['coupons'], context.prevCoupons);
      }
      toast.error(err?.message || 'فشل حذف الكوبون');
    }
  });

  const addCoupon = (c: Omit<Coupon, 'id'>) => {
    createCouponMutation.mutate(c);
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    updateCouponMutation.mutate({ id, updates });
  };

  const deleteCoupon = (id: string) => {
    deleteCouponMutation.mutate(id);
  };

  const validateCoupon = (code: string, subtotal: number): Coupon | null => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);
    if (!found) return null;
    if (found.usageLimit && (found.timesUsed || 0) >= found.usageLimit) return null;
    if (found.minOrderAmount && subtotal < found.minOrderAmount) return null;
    return found;
  };

  return {
    coupons,
    isCouponsLoading,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon
  };
};
