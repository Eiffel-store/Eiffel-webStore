import React from 'react';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { StoreSettings } from '@/types';
import { settingsService } from '@/services/settingsService';
import { DEFAULT_SETTINGS } from './defaults';
import toast from 'react-hot-toast';

export const useSettingsData = (queryClient: QueryClient) => {
  // Single Unified Store & Home Page Settings Query
  const { data: serverSettings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.getSettings().catch(() => DEFAULT_SETTINGS),
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
    retry: 1
  });

  const settings = serverSettings || DEFAULT_SETTINGS;
  const homeSettings = settings;

  // Dynamic Browser Tab Title based on Store Name
  React.useEffect(() => {
    if (settings?.storeName) {
      document.title = `${settings.storeName} | Luxury Menswear`;
    }
  }, [settings?.storeName]);

  // Single Unified Settings Mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: Partial<StoreSettings>) => settingsService.updateSettings(newSettings),
    onSuccess: (data) => {
      queryClient.setQueryData(['settings'], data);
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('تم حفظ الإعدادات بنجاح');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'فشل حفظ الإعدادات');
    }
  });

  const updateSettings = (updates: Partial<StoreSettings>) => {
    const payload = { ...settings, ...updates };
    updateSettingsMutation.mutate(payload);
  };

  const updateHomeSettings = (updates: Partial<StoreSettings>) => {
    updateSettings(updates);
  };

  return {
    settings,
    homeSettings,
    isSettingsLoading,
    isHomeSettingsLoading: isSettingsLoading,
    updateSettings,
    updateHomeSettings
  };
};
