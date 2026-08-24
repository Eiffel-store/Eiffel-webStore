import { apiClient } from './apiClient';
import { ApiResponse, LoginCredentials, RegisterData, AuthResult } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResult> => {
    const response = await apiClient.post<ApiResponse<AuthResult>>('/auth/login', credentials);
    return response.data.data;
  },

  register: async (userData: RegisterData): Promise<AuthResult> => {
    const response = await apiClient.post<ApiResponse<AuthResult>>('/auth/register', userData);
    return response.data.data;
  },

  getProfile: async (): Promise<AuthResult> => {
    const response = await apiClient.get<ApiResponse<AuthResult>>('/auth/me');
    return response.data.data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResult> => {
    const response = await apiClient.post<ApiResponse<AuthResult>>('/auth/refresh', { refreshToken });
    return response.data.data;
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; message: string; expiresInSeconds?: number }> => {
    const response = await apiClient.post<ApiResponse<any>>('/auth/forgot-password', { email });
    return response.data.data || response.data;
  },

  verifyOtp: async (email: string, otp: string): Promise<{ success: boolean; verified: boolean; message: string }> => {
    const response = await apiClient.post<ApiResponse<any>>('/auth/verify-otp', { email, otp });
    return response.data.data || response.data;
  },

  resetPassword: async (payload: { email: string; otp: string; newPassword: string }): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<ApiResponse<any>>('/auth/reset-password', payload);
    return response.data.data || response.data;
  },
};
