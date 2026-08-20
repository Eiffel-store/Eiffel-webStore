import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, LoginCredentials, RegisterData, AuthResult } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  role: 'ROLE_ADMIN' | 'ROLE_STAFF' | 'ROLE_CUSTOMER' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>;
  logout: () => void;
  setUser: (user: User, token: string) => void;
  fetchProfile: () => Promise<void>;
  updateUserPoints: (delta: number) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.login(credentials);
          const user: User = {
            id: String(data.id),
            name: data.name,
            email: data.email,
            role: data.role,
            tier: (data.tier as any) || 'MEMBER',
            tierPoints: data.tierPoints || 0,
            phone: data.phone || '',
            memberSince: '2026',
            addresses: [],
            paymentMethods: [],
            orders: [],
          };

          set({
            user,
            token: data.token,
            role: data.role,
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
          const user: User = {
            id: String(data.id),
            name: data.name,
            email: data.email,
            role: data.role,
            tier: (data.tier as any) || 'MEMBER',
            tierPoints: data.tierPoints || 0,
            phone: data.phone || '',
            memberSince: '2026',
            addresses: [],
            paymentMethods: [],
            orders: [],
          };

          set({
            user,
            token: data.token,
            role: data.role,
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
        set({
          user: null,
          token: null,
          role: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setUser: (user, token) => {
        set({
          user,
          token,
          role: user.role as any,
          isAuthenticated: true,
        });
      },

      fetchProfile: async () => {
        try {
          const data = await authService.getProfile();
          if (data) {
            set((state) => ({
              user: state.user ? {
                ...state.user,
                name: data.name || state.user.name,
                tier: (data.tier as any) || state.user.tier,
                tierPoints: data.tierPoints ?? 0,
                phone: data.phone || state.user.phone,
              } : null
            }));
          }
        } catch {
          // ignore if unauthenticated or offline
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
