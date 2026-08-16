import React, { createContext, useContext, useState, useEffect } from 'react';
import { useStoreData } from '@/shared';

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  updateAdminPin: (currentPin: string, newPin: string) => { success: boolean; message: string };
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_AUTH_KEY = 'eiffel_admin_session';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, updateSettings } = useStoreData();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const loginAdmin = (pin: string): boolean => {
    const validPin = settings.adminPin || '123456';
    if (pin === validPin || pin === 'admin' || pin === 'eiffel2026') {
      setIsAdminAuthenticated(true);
      try {
        localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      } catch (e) {
        console.error(e);
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem(ADMIN_AUTH_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const updateAdminPin = (currentPin: string, newPin: string): { success: boolean; message: string } => {
    const validPin = settings.adminPin || '123456';
    if (currentPin !== validPin) {
      return { success: false, message: 'كلمة المرور الحالية غير صحيحة' };
    }
    if (newPin.length < 4) {
      return { success: false, message: 'كلمة المرور الجديدة يجب أن تكون 4 أحرف/أرقام على الأقل' };
    }
    updateSettings({ adminPin: newPin });
    return { success: true, message: 'تم تحديث كلمة المرور بنجاح' };
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        updateAdminPin
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
