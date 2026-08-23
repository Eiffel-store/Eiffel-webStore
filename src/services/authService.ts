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
};
