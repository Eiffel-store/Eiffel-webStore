import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

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
    const storedAuth = localStorage.getItem('eiffel-auth-storage');
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error('Failed to parse auth storage token', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format error messages & handle 401/403
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message || error.message || 'حدث خطأ في الاتصال بالسيرفر';
    
    if (error.response?.status === 401) {
      console.warn('Unauthorized request - session may have expired.');
    }
    
    return Promise.reject(new Error(message));
  }
);
