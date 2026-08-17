import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settingsService';
import { StoreSettings } from '../types';

export const useStoreSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.getSettings(),
    staleTime: 1000 * 60 * 30,
  });
};

export const useUpdateStoreSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: Partial<StoreSettings>) => settingsService.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};
