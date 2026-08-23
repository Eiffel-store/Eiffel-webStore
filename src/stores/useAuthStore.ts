import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, LoginCredentials, RegisterData, AuthResult } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  role: 'ROLE_ADMIN' | 'ROLE_STAFF' | 'ROLE_CUSTOMER' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isProfileLoading: boolean;
  error: string | null;

  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>;
  logout: () => void;
  setUser: (user: User, token: string, refreshToken?: string) => void;
  setTokens: (token: string, refreshToken?: string) => void;
  fetchProfile: () => Promise<void>;
  updateUserPoints: (delta: number) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
      isProfileLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.login(credentials);
          const rawUser = (data as any).user || (data as any);
          const rawPoints = rawUser.points ?? rawUser.tierPoints ?? data.tierPoints ?? 50;
          const isVip = Boolean(rawUser.isVip ?? (data as any).isVip ?? (rawUser.tier === 'VIP' || rawUser.tier === 'VIP_PLATINUM'));
          const accessToken = data.accessToken || data.token;
          const refreshToken = data.refreshToken || null;

          const user: User = {
            id: String(rawUser.id || data.id || Date.now()),
            name: rawUser.name || data.name || credentials.email.split('@')[0],
            email: rawUser.email || data.email || credentials.email,
            role: rawUser.role || data.role || 'ROLE_CUSTOMER',
            tier: isVip ? 'VIP' : ((data.tier as any) || rawUser.tier || 'MEMBER'),
            isVip: isVip,
            points: rawPoints,
            tierPoints: rawPoints,
            phone: rawUser.phone || data.phone || '',
            memberSince: '2026',
            addresses: rawUser.addresses || [],
            paymentMethods: [],
            orders: [],
          };

          if (accessToken) localStorage.setItem('token', accessToken);
          if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

          set({
            user,
            token: accessToken,
            refreshToken,
            role: (rawUser.role || data.role) as any,
            isAuthenticated: true,
            isLoading: false,
          });

          return data;
        } catch (err: any) {
          const message = err.message || 'فشل تسجيل الدخول';
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      register: async (registerData) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.register(registerData);
          const rawUser = (data as any).user || (data as any);
          const rawPoints = rawUser.points ?? rawUser.tierPoints ?? data.tierPoints ?? 50;
          const isVip = Boolean(rawUser.isVip ?? (data as any).isVip ?? (rawUser.tier === 'VIP' || rawUser.tier === 'VIP_PLATINUM'));
          const accessToken = data.accessToken || data.token;
          const refreshToken = data.refreshToken || null;

          const user: User = {
            id: String(rawUser.id || data.id || Date.now()),
            name: rawUser.name || data.name || registerData.name,
            email: rawUser.email || data.email || registerData.email,
            role: rawUser.role || data.role || 'ROLE_CUSTOMER',
            tier: isVip ? 'VIP' : ((data.tier as any) || rawUser.tier || 'MEMBER'),
            isVip: isVip,
            points: rawPoints,
            tierPoints: rawPoints,
            phone: rawUser.phone || data.phone || registerData.phone || '',
            memberSince: '2026',
            addresses: [],
            paymentMethods: [],
            orders: [],
          };

          if (accessToken) localStorage.setItem('token', accessToken);
          if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

          set({
            user,
            token: accessToken,
            refreshToken,
            role: (rawUser.role || data.role) as any,
            isAuthenticated: true,
            isLoading: false,
          });

          return data;
        } catch (err: any) {
          const message = err.message || 'فشل إنشاء الحساب';
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('eiffel_auth_token');
        sessionStorage.removeItem('token');
        set({
          user: null,
          token: null,
          refreshToken: null,
          role: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setUser: (user, token, refreshToken) => {
        if (token) localStorage.setItem('token', token);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        set((state) => ({
          user,
          token,
          refreshToken: refreshToken || state.refreshToken,
          role: user.role as any,
          isAuthenticated: true,
        }));
      },

      setTokens: (token, refreshToken) => {
        if (token) localStorage.setItem('token', token);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        set((state) => ({
          token,
          refreshToken: refreshToken || state.refreshToken,
          isAuthenticated: true,
        }));
      },

      fetchProfile: async () => {
        set({ isProfileLoading: true });
        try {
          const data = await authService.getProfile();
          if (data) {
            const rawUser = (data as any).user || (data as any);
            const rawPoints = rawUser.points ?? rawUser.tierPoints ?? (data as any).tierPoints ?? 0;
            const isVip = Boolean(rawUser.isVip ?? (data as any).isVip ?? (rawUser.tier === 'VIP' || rawUser.tier === 'VIP_PLATINUM'));
            set((state) => ({
              user: state.user ? {
                ...state.user,
                name: rawUser.name || data.name || state.user.name,
                tier: isVip ? 'VIP' : ((data.tier as any) || rawUser.tier || 'MEMBER'),
                isVip: isVip,
                points: rawPoints,
                tierPoints: rawPoints,
                phone: rawUser.phone || data.phone || state.user.phone,
                addresses: rawUser.addresses || state.user.addresses || [],
              } : null
            }));
          }
        } catch {
          // ignore if unauthenticated or offline
        } finally {
          set({ isProfileLoading: false });
        }
      },

      updateUserPoints: (delta: number) => {
        set((state) => ({
          user: state.user ? {
            ...state.user,
            tierPoints: Math.max(0, (state.user.tierPoints || 0) + delta)
          } : null
        }));
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'eiffel-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
