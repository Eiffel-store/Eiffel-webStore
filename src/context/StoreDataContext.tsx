import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, StoreLocation, CategoryItem, Coupon, Order, StoreSettings } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES as INITIAL_CATEGORIES } from '../data/products';
import { STORES as INITIAL_STORES } from '../data/stores';

const INITIAL_CATEGORIES_DATA: CategoryItem[] = INITIAL_CATEGORIES.map(c => ({
  id: c.id,
  name: c.title,
  nameEn: c.id,
  subtitle: c.subtitle,
  image: c.image,
  itemCount: '12 PIECES',
  subCategories: []
}));

const STORAGE_KEYS = {
  PRODUCTS: 'eiffel_products_v2',
  CATEGORIES: 'eiffel_categories_v2',
  STORES: 'eiffel_stores_v2',
  COUPONS: 'eiffel_coupons_v2',
  ORDERS: 'eiffel_orders_v2',
  SETTINGS: 'eiffel_settings_v2'
};

const DEFAULT_COUPONS: Coupon[] = [
  { id: 'c-1', code: 'EIFFEL10', discountPercentage: 10, minOrderAmount: 500, isActive: true },
  { id: 'c-2', code: 'SUMMER20', discountPercentage: 20, minOrderAmount: 1000, isActive: true },
  { id: 'c-3', code: 'VIP15', discountPercentage: 15, minOrderAmount: 800, isActive: true }
];

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'EIFFEL',
  tagline: 'Luxury Menswear & Architectural Fashion',
  phone: '+20 100 932 6801',
  whatsappNumber: '+201009326801',
  facebookUrl: 'https://www.facebook.com/profile.php?id=100093268017929',
  instagramUrl: 'https://instagram.com/eiffel_menswear',
  announcementTextAr: 'خصم 10% على أول طلب باستخدام الكود',
  announcementTextEn: 'Complimentary Express Delivery on orders over 1000 EGP with code',
  currency: 'EGP',
  freeShippingThreshold: 1000,
  adminPin: '123456'
};

interface StoreDataContextType {
  products: Product[];
  categories: CategoryItem[];
  stores: StoreLocation[];
  coupons: Coupon[];
  orders: Order[];
  settings: StoreSettings;

  // Products CRUD
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;

  // Categories CRUD
  addCategory: (category: Omit<CategoryItem, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => void;

  // Stores CRUD
  addStore: (store: Omit<StoreLocation, 'id'>) => void;
  updateStore: (id: string, updates: Partial<StoreLocation>) => void;
  deleteStore: (id: string) => void;

  // Coupons CRUD
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  validateCoupon: (code: string, subtotal: number) => Coupon | null;

  // Orders CRUD
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;

  // Settings
  updateSettings: (updates: Partial<StoreSettings>) => void;

  // Backup / Restore
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  resetAllToDefault: () => void;
}

const StoreDataContext = createContext<StoreDataContextType | undefined>(undefined);

export const StoreDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES_DATA;
    } catch {
      return INITIAL_CATEGORIES_DATA;
    }
  });

  const [stores, setStores] = useState<StoreLocation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STORES);
      return saved ? JSON.parse(saved) : INITIAL_STORES;
    } catch {
      return INITIAL_STORES;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
      return saved ? JSON.parse(saved) : DEFAULT_COUPONS;
    } catch {
      return DEFAULT_COUPONS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products to storage', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Error saving categories to storage', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(stores));
    } catch (e) {
      console.error('Error saving stores to storage', e);
    }
  }, [stores]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    } catch (e) {
      console.error('Error saving coupons to storage', e);
    }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders to storage', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings to storage', e);
    }
  }, [settings]);

  // Product Methods
  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const slug = productData.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const newId = slug ? `eiffel-${slug}-${Date.now().toString().slice(-4)}` : `eiffel-prod-${Date.now()}`;

    const newProduct: Product = {
      ...productData,
      id: newId,
      createdAt: new Date().toISOString()
    };

    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  // Category Methods
  const addCategory = (catData: Omit<CategoryItem, 'id'>) => {
    const newId = catData.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `cat-${Date.now()}`;
    const newCat: CategoryItem = { ...catData, id: newId };
    setCategories(prev => [...prev, newCat]);
  };

  const updateCategory = (id: string, updates: Partial<CategoryItem>) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Store Methods
  const addStore = (storeData: Omit<StoreLocation, 'id'>) => {
    const newId = `store-${Date.now()}`;
    const newStore: StoreLocation = { ...storeData, id: newId };
    setStores(prev => [...prev, newStore]);
  };

  const updateStore = (id: string, updates: Partial<StoreLocation>) => {
    setStores(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteStore = (id: string) => {
    setStores(prev => prev.filter(s => s.id !== id));
  };

  // Coupon Methods
  const addCoupon = (couponData: Omit<Coupon, 'id'>) => {
    const newCoupon: Coupon = { ...couponData, id: `coupon-${Date.now()}`, code: couponData.code.toUpperCase().trim() };
    setCoupons(prev => [...prev, newCoupon]);
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const validateCoupon = (code: string, subtotal: number): Coupon | null => {
    const cleanCode = code.toUpperCase().trim();
    const found = coupons.find(c => c.code === cleanCode && c.isActive);
    if (!found) return null;
    if (found.minOrderAmount && subtotal < found.minOrderAmount) return null;
    return found;
  };

  // Order Methods
  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status } : o)));
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  // Settings
  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  // Export / Import
  const exportData = () => {
    const data = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      products,
      categories,
      stores,
      coupons,
      orders,
      settings
    };
    return JSON.stringify(data, null, 2);
  };

  const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.products && Array.isArray(data.products)) setProducts(data.products);
      if (data.categories && Array.isArray(data.categories)) setCategories(data.categories);
      if (data.stores && Array.isArray(data.stores)) setStores(data.stores);
      if (data.coupons && Array.isArray(data.coupons)) setCoupons(data.coupons);
      if (data.orders && Array.isArray(data.orders)) setOrders(data.orders);
      if (data.settings) setSettings(prev => ({ ...prev, ...data.settings }));
      return true;
    } catch (e) {
      console.error('Failed to import data', e);
      return false;
    }
  };

  const resetAllToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES_DATA);
    setStores(INITIAL_STORES);
    setCoupons(DEFAULT_COUPONS);
    setOrders([]);
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.STORES);
    localStorage.removeItem(STORAGE_KEYS.COUPONS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  };

  return (
    <StoreDataContext.Provider
      value={{
        products,
        categories,
        stores,
        coupons,
        orders,
        settings,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        addCategory,
        updateCategory,
        deleteCategory,
        addStore,
        updateStore,
        deleteStore,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        validateCoupon,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        updateSettings,
        exportData,
        importData,
        resetAllToDefault
      }}
    >
      {children}
    </StoreDataContext.Provider>
  );
};

export const useStoreData = () => {
  const context = useContext(StoreDataContext);
  if (!context) {
    throw new Error('useStoreData must be used within a StoreDataProvider');
  }
  return context;
};
