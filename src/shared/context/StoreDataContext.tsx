import React, { createContext, useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, StoreLocation, CategoryItem, Coupon, Order, StoreSettings, HomePageSettings } from '@/types';
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES as INITIAL_CATEGORIES } from '@/data/products';
import { STORES as INITIAL_STORES } from '@/data/stores';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { storeService } from '@/services/storeService';
import { orderService } from '@/services/orderService';
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

export const DEFAULT_HOME_SETTINGS: HomePageSettings = {
  hero: {
    tagEn: 'AUTUMN / WINTER 2026 CAMPAIGN',
    tagAr: 'تشكيلة خريف / شتاء 2026 الحصرية',
    titleEn: 'ARCHITECTURAL FORM',
    titleAr: 'الهيبة المعمارية الفاخرة',
    subtitleEn: 'Heavyweight Egyptian Giza Cotton engineered with brutalist discipline and precision tailoring.',
    subtitleAr: 'قطن مصري فاخر ثقيل محاك بانضباط معماري وقصات حصرية فائقة الدقة.',
    buttonTextEn: 'EXPLORE COLLECTION',
    buttonTextAr: 'استكشف التشكيلة',
    buttonLink: '/collections/men',
    secondaryButtonTextEn: 'VIEW LOOKBOOK',
    secondaryButtonTextAr: 'عرض الكتالوج',
    secondaryButtonLink: '/collections/new-arrivals',
    imageUrl: `${import.meta.env.BASE_URL}images/products/eiffel-outfit-flatlay.jpg`
  },
  promoEditorial: {
    badgeEn: 'LIMITED EDITION CAPSULE',
    badgeAr: 'إصدار محدود خاص',
    titleEn: 'EIFFEL HEAVY OVERSHIRT',
    titleAr: 'قميص إيفل المعماري الثقيل',
    descriptionEn: 'Double-faced heavyweight textile structure designed for effortless elegance and enduring comfort.',
    descriptionAr: 'نسيج فاخر مزدوج الوجه مصمم ليمنحك حضوراً واثقاً وراحة فائقة طوال اليوم.',
    buttonTextEn: 'ACQUIRE PIECE',
    buttonTextAr: 'اطلب القطعة الآن',
    buttonLink: '/collections/offers',
    discountBadgeEn: 'UP TO 30% OFF',
    discountBadgeAr: 'خصم يصل إلى 30%',
    imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop'
  },
  shopTheLook: {
    titleEn: 'SHOP THE COMPLETE LOOK',
    titleAr: 'تسوق الإطلالة الكاملة',
    subtitleEn: 'Curated Ensemble for the Modern Man',
    subtitleAr: 'تنسيق متناسق متكامل للرجل العصري',
    imageUrl: `${import.meta.env.BASE_URL}images/products/eiffel-cardigan-trio.jpg`,
    collectionLink: '/collections/men',
    hotspots: [
      { id: 'h-1', x: 50, y: 30, titleEn: 'Heavyweight Cardigan', titleAr: 'كارديجان ثقيل', price: 650 },
      { id: 'h-2', x: 48, y: 55, titleEn: 'Relaxed Tailored Pant', titleAr: 'بنطال تيلورد مريح', price: 480 },
      { id: 'h-3', x: 52, y: 80, titleEn: 'Leather Minimal Chelsea', titleAr: 'حذاء تشيلسي كلاسيك', price: 890 }
    ]
  }
};

