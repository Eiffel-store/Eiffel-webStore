import React, { createContext, useContext, useState, useEffect } from 'react';
import { Address, Order, PaymentMethod } from '@/types';
import { useAuthStore } from '@/stores/useAuthStore';

export interface UserProfile {
  id?: string | number;
  name: string;
  email: string;
  tier: 'EIFFEL PRIVÉ' | 'EIFFEL NOIR' | 'VIP' | 'MEMBER' | string;
  tierPoints: number;
  completedOrdersCount?: number;
  totalSpend?: number;
  isVip?: boolean;
  phone: string;
  memberSince: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  orders: Order[];
}

interface AuthContextType {
  user: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addPaymentMethod: (payment: Omit<PaymentMethod, 'id'>) => void;
  deletePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  placeOrder: (order: Omit<Order, 'id' | 'date' | 'status' | 'trackingNumber' | 'estimatedDelivery'>) => Order;
}

const DEFAULT_EMPTY_USER: UserProfile = {
  name: '',
  email: '',
  phone: '',
  tier: 'MEMBER',
  tierPoints: 0,
  completedOrdersCount: 0,
  isVip: false,
  memberSince: new Date().getFullYear().toString(),
  addresses: [],
  paymentMethods: [],
  orders: []
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authStoreUser = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const [user, setUser] = useState<UserProfile>(DEFAULT_EMPTY_USER);

  useEffect(() => {
    if (!isAuthenticated || !authStoreUser) {
      setUser(DEFAULT_EMPTY_USER);
      try {
        localStorage.removeItem('eiffel_user');
      } catch {}
    } else {
      setUser({
        id: authStoreUser.id,
        name: authStoreUser.name || '',
        email: authStoreUser.email || '',
        phone: authStoreUser.phone || '',
        tier: authStoreUser.tier || 'MEMBER',
        tierPoints: authStoreUser.tierPoints ?? 0,
        isVip: authStoreUser.isVip ?? false,
        memberSince: authStoreUser.memberSince || '2026',
        addresses: authStoreUser.addresses || [],
        paymentMethods: authStoreUser.paymentMethods || [],
        orders: authStoreUser.orders || []
      });
    }
  }, [isAuthenticated, authStoreUser]);

  const updateProfile = (data: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      ...address,
      id: `addr-${Date.now()}`
    };
    setUser(prev => {
      const addresses = address.isDefault
        ? prev.addresses.map(a => ({ ...a, isDefault: false }))
        : prev.addresses;
      return {
        ...prev,
        addresses: [...addresses, newAddr]
      };
    });
  };

  const updateAddress = (id: string, address: Partial<Address>) => {
    setUser(prev => ({
      ...prev,
      addresses: prev.addresses.map(a => (a.id === id ? { ...a, ...address } : a))
    }));
  };

  const deleteAddress = (id: string) => {
    setUser(prev => ({
      ...prev,
      addresses: prev.addresses.filter(a => a.id !== id)
    }));
  };

  const setDefaultAddress = (id: string) => {
    setUser(prev => ({
      ...prev,
      addresses: prev.addresses.map(a => ({
        ...a,
        isDefault: a.id === id
      }))
    }));
  };

  const addPaymentMethod = (payment: Omit<PaymentMethod, 'id'>) => {
    const newPayment: PaymentMethod = {
      ...payment,
      id: `card-${Date.now()}`
    };
    setUser(prev => {
      const paymentMethods = payment.isDefault
        ? prev.paymentMethods.map(p => ({ ...p, isDefault: false }))
        : prev.paymentMethods;
      return {
        ...prev,
        paymentMethods: [...paymentMethods, newPayment]
      };
    });
  };

  const deletePaymentMethod = (id: string) => {
    setUser(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter(p => p.id !== id)
    }));
  };

  const setDefaultPaymentMethod = (id: string) => {
    setUser(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map(p => ({
        ...p,
        isDefault: p.id === id
      }))
    }));
  };

  const placeOrder = (
    orderData: Omit<Order, 'id' | 'date' | 'status' | 'trackingNumber' | 'estimatedDelivery'>
  ): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `EFL-EG-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
      status: 'Processing',
      trackingNumber: `BOSTA-EGY-${Math.floor(100000000 + Math.random() * 900000000)}`,
      estimatedDelivery: '24–48 HOURS'
    };

    setUser(prev => ({
      ...prev,
      tierPoints: prev.tierPoints + Math.max(1, Math.round(newOrder.total * 0.01)),
      orders: [newOrder, ...prev.orders]
    }));

    return newOrder;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        addPaymentMethod,
        deletePaymentMethod,
        setDefaultPaymentMethod,
        placeOrder
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
