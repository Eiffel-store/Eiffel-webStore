import { useState } from 'react';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { StoreSettings, HomePageSettings } from '@/types';
import { settingsService } from '@/services/settingsService';
import { homeSettingsService } from '@/services/homeSettingsService';
import { DEFAULT_SETTINGS, DEFAULT_HOME_SETTINGS } from './defaults';
import toast from 'react-hot-toast';

export const useSettingsData = (queryClient: QueryClient) => {
  // Store Settings Query
  const { data: serverSettings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.getSettings().catch(() => DEFAULT_SETTINGS),
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
    retry: 1
  });

  // Home Page Settings Query
  const { data: serverHomeSettings, isLoading: isHomeSettingsLoading } = useQuery({
    queryKey: ['homeSettings'],
    queryFn: () => homeSettingsService.getHomeSettings().catch(() => DEFAULT_HOME_SETTINGS),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 1
  });

  const [localHomeSettings, setLocalHomeSettings] = useState<HomePageSettings>(() => {
    try {
      const saved = localStorage.getItem('eiffel_home_settings');
      return saved ? { ...DEFAULT_HOME_SETTINGS, ...JSON.parse(saved) } : DEFAULT_HOME_SETTINGS;
    } catch {
      return DEFAULT_HOME_SETTINGS;
    }
  });

  const settings = serverSettings || DEFAULT_SETTINGS;
  const homeSettings = serverHomeSettings || localHomeSettings;

  // Mutations
  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: Partial<StoreSettings>) => settingsService.updateSettings(newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('تم حفظ الإعدادات بنجاح');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'فشل حفظ الإعدادات');
    }
  });

  const updateHomeSettingsMutation = useMutation({
    mutationFn: (newHomeSettings: HomePageSettings) => homeSettingsService.updateHomeSettings(newHomeSettings),
    onSuccess: (data) => {
      setLocalHomeSettings(data);
      queryClient.setQueryData(['homeSettings'], data);
      queryClient.invalidateQueries({ queryKey: ['homeSettings'] });
    },
    onError: (err) => {
      console.warn('Backend update failed:', err);
    }
  });

  const updateSettings = (updates: Partial<StoreSettings>) => {
    updateSettingsMutation.mutate(updates);
  };

  const updateHomeSettings = (updates: Partial<HomePageSettings>) => {
    const current = serverHomeSettings || localHomeSettings || DEFAULT_HOME_SETTINGS;
    const updated: HomePageSettings = {
      ...current,
      ...updates,
      hero: updates.hero ? { ...current.hero, ...updates.hero } : current.hero,
      promoEditorial: updates.promoEditorial
        ? { ...current.promoEditorial, ...updates.promoEditorial }
        : current.promoEditorial,
      shopTheLook: updates.shopTheLook
        ? { ...current.shopTheLook, ...updates.shopTheLook }
        : current.shopTheLook
    };
    setLocalHomeSettings(updated);
    try {
      localStorage.setItem('eiffel_home_settings', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save home settings', err);
    }
    updateHomeSettingsMutation.mutate(updated);
  };

  return {
    settings,
    homeSettings,
    isSettingsLoading,
    isHomeSettingsLoading,
    updateSettings,
    updateHomeSettings
  };
};
