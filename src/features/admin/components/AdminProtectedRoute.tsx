import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAuthStore } from '@/stores/useAuthStore';

export const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdminAuthenticated } = useAdminAuth();
  const { role } = useAuthStore();
  const location = useLocation();

  if (!isAdminAuthenticated || (role !== 'ROLE_ADMIN' && role !== 'ROLE_STAFF')) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