interface StoreDataContextType {
  products: Product[];
  categories: CategoryItem[];
  stores: StoreLocation[];
  coupons: Coupon[];
  orders: Order[];
  settings: StoreSettings;
  homeSettings: HomePageSettings;
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
  updateHomeSettings: (updates: Partial<HomePageSettings>) => void;

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
    queryFn: () => productService.getAll().catch(() => INITIAL_PRODUCTS),
    placeholderData: INITIAL_PRODUCTS,
  });

  // 2. React Query: Fetch Categories
  const { data: serverCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll().catch(() => INITIAL_CATEGORIES_DATA),
    placeholderData: INITIAL_CATEGORIES_DATA,
  });

  // 3. React Query: Fetch Settings
  const { data: serverSettings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.getSettings().catch(() => DEFAULT_SETTINGS),
    placeholderData: DEFAULT_SETTINGS,
  });

  // 4. React Query: Fetch Stores
  const { data: serverStores } = useQuery({
    queryKey: ['stores'],
    queryFn: () => storeService.getAll().catch(() => INITIAL_STORES),
    placeholderData: INITIAL_STORES,
  });

  // 5. Local & Server States with smart offline fallback
  const [localProducts, setLocalProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [localCategories, setLocalCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES_DATA);
  const [localStores, setLocalStores] = useState<StoreLocation[]>(INITIAL_STORES);
  const [coupons, setCoupons] = useState<Coupon[]>(DEFAULT_COUPONS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [localSettings, setLocalSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [homeSettings, setHomeSettings] = useState<HomePageSettings>(() => {
    try {
      const saved = localStorage.getItem('eiffel_home_settings');
      return saved ? { ...DEFAULT_HOME_SETTINGS, ...JSON.parse(saved) } : DEFAULT_HOME_SETTINGS;
    } catch {
      return DEFAULT_HOME_SETTINGS;
    }
  });

  const products = (serverProducts && serverProducts.length > 0) ? serverProducts : localProducts;
  const categories = (serverCategories && serverCategories.length > 0) ? serverCategories : localCategories;
  const stores = (serverStores && serverStores.length > 0) ? serverStores : localStores;
  const settings = serverSettings || localSettings;

  // Home Page Settings
  const updateHomeSettings = (updates: Partial<HomePageSettings>) => {
    setHomeSettings(prev => {
      const updated = {
        ...prev,
        ...updates,
        hero: updates.hero ? { ...prev.hero, ...updates.hero } : prev.hero,
        promoEditorial: updates.promoEditorial ? { ...prev.promoEditorial, ...updates.promoEditorial } : prev.promoEditorial,
        shopTheLook: updates.shopTheLook ? { ...prev.shopTheLook, ...updates.shopTheLook } : prev.shopTheLook,
      };
      try {
        localStorage.setItem('eiffel_home_settings', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save home settings', err);
      }
      return updated;
    });
  };

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

  const createStoreMutation = useMutation({
    mutationFn: (s: Partial<StoreLocation>) => storeService.create(s),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stores'] }),
  });

  const updateStoreMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<StoreLocation> }) =>
      storeService.update(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stores'] }),
  });

  const deleteStoreMutation = useMutation({
    mutationFn: (id: string) => storeService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stores'] }),
  });

  // Product Methods
  const addProduct = (newProdData: Omit<Product, 'id'>): Product => {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = { ...newProdData, id, createdAt: new Date().toISOString() };
    setLocalProducts(prev => [newProduct, ...prev]);
    createProductMutation.mutate(newProduct);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setLocalProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    updateProductMutation.mutate({ id, updates });
  };

  const deleteProduct = (id: string) => {
    setLocalProducts(prev => prev.filter(p => p.id !== id));
    deleteProductMutation.mutate(id);
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find(p => p.id === id);
  };

  // Category Methods
  const addCategory = (catData: Omit<CategoryItem, 'id'>) => {
    const id = catData.nameEn ? catData.nameEn.toLowerCase().replace(/\s+/g, '-') : `cat-${Date.now()}`;
    const newCat: CategoryItem = { ...catData, id };
    setLocalCategories(prev => [...prev, newCat]);
    categoryService.create(newCat).then(() => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }).catch(() => {
      // offline fallback
    });
  };

  const updateCategory = (id: string, updates: Partial<CategoryItem>) => {
    setLocalCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCategory = (id: string) => {
    setLocalCategories(prev => prev.filter(c => c.id !== id));
    categoryService.delete(id).then(() => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }).catch(() => {
      // offline fallback
    });
  };

  // Store Methods
  const addStore = (s: Omit<StoreLocation, 'id'>) => {
    const id = `store-${Date.now()}`;
    const newStore: StoreLocation = { ...s, id };
    setLocalStores(prev => [...prev, newStore]);
    createStoreMutation.mutate(newStore);
  };

  const updateStore = (id: string, updates: Partial<StoreLocation>) => {
    setLocalStores(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    updateStoreMutation.mutate({ id, updates });
  };

  const deleteStore = (id: string) => {
    setLocalStores(prev => prev.filter(s => s.id !== id));
    deleteStoreMutation.mutate(id);
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
    setOrders(prev => [order, ...prev]);
    createOrderMutation.mutate(order);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    updateOrderStatusMutation.mutate({ id: orderId, status });
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  // Settings
  const updateSettings = (updates: Partial<StoreSettings>) => {
    setLocalSettings(prev => ({ ...prev, ...updates }));
    updateSettingsMutation.mutate(updates);
  };

  const exportData = (): string => {
    return JSON.stringify({ products, categories, stores, coupons, orders, settings, homeSettings }, null, 2);
  };

  const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.stores) setLocalStores(data.stores);
      if (data.coupons) setCoupons(data.coupons);
      if (data.products) setLocalProducts(data.products);
      if (data.categories) setLocalCategories(data.categories);
      if (data.homeSettings) {
        setHomeSettings(data.homeSettings);
        localStorage.setItem('eiffel_home_settings', JSON.stringify(data.homeSettings));
      }
      return true;
    } catch {
      return false;
    }
  };

  const resetAllToDefault = () => {
    setLocalProducts(INITIAL_PRODUCTS);
    setLocalCategories(INITIAL_CATEGORIES_DATA);
    setLocalStores(INITIAL_STORES);
    setCoupons(DEFAULT_COUPONS);
    setLocalSettings(DEFAULT_SETTINGS);
    setHomeSettings(DEFAULT_HOME_SETTINGS);
    localStorage.removeItem('eiffel_home_settings');
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
        homeSettings,
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
        updateHomeSettings,
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
