import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Helper to safely set Authorization header across all Axios / AxiosHeaders instances
const setAuthHeader = (config: InternalAxiosRequestConfig, token: string) => {
  if (!config.headers) {
    config.headers = new axios.AxiosHeaders();
  }
  if (typeof config.headers.set === 'function') {
    config.headers.set('Authorization', `Bearer ${token}`);
  } else {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
};

// Request Interceptor: Automatically attach JWT Bearer token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // If Authorization header is already set (e.g., from retry with fresh token), keep it
    const existingAuth = typeof config.headers?.get === 'function'
      ? config.headers.get('Authorization')
      : config.headers?.['Authorization'];

    if (!existingAuth) {
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

      if (token && token !== 'undefined' && token !== 'null') {
        setAuthHeader(config, token);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Token Refresh State & Concurrency Queue
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error: any) => void;
  request: InternalAxiosRequestConfig;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject, request }) => {
    if (error) {
      reject(error);
    } else if (token) {
      setAuthHeader(request, token);
      resolve(apiClient(request));
    }
  });
  failedQueue = [];
};

// Helper to retrieve refresh token from localStorage or Zustand store
const getStoredRefreshToken = (): string | null => {
  let refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken || refreshToken === 'undefined' || refreshToken === 'null') {
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
  return refreshToken && refreshToken !== 'undefined' && refreshToken !== 'null' ? refreshToken : null;
};

// Response Interceptor: Seamless Auto-Refresh & Retry on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || '';
    const isAuthEndpoint =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/refresh') ||
      requestUrl.includes('/auth/verify-account') ||
      requestUrl.includes('/auth/verify-otp') ||
      requestUrl.includes('/auth/reset-password');

    // If 401 received on a non-auth endpoint and hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Enqueue this request while refreshing is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, request: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getStoredRefreshToken();

      if (!refreshToken) {
        isRefreshing = false;
        useAuthStore.getState().logout();
        processQueue(error, null);
        const message = error.response?.data?.message || 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً';
        return Promise.reject(new Error(message));
      }

      try {
        // Send refresh token request directly via raw axios to bypass interceptors
        const refreshResponse = await axios.post(
          `${BASE_URL}/auth/refresh`,
          { refreshToken },
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000,
          }
        );

        const authData = refreshResponse.data?.data;
        const newAccessToken = authData?.accessToken || authData?.token;
        const newRefreshToken = authData?.refreshToken || refreshToken;

        if (!newAccessToken) {
          throw new Error('No access token returned from refresh endpoint');
        }

        // Save fresh tokens in storage and Zustand state
        localStorage.setItem('token', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);

        // Resume and retry all queued requests with the new access token
        processQueue(null, newAccessToken);

        // Retry the original request with the fresh token
        setAuthHeader(originalRequest, newAccessToken);
        return apiClient(originalRequest);
      } catch (refreshErr) {
        // Refresh token is expired or invalid -> log out and reject queue
        useAuthStore.getState().logout();
        processQueue(refreshErr, null);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    const message = error.response?.data?.message || error.message || 'حدث خطأ في الاتصال بالسيرفر';
    return Promise.reject(new Error(message));
  }
);
