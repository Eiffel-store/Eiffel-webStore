import React, { createContext, useContext } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  isStaff: boolean;
  isAdmin: boolean;
  loginAdminWithCredentials: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logoutAdmin: () => void;
  updateAdminPin: (currentPin: string, newPin: string) => { success: boolean; message: string };
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, role, login, logout } = useAuthStore();

  const isStaff = isAuthenticated && (role === 'ROLE_STAFF' || role === 'ROLE_ADMIN');
  const isAdmin = isAuthenticated && role === 'ROLE_ADMIN';
  const isAdminAuthenticated = isStaff;

  const loginAdminWithCredentials = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await login({ email, password });
      if (res.role !== 'ROLE_ADMIN' && res.role !== 'ROLE_STAFF') {
        logout();
        return {
          success: false,
          message: 'هذا الحساب مسجل كـ (عميل) وليس لديه صلاحيات الإدارة أو الموظفين.'
        };
      }
      return { success: true, message: 'تم تسجيل الدخول بنجاح' };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى.'
      };
    }
  };

  const logoutAdmin = () => {
    logout();
  };

  const updateAdminPin = (currentPin: string, newPin: string): { success: boolean; message: string } => {
    if (newPin.length < 4) {
      return { success: false, message: 'كلمة المرور الجديدة يجب أن تكون 4 أحرف/أرقام على الأقل' };
    }
    return { success: true, message: 'تم تحديث كلمة المرور بنجاح' };
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminAuthenticated,
        isStaff,
        isAdmin,
        loginAdminWithCredentials,
        logoutAdmin,
        updateAdminPin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
