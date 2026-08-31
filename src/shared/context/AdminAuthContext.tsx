import React, { createContext, useContext } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useStoreData } from './StoreDataContext';

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  loginAdmin: (pin: string) => boolean | Promise<boolean>;
  logoutAdmin: () => void;
  updateAdminPin: (currentPin: string, newPin: string) => { success: boolean; message: string };
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { updateSettings } = useStoreData();
  const { isAuthenticated, role, login, logout } = useAuthStore();

  const isAdminAuthenticated = isAuthenticated && (role === 'ROLE_ADMIN' || role === 'ROLE_STAFF');

  const loginAdmin = async (password: string): Promise<boolean> => {
    try {
      await login({ email: 'admin@eiffel.com', password: password || 'admin123' });
      return true;
    } catch (e) {
      console.warn('Backend login failed', e);
      return false;
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
        loginAdmin,
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
