import React, { createContext, useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, StoreLocation, CategoryItem, Coupon, Order, StoreSettings, HomePageSettings, Banner, BannerPlacement } from '@/types';
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES as INITIAL_CATEGORIES } from '@/data/products';
import { STORES as INITIAL_STORES } from '@/data/stores';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { storeService } from '@/services/storeService';
import { orderService } from '@/services/orderService';
import { settingsService } from '@/services/settingsService';
import { homeSettingsService } from '@/services/homeSettingsService';
import { bannerService } from '@/services/bannerService';

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

  // Banners & Campaigns CMS
  banners: Banner[];
  activeBanners: Banner[];
  addBanner: (banner: Partial<Banner>) => Promise<Banner>;
  updateBanner: (id: string, updates: Partial<Banner>) => Promise<Banner>;
  deleteBanner: (id: string) => Promise<void>;
  toggleBannerStatus: (id: string) => Promise<Banner>;
  reorderBanners: (ids: string[]) => Promise<void>;
  trackBannerImpression: (id: string) => void;
  trackBannerClick: (id: string) => void;

  // Stock Inventory Management
  decrementStock: (id: string, quantity?: number) => void;
  incrementStock: (id: string, quantity?: number) => void;

  // Import / Export
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

  // 5. React Query: Fetch Home Page & Banners Settings
  const { data: serverHomeSettings } = useQuery({
    queryKey: ['homeSettings'],
    queryFn: () => homeSettingsService.getHomeSettings().catch(() => DEFAULT_HOME_SETTINGS),
    placeholderData: DEFAULT_HOME_SETTINGS,
  });

  // 6. React Query: Fetch All Banners & Active Banners for Storefront
  const { data: serverAllBanners = [] } = useQuery({
    queryKey: ['banners', 'all'],
    queryFn: () => bannerService.getAllBanners().catch(() => []),
  });

  const { data: serverActiveBanners = [] } = useQuery({
    queryKey: ['banners', 'active'],
    queryFn: () => bannerService.getActiveBanners().catch(() => []),
  });

  // 7. React Query: Fetch Orders from Backend
  const { data: serverOrders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      try {
        return await orderService.getAll();
      } catch (err) {
        console.warn('Orders query failed (using local state fallback):', err);
        return [];
      }
    },
    staleTime: 1000 * 15,
  });

  // 8. Local & Server States with smart offline fallback
  const [localProducts, setLocalProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [localCategories, setLocalCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES_DATA);
  const [localStores, setLocalStores] = useState<StoreLocation[]>(INITIAL_STORES);
  const [coupons, setCoupons] = useState<Coupon[]>(DEFAULT_COUPONS);
  const [localOrders, setLocalOrders] = useState<Order[]>([]);
  const [localSettings, setLocalSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [localHomeSettings, setLocalHomeSettings] = useState<HomePageSettings>(() => {
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
  const orders = (serverOrders && serverOrders.length > 0) ? serverOrders : localOrders;
  const settings = serverSettings || localSettings;
  const homeSettings = serverHomeSettings || localHomeSettings;
  const banners = serverAllBanners;
  const activeBanners = serverActiveBanners;

  // Mutations
  const updateHomeSettingsMutation = useMutation({
    mutationFn: (newHomeSettings: HomePageSettings) => homeSettingsService.updateHomeSettings(newHomeSettings),
    onSuccess: (data) => {
      setLocalHomeSettings(data);
      queryClient.setQueryData(['homeSettings'], data);
      queryClient.invalidateQueries({ queryKey: ['homeSettings'] });
    },
    onError: (err) => {
      console.warn('Backend update failed, kept local copy:', err);
    }
  });

  const addBannerMutation = useMutation({
    mutationFn: (banner: Partial<Banner>) => bannerService.create(banner),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }),
  });

  const updateBannerMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Banner> }) => bannerService.update(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }),
  });

  const toggleBannerStatusMutation = useMutation({
    mutationFn: (id: string) => bannerService.toggleStatus(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }),
  });

  const reorderBannersMutation = useMutation({
    mutationFn: (ids: string[]) => bannerService.reorder(ids),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }),
  });

  const deleteBannerMutation = useMutation({
    mutationFn: (id: string) => bannerService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }),
  });

  const addBanner = async (banner: Partial<Banner>) => {
    return await addBannerMutation.mutateAsync(banner);
  };

  const updateBanner = async (id: string, updates: Partial<Banner>) => {
    return await updateBannerMutation.mutateAsync({ id, updates });
  };

  const deleteBanner = async (id: string) => {
    await deleteBannerMutation.mutateAsync(id);
  };

  const toggleBannerStatus = async (id: string) => {
    return await toggleBannerStatusMutation.mutateAsync(id);
  };

  const reorderBanners = async (ids: string[]) => {
    await reorderBannersMutation.mutateAsync(ids);
  };

  const trackBannerImpression = (id: string) => {
    bannerService.trackImpression(id);
  };

  const trackBannerClick = (id: string) => {
    bannerService.trackClick(id);
  };

  // Stock Inventory Management Handlers
  const decrementStock = (id: string, quantity: number = 1) => {
    queryClient.setQueryData<Product[]>(['products', 'all'], (old) => {
      if (!old) return old;
      return old.map(p => {
        if (p.id === id) {
          const current = p.stock !== undefined ? p.stock : 20;
          const updated = Math.max(0, current - quantity);
          return { ...p, stock: updated, inStock: updated > 0 };
        }
        return p;
      });
    });

    setLocalProducts(prev => prev.map(p => {
      if (p.id === id) {
        const current = p.stock !== undefined ? p.stock : 20;
        const updated = Math.max(0, current - quantity);
        return { ...p, stock: updated, inStock: updated > 0 };
      }
      return p;
    }));

    productService.adjustStock(id, -quantity).catch((err) => {
      console.warn('Backend stock decrement failed, fallback to local', err);
    });
  };

  const incrementStock = (id: string, quantity: number = 1) => {
    queryClient.setQueryData<Product[]>(['products', 'all'], (old) => {
      if (!old) return old;
      return old.map(p => {
        if (p.id === id) {
          const current = p.stock !== undefined ? p.stock : 20;
          const updated = current + quantity;
          return { ...p, stock: updated, inStock: updated > 0 };
        }
        return p;
      });
    });

    setLocalProducts(prev => prev.map(p => {
      if (p.id === id) {
        const current = p.stock !== undefined ? p.stock : 20;
        const updated = current + quantity;
        return { ...p, stock: updated, inStock: updated > 0 };
      }
      return p;
    }));

    productService.adjustStock(id, quantity).catch((err) => {
      console.warn('Backend stock increment failed, fallback to local', err);
    });
  };

  // Home Page Settings Update
  const updateHomeSettings = (updates: Partial<HomePageSettings>) => {
    const current = serverHomeSettings || localHomeSettings || DEFAULT_HOME_SETTINGS;
    const updated: HomePageSettings = {
      ...current,
      ...updates,
      hero: updates.hero ? { ...current.hero, ...updates.hero } : current.hero,
      promoEditorial: updates.promoEditorial ? { ...current.promoEditorial, ...updates.promoEditorial } : current.promoEditorial,
      shopTheLook: updates.shopTheLook ? { ...current.shopTheLook, ...updates.shopTheLook } : current.shopTheLook,
    };
    setLocalHomeSettings(updated);
    try {
      localStorage.setItem('eiffel_home_settings', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save home settings', err);
    }
    updateHomeSettingsMutation.mutate(updated);
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
      setLocalOrders(prev => [newOrder, ...prev.filter(o => o.id !== newOrder.id)]);
      queryClient.setQueryData(['orders'], (old: Order[] = []) => [newOrder, ...old.filter(o => o.id !== newOrder.id)]);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order['status'] }) =>
      orderService.updateStatus(id, status),
    onSuccess: (updated) => {
      setLocalOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
      queryClient.setQueryData(['orders'], (old: Order[] = []) => old.map(o => o.id === updated.id ? updated : o));
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
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
    setLocalOrders(prev => [order, ...prev]);
    createOrderMutation.mutate(order);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setLocalOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    updateOrderStatusMutation.mutate({ id: orderId, status });
  };

  const deleteOrder = (orderId: string) => {
    setLocalOrders(prev => prev.filter(o => o.id !== orderId));
    queryClient.setQueryData(['orders'], (old: Order[] = []) => old.filter(o => o.id !== orderId));
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
        banners,
        activeBanners,
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
        addBanner,
        updateBanner,
        deleteBanner,
        toggleBannerStatus,
        reorderBanners,
        trackBannerImpression,
        trackBannerClick,
        decrementStock,
        incrementStock,
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
