import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Automatically attach JWT Bearer token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    let token = localStorage.getItem('token') || localStorage.getItem('eiffel_auth_token') || sessionStorage.getItem('token');
    
    if (!token) {
      const storedAuth = localStorage.getItem('eiffel-auth-storage');
      if (storedAuth) {
        try {
          const parsed = JSON.parse(storedAuth);
          token = parsed?.state?.token;
        } catch (e) {
          console.error('Failed to parse auth storage token', e);
        }
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Token Refresh Queue Management
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Seamless Auto-Refresh & Retry on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Ignore refresh loop for auth login, register, and refresh endpoints
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') ||
                           originalRequest?.url?.includes('/auth/register') ||
                           originalRequest?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Queue the request until refreshing finishes
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Extract refreshToken from localStorage / zustand
      let refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        const storedAuth = localStorage.getItem('eiffel-auth-storage');
        if (storedAuth) {
          try {
            const parsed = JSON.parse(storedAuth);
            refreshToken = parsed?.state?.refreshToken;
          } catch (e) {
            console.error('Failed to parse refreshToken from storage', e);
          }
        }
      }

      if (!refreshToken) {
        isRefreshing = false;
        useAuthStore.getState().logout();

        // If it was a public catalog request, retry anonymously so the user still sees products
        if (originalRequest.method?.toUpperCase() === 'GET' &&
            !originalRequest.url?.includes('/auth/me') &&
            !originalRequest.url?.includes('/orders/my-orders') &&
            !originalRequest.url?.includes('/admin/')) {
          delete originalRequest.headers.Authorization;
          return axios(originalRequest);
        }

        const message = error.response?.data?.message || 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً';
        return Promise.reject(new Error(message));
      }

      try {
        // Call backend /auth/refresh directly using raw axios to avoid interceptor recursion
        const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const authData = refreshResponse.data?.data;
        const newAccessToken = authData?.accessToken || authData?.token;
        const newRefreshToken = authData?.refreshToken || refreshToken;

        if (!newAccessToken) {
          throw new Error('No access token returned from refresh endpoint');
        }

        // Update tokens in Zustand & localStorage
        useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);
        localStorage.setItem('token', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Resume all queued requests
        processQueue(null, newAccessToken);

        // Replay original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        useAuthStore.getState().logout();

        // If it was a public catalog request, retry anonymously so the user still sees products
        if (originalRequest.method?.toUpperCase() === 'GET' &&
            !originalRequest.url?.includes('/auth/me') &&
            !originalRequest.url?.includes('/orders/my-orders') &&
            !originalRequest.url?.includes('/admin/')) {
          delete originalRequest.headers.Authorization;
          return axios(originalRequest);
        }

        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    const message = error.response?.data?.message || error.message || 'حدث خطأ في الاتصال بالسيرفر';
    return Promise.reject(new Error(message));
  }
);
