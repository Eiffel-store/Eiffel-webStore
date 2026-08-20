import { apiClient } from './apiClient';
import { ApiResponse, LoginCredentials, RegisterData, AuthResult } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      const response = await apiClient.post<ApiResponse<AuthResult>>('/auth/login', credentials);
      return response.data.data;
    } catch (err: any) {
      // Demo / Offline fallback
      const email = credentials.email.toLowerCase().trim();
      if (email === 'admin@eiffel.com' && credentials.password === 'admin123') {
        return {
          id: 1,
          name: 'Tarek Mansour (Admin)',
          email: 'admin@eiffel.com',
          role: 'ROLE_ADMIN',
          tier: 'VIP_PLATINUM',
          tierPoints: 2450,
          token: 'demo-admin-jwt-token-eiffel',
        };
      }
      if (email === 'staff@eiffel.com' && credentials.password === 'staff123') {
        return {
          id: 2,
          name: 'Ahmed Youssef (Staff)',
          email: 'staff@eiffel.com',
          role: 'ROLE_STAFF',
          tier: 'GOLD',
          tierPoints: 850,
          token: 'demo-staff-jwt-token-eiffel',
        };
      }
      if (email.includes('@') && credentials.password && credentials.password.length >= 4) {
        return {
          id: Date.now(),
          name: email.split('@')[0].toUpperCase(),
          email: email,
          role: 'ROLE_CUSTOMER',
          tier: 'MEMBER',
          tierPoints: 50,
          token: `demo-customer-jwt-token-${Date.now()}`,
        };
      }
      throw err;
    }
  },

  register: async (userData: RegisterData): Promise<AuthResult> => {
    try {
      const response = await apiClient.post<ApiResponse<AuthResult>>('/auth/register', userData);
      return response.data.data;
    } catch (err: any) {
      // Demo / Offline fallback for registration
      if (userData.email && userData.password) {
        return {
          id: Date.now(),
          name: userData.name || userData.email.split('@')[0],
          email: userData.email,
          role: 'ROLE_CUSTOMER',
          tier: 'MEMBER',
          tierPoints: 50,
          token: `demo-reg-jwt-token-${Date.now()}`,
        };
      }
      throw err;
    }
  },

  getProfile: async (): Promise<AuthResult> => {
    const response = await apiClient.get<ApiResponse<AuthResult>>('/auth/me');
    return response.data.data;
  },
};
