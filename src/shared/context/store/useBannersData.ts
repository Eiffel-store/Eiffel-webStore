import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { Banner } from '@/types';
import { bannerService } from '@/services/bannerService';

export const useBannersData = (queryClient: QueryClient, isAdminOrStaff: boolean) => {
  // All banners (Admin/Staff only)
  const { data: serverAllBanners = [], isLoading: isAllBannersLoading } = useQuery({
    queryKey: ['banners', 'all'],
    queryFn: () => bannerService.getAllBanners().catch(() => []),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    enabled: Boolean(isAdminOrStaff),
    retry: 1
  });

  // Active banners (Public storefront)
  const { data: serverActiveBanners = [], isLoading: isActiveBannersLoading } = useQuery({
    queryKey: ['banners', 'active'],
    queryFn: () => bannerService.getActiveBanners().catch(() => []),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1
  });

  const isBannersLoading = isActiveBannersLoading || (isAdminOrStaff && isAllBannersLoading);
  const banners = Array.isArray(serverAllBanners) && serverAllBanners.length > 0
    ? serverAllBanners
    : (Array.isArray(serverActiveBanners) ? serverActiveBanners : []);
  const activeBanners = Array.isArray(serverActiveBanners) ? serverActiveBanners : [];

  // Mutations
  const addBannerMutation = useMutation({
    mutationFn: (banner: Partial<Banner>) => bannerService.create(banner),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }),
  });

  const updateBannerMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Banner> }) =>
      bannerService.update(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }),
  });

  const toggleBannerStatusMutation = useMutation({
    mutationFn: (id: string) => bannerService.toggleStatus(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }),
  });

  const reorderBannersMutation = useMutation({
    mutationFn: (ids: string[]) => bannerService.reorder(ids),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }),
  });

  const deleteBannerMutation = useMutation({
    mutationFn: (id: string) => bannerService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }),
  });

  const addBanner = async (banner: Partial<Banner>) => {
    return await addBannerMutation.mutateAsync(banner);
  };

  const updateBanner = async (id: string, updates: Partial<Banner>) => {
    return await updateBannerMutation.mutateAsync({ id, updates });
  };

  const deleteBanner = async (id: string) => {
    await deleteBannerMutation.mutateAsync(id);
  };

  const toggleBannerStatus = async (id: string) => {
    return await toggleBannerStatusMutation.mutateAsync(id);
  };

  const reorderBanners = async (ids: string[]) => {
    await reorderBannersMutation.mutateAsync(ids);
  };

  const trackBannerImpression = (id: string) => {
    bannerService.trackImpression(id);
  };

  const trackBannerClick = (id: string) => {
    bannerService.trackClick(id);
  };

  return {
    banners,
    activeBanners,
    isBannersLoading,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    reorderBanners,
    trackBannerImpression,
    trackBannerClick
  };
};
