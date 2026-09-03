import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, LoginCredentials, RegisterData, AuthResult, Address } from '../types';
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
  register: (data: RegisterData) => Promise<{ success: boolean; requiresActivation: boolean; email: string; message: string }>;
  verifyAccount: (email: string, otp: string) => Promise<AuthResult>;
  logout: () => void;
  setUser: (user: User, token: string, refreshToken?: string) => void;
  setTokens: (token: string, refreshToken?: string) => void;
  fetchProfile: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  updateUserPoints: (delta: number) => void;
  addAddress: (address: Omit<Address, 'id'> | Address) => Address;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
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
          const result = await authService.register(registerData);
          set({ isLoading: false });
          return result;
        } catch (err: any) {
          const message = err.message || 'فشل إنشاء الحساب';
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      verifyAccount: async (email: string, otp: string) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.verifyAccount(email, otp);
          const rawUser = (data as any).user || (data as any);
          const rawPoints = rawUser.points ?? rawUser.tierPoints ?? data.tierPoints ?? 50;
          const isVip = Boolean(rawUser.isVip ?? (data as any).isVip ?? (rawUser.tier === 'VIP' || rawUser.tier === 'VIP_PLATINUM'));
          const accessToken = data.accessToken || data.token;
          const refreshToken = data.refreshToken || null;

          const user: User = {
            id: String(rawUser.id || data.id || Date.now()),
            name: rawUser.name || data.name || email.split('@')[0],
            email: rawUser.email || data.email || email,
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
          const message = err.message || 'فشل تفعيل الحساب';
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      logout: () => {
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('eiffel_auth_token');
          localStorage.removeItem('eiffel_user');
          localStorage.removeItem('eiffel-auth-storage');
          sessionStorage.clear();
        } catch {}
        set({
          user: null,
          token: null,
          refreshToken: null,
          role: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
          isProfileLoading: false,
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

      refreshSession: async (): Promise<boolean> => {
        let refreshToken = get().refreshToken || localStorage.getItem('refreshToken');
        if (!refreshToken || refreshToken === 'undefined' || refreshToken === 'null') {
          const storedAuth = localStorage.getItem('eiffel-auth-storage');
          if (storedAuth) {
            try {
              const parsed = JSON.parse(storedAuth);
              refreshToken = parsed?.state?.refreshToken;
            } catch {}
          }
        }

        if (!refreshToken || refreshToken === 'undefined' || refreshToken === 'null') {
          return false;
        }

        try {
          const data = await authService.refreshToken(refreshToken);
          const newAccessToken = data?.accessToken || data?.token;
          const newRefreshToken = data?.refreshToken || refreshToken;

          if (newAccessToken) {
            get().setTokens(newAccessToken, newRefreshToken);
            return true;
          }
          return false;
        } catch (err) {
          console.warn('Silent token refresh failed:', err);
          return false;
        }
      },

      fetchProfile: async () => {
        const storedToken = localStorage.getItem('token') || localStorage.getItem('eiffel_auth_token');
        if (!storedToken || storedToken === 'undefined' || storedToken === 'null' || storedToken.trim().length < 10) {
          get().logout();
          return;
        }

        set({ isProfileLoading: true });
        try {
          const data = await authService.getProfile();
          if (data && ((data as any).email || (data as any).user?.email || data.name)) {
            const rawUser = (data as any).user || (data as any);
            const rawPoints = rawUser.points ?? rawUser.tierPoints ?? (data as any).tierPoints ?? 0;
            const isVip = Boolean(rawUser.isVip ?? (data as any).isVip ?? (rawUser.tier === 'VIP' || rawUser.tier === 'VIP_PLATINUM'));
            set((state) => ({
              user: state.user ? {
                ...state.user,
                id: String(rawUser.id || state.user.id || ''),
                name: rawUser.name || data.name || state.user.name,
                email: rawUser.email || data.email || state.user.email,
                role: rawUser.role || data.role || state.user.role,
                tier: isVip ? 'VIP' : ((data.tier as any) || rawUser.tier || 'MEMBER'),
                isVip: isVip,
                points: rawPoints,
                tierPoints: rawPoints,
                phone: rawUser.phone || data.phone || state.user.phone,
                addresses: (rawUser.addresses && rawUser.addresses.length > 0) ? rawUser.addresses : (state.user.addresses || []),
              } : {
                id: String(rawUser.id || ''),
                name: rawUser.name || data.name || '',
                email: rawUser.email || data.email || '',
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
              },
              role: (rawUser.role || data.role || 'ROLE_CUSTOMER') as any,
              isAuthenticated: true,
            }));
          }
        } catch {
          // If profile fetch fails, attempt a silent token refresh first before logging out
          const refreshed = await get().refreshSession();
          if (!refreshed) {
            get().logout();
          }
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

      addAddress: (address: Omit<Address, 'id'> | Address) => {
        const currentUser = get().user;
        const currentAddresses = currentUser?.addresses || [];
        const isFirst = currentAddresses.length === 0;
        const newAddress: Address = {
          ...address,
          id: (address as Address).id || `addr-${Date.now()}`,
          isDefault: address.isDefault !== undefined ? address.isDefault : isFirst,
        };

        const updatedAddresses = newAddress.isDefault
          ? [...currentAddresses.map((a) => ({ ...a, isDefault: false })), newAddress]
          : [...currentAddresses, newAddress];

        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                addresses: updatedAddresses,
              }
            : null,
        }));

        return newAddress;
      },

      removeAddress: (id: string) => {
        set((state) => {
          if (!state.user) return {};
          const remaining = (state.user.addresses || []).filter((a) => a.id !== id);
          if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
            remaining[0].isDefault = true;
          }
          return {
            user: {
              ...state.user,
              addresses: remaining,
            },
          };
        });
      },

      setDefaultAddress: (id: string) => {
        set((state) => {
          if (!state.user) return {};
          return {
            user: {
              ...state.user,
              addresses: (state.user.addresses || []).map((a) => ({
                ...a,
                isDefault: a.id === id,
              })),
            },
          };
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'eiffel-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
