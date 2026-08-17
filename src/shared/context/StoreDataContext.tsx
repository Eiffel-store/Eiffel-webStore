import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, StoreLocation, CategoryItem, Coupon, Order, StoreSettings } from '@/types';
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES as INITIAL_CATEGORIES } from '@/data/products';
import { STORES as INITIAL_STORES } from '@/data/stores';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { orderService } from '@/services/orderService';
import { couponService } from '@/services/couponService';
import { settingsService } from '@/services/settingsService';

const INITIAL_CATEGORIES_DATA: CategoryItem[] = INITIAL_CATEGORIES.map(c => ({
  id: c.id,
  name: c.title,
  nameEn: c.id,
  subtitle: c.subtitle,
  image: c.image,
  itemCount: '12 PIECES',
  subCategories: []
}));

const DEFAULT_COUPONS: Coupon[] = [
  { id: 'c-1', code: 'EIFFEL10', discountPercentage: 10, minOrderAmount: 500, isActive: true },
  { id: 'c-2', code: 'CAIRO20', discountPercentage: 20, minOrderAmount: 1000, isActive: true },
  { id: 'c-3', code: 'VIP30', discountPercentage: 30, minOrderAmount: 2500, isActive: true }
];

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'EIFFEL Egypt',
  tagline: 'الأناقة المعمارية الفاخرة في مصر',
  phone: '+20 10 2345 6789',
  whatsappNumber: '+20 10 2345 6789',
  facebookUrl: 'https://facebook.com/eiffel.eg',
  instagramUrl: 'https://instagram.com/eiffel.eg',
  announcementTextAr: 'شحن مجاني لكافة محافظات مصر للطلبات فوق 1500 ج.م | تشكيلة خريف وشتاء 2026',
  announcementTextEn: 'Complimentary express shipping across Egypt on orders over 1,500 EGP',
  currency: 'EGP',
  freeShippingThreshold: 1500,
  adminPin: '8899'
};

interface StoreDataContextType {
  products: Product[];
  categories: CategoryItem[];
  stores: StoreLocation[];
  coupons: Coupon[];
  orders: Order[];
  settings: StoreSettings;
  isLoading: boolean;

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
  const queryClient = useQueryClient();

  // 1. React Query: Fetch Products with initial fallback
  const { data: serverProducts, isLoading: isProductsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
    placeholderData: INITIAL_PRODUCTS,
  });

  // 2. React Query: Fetch Categories
  const { data: serverCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
    placeholderData: INITIAL_CATEGORIES_DATA,
  });

  // 3. React Query: Fetch Settings
  const { data: serverSettings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.getSettings(),
    placeholderData: DEFAULT_SETTINGS,
  });

  // 4. Local & Server States
  const [stores, setStores] = useState<StoreLocation[]>(INITIAL_STORES);
  const [coupons, setCoupons] = useState<Coupon[]>(DEFAULT_COUPONS);
  const [orders, setOrders] = useState<Order[]>([]);

  const products = (serverProducts && serverProducts.length > 0) ? serverProducts : INITIAL_PRODUCTS;
  const categories = (serverCategories && serverCategories.length > 0) ? serverCategories : INITIAL_CATEGORIES_DATA;
  const settings = serverSettings || DEFAULT_SETTINGS;

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: (p: Partial<Product>) => productService.create(p),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Product> }) =>
      productService.update(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: Partial<StoreSettings>) => settingsService.updateSettings(newSettings),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  });

  const createOrderMutation = useMutation({
    mutationFn: (order: Partial<Order>) => orderService.create(order),
    onSuccess: (newOrder) => {
      setOrders(prev => [newOrder, ...prev]);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order['status'] }) =>
      orderService.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });

  // Product Methods
  const addProduct = (newProdData: Omit<Product, 'id'>): Product => {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = { ...newProdData, id, createdAt: new Date().toISOString() };
    createProductMutation.mutate(newProduct);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    updateProductMutation.mutate({ id, updates });
  };

  const deleteProduct = (id: string) => {
    deleteProductMutation.mutate(id);
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find(p => p.id === id);
  };

  // Category Methods
  const addCategory = (catData: Omit<CategoryItem, 'id'>) => {
    const id = catData.nameEn ? catData.nameEn.toLowerCase().replace(/\s+/g, '-') : `cat-${Date.now()}`;
    const newCat: CategoryItem = { ...catData, id };
    categoryService.create(newCat).then(() => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    });
  };

  const updateCategory = (id: string, updates: Partial<CategoryItem>) => {
    // Local / Server sync
  };

  const deleteCategory = (id: string) => {
    categoryService.delete(id).then(() => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    });
  };

  // Store Methods
  const addStore = (s: Omit<StoreLocation, 'id'>) => {
    const newStore = { ...s, id: `store-${Date.now()}` };
    setStores(prev => [...prev, newStore]);
  };

  const updateStore = (id: string, updates: Partial<StoreLocation>) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteStore = (id: string) => {
    setStores(prev => prev.map(s => s.id === id ? s : s).filter(s => s.id !== id));
  };

  // Coupon Methods
  const addCoupon = (c: Omit<Coupon, 'id'>) => {
    const newCoupon = { ...c, id: `c-${Date.now()}` };
    setCoupons(prev => [...prev, newCoupon]);
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const validateCoupon = (code: string, subtotal: number): Coupon | null => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === cleanCode && c.isActive);
    if (!found) return null;
    if (found.minOrderAmount && subtotal < found.minOrderAmount) return null;
    return found;
  };

  // Order Methods
  const addOrder = (order: Order) => {
    createOrderMutation.mutate(order);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    updateOrderStatusMutation.mutate({ id: orderId, status });
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  // Settings
  const updateSettings = (updates: Partial<StoreSettings>) => {
    updateSettingsMutation.mutate(updates);
  };

  const exportData = (): string => {
    return JSON.stringify({ products, categories, stores, coupons, orders, settings }, null, 2);
  };

  const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.stores) setStores(data.stores);
      if (data.coupons) setCoupons(data.coupons);
      return true;
    } catch {
      return false;
    }
  };

  const resetAllToDefault = () => {
    queryClient.invalidateQueries();
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
        isLoading: isProductsLoading,
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
