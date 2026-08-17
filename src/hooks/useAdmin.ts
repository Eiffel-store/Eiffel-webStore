import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, AdminUserData } from '../services/adminService';

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminService.getDashboardStats(),
    refetchInterval: 1000 * 30, // Poll every 30s
  });
};

export const useAdminUsers = (role?: string) => {
  return useQuery({
    queryKey: ['admin', 'users', role],
    queryFn: () => adminService.getUsers(role),
  });
};

export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: AdminUserData) => adminService.createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: number | string; role: string }) =>
      adminService.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

export const useClearCache = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => adminService.clearCache(),
    onSuccess: () => {
      queryClient.invalidateQueries(); // Invalidate all React Query client caches too
    },
  });
};
