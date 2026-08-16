import React, { createContext, useContext, useState, useEffect } from 'react';
import { Address, Order, PaymentMethod } from '@/types';

export interface UserProfile {
  name: string;
  email: string;
  tier: 'EIFFEL PRIVÉ' | 'EIFFEL NOIR' | 'MEMBER';
  tierPoints: number;
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

const INITIAL_USER: UserProfile = {
  name: 'Tarek Mansour',
  email: 'tarek.mansour@eiffel-client.eg',
  phone: '+20 100 123 4567',
  tier: 'EIFFEL PRIVÉ',
  tierPoints: 47500,
  memberSince: 'JANUARY 2025',
  addresses: [
    {
      id: 'addr-1',
      isDefault: true,
      type: 'Home',
      firstName: 'Tarek',
      lastName: 'Mansour',
      street: '18 Gezira Street, Apt 7A',
      city: 'Zamalek, Cairo',
      state: 'Cairo',
      postalCode: '11211',
      country: 'Egypt',
      phone: '+20 100 123 4567'
    },
    {
      id: 'addr-2',
      isDefault: false,
      type: 'Work',
      firstName: 'Tarek',
      lastName: 'Mansour',
      street: 'Complex 5A by The Waterway',
      city: 'New Cairo (5th Settlement)',
      state: 'Cairo',
      postalCode: '11835',
      country: 'Egypt',
      phone: '+20 100 123 4567'
    }
  ],
  paymentMethods: [
    {
      id: 'card-1',
      isDefault: true,
      type: 'visa',
      cardNumber: '•••• •••• •••• 4242',
      expiry: '09/28',
      cardholderName: 'TAREK MANSOUR'
    },
    {
      id: 'card-2',
      isDefault: false,
      type: 'mastercard',
      cardNumber: '•••• •••• •••• 8891',
      expiry: '12/27',
      cardholderName: 'TAREK MANSOUR'
    }
  ],
  orders: [
    {
      id: 'EFL-EG-89241',
      date: 'AUG 12, 2026',
      status: 'Delivered',
      trackingNumber: 'BOUSTA-EFL-992014881',
      estimatedDelivery: 'AUG 13, 2026',
      subtotal: 940,
      shipping: 0,
      discount: 0,
      tax: 0,
      total: 940,
      paymentMethod: 'InstaPay (@eiffel.egypt)',
      shippingAddress: {
        id: 'addr-1',
        isDefault: true,
        type: 'Home',
        firstName: 'Tarek',
        lastName: 'Mansour',
        street: '18 Gezira Street, Apt 7A',
        city: 'Zamalek, Cairo',
        state: 'Cairo',
        postalCode: '11211',
        country: 'Egypt',
        phone: '+20 100 123 4567'
      },
      items: [
        {
          product: {
            id: 'eiffel-monolith-overcoat',
            name: 'Monolith Double-Breasted Trench',
            subtitle: 'Bonded Heavy Wool & Technical Gabardine',
            price: 940,
            category: 'men',
            subCategory: 'Outerwear',
            images: [
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCseUeu5hdr7LWtZska9tdU1nipaGbIV9oDB4qQIfpmf9TGBKI3WMIeHE7Dhi3cpBD1BLkDSNssElp43QgvSsbNFoyCtrgDtaWeFakgnquiUwsZGJutEtBBG2VrOwNvDhRXK2l4kEiDc6woEqKHLmR-wjLYVi085GjBUjBr9WGc_WUmlNMKBme8o3SAnoAIsLDlCOY_WmzxZ_2Siru3KoWJD9zwJNdMDng5OdcgPqc2VO_kGELw2iBIhg'
            ],
            colors: [{ name: 'Carbon Black', hex: '#0a0a0a' }],
            sizes: ['48 (M)'],
            description: '',
            details: [],
            composition: '',
            fit: '',
            care: [],
            rating: 5,
            reviewCount: 38,
            inStock: true
          },
          quantity: 1,
          selectedSize: '48 (M)',
          selectedColor: 'Carbon Black'
        }
      ]
    }
  ]
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('eiffel_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  useEffect(() => {
    localStorage.setItem('eiffel_user', JSON.stringify(user));
  }, [user]);

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
      estimatedDelivery: '24–48 HOURS (CAIRO & GIZA)'
    };

    setUser(prev => ({
      ...prev,
      tierPoints: prev.tierPoints + Math.round(newOrder.total),
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
