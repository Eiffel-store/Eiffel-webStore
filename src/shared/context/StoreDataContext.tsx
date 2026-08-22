import React, { createContext, useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, StoreLocation, CategoryItem, Coupon, Order, StoreSettings, HomePageSettings, Banner } from '@/types';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { storeService } from '@/services/storeService';
import { orderService } from '@/services/orderService';
import { couponService } from '@/services/couponService';
import { settingsService } from '@/services/settingsService';
import { homeSettingsService } from '@/services/homeSettingsService';
import { bannerService } from '@/services/bannerService';
import { useAuthStore } from '@/stores/useAuthStore';
import toast from 'react-hot-toast';

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'EIFFEL',
  tagline: '',
  phone: '',
  whatsappNumber: '',
  facebookUrl: '',
  instagramUrl: '',
  announcementTextAr: '',
  announcementTextEn: '',
  currency: 'EGP',
  freeShippingThreshold: 1500,
  adminPin: '',
  vipRequiredOrders: 3,
  vipRequiredPoints: 500,
  vipDiscountPercentage: 10,
  loyaltyCashbackRate: 0.05,
  vipFreeShipping: true
};

export const DEFAULT_HOME_SETTINGS: HomePageSettings = {
  hero: {
    tagEn: '',
    tagAr: '',
    titleEn: '',
    titleAr: '',
    subtitleEn: '',
    subtitleAr: '',
    buttonTextEn: '',
    buttonTextAr: '',
    buttonLink: '/collections/men',
    secondaryButtonTextEn: '',
    secondaryButtonTextAr: '',
    secondaryButtonLink: '/collections/new-arrivals',
    imageUrl: ''
  },
  promoEditorial: {
    badgeEn: '',
    badgeAr: '',
    titleEn: '',
    titleAr: '',
    descriptionEn: '',
    descriptionAr: '',
    buttonTextEn: '',
    buttonTextAr: '',
    buttonLink: '/collections/offers',
    discountBadgeEn: '',
    discountBadgeAr: '',
    imageUrl: ''
  },
  shopTheLook: {
    titleEn: '',
    titleAr: '',
    subtitleEn: '',
    subtitleAr: '',
    imageUrl: '',
    collectionLink: '/collections/men',
    hotspots: []
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
  isProductsLoading: boolean;
  isCategoriesLoading: boolean;
  isStoresLoading: boolean;
  isOrdersLoading: boolean;
  isCouponsLoading: boolean;
  isBannersLoading: boolean;
  isHomeSettingsLoading: boolean;

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
  const { user } = useAuthStore();
  const isAdminOrStaff = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_STAFF';

  // 1. React Query: Fetch Products from Backend
  const { data: serverProducts = [], isLoading: isProductsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll().catch(() => []),
    staleTime: 1000 * 30,
    retry: 1
  });

  // 2. React Query: Fetch Categories from Backend
  const { data: serverCategories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll().catch(() => []),
    staleTime: 1000 * 30,
    retry: 1
  });

  // 3. React Query: Fetch Settings from Backend
  const { data: serverSettings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.getSettings().catch(() => DEFAULT_SETTINGS),
    staleTime: 1000 * 60,
    retry: 1
  });

  // 4. React Query: Fetch Stores from Backend
  const { data: serverStores = [], isLoading: isStoresLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: () => storeService.getAll().catch(() => []),
    staleTime: 1000 * 60,
    retry: 1
  });

  // 5. React Query: Fetch Coupons from Backend
  const { data: serverCoupons = [], isLoading: isCouponsLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: () => couponService.getAll().catch(() => []),
    staleTime: 1000 * 30,
    retry: 1
  });

  // 6. React Query: Fetch Home Page & Banners Settings
  const { data: serverHomeSettings, isLoading: isHomeSettingsLoading } = useQuery({
    queryKey: ['homeSettings'],
    queryFn: () => homeSettingsService.getHomeSettings().catch(() => DEFAULT_HOME_SETTINGS),
    staleTime: 1000 * 60,
    retry: 1
  });

  // 7. React Query: Fetch All Banners & Active Banners for Storefront
  const { data: serverAllBanners = [], isLoading: isAllBannersLoading } = useQuery({
    queryKey: ['banners', 'all'],
    queryFn: () => bannerService.getAllBanners().catch(() => []),
    staleTime: 1000 * 30,
    enabled: isAdminOrStaff,
    retry: 1
  });

  const { data: serverActiveBanners = [], isLoading: isActiveBannersLoading } = useQuery({
    queryKey: ['banners', 'active'],
    queryFn: () => bannerService.getActiveBanners().catch(() => []),
    staleTime: 1000 * 30,
    retry: 1
  });

  const isBannersLoading = isActiveBannersLoading || (isAdminOrStaff && isAllBannersLoading);

  // 8. React Query: Fetch Orders from Backend (Admin & Staff only)
  const { data: serverOrders = [], isLoading: isOrdersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getAll().catch(() => []),
    staleTime: 1000 * 15,
    enabled: isAdminOrStaff,
    retry: 1
  });

  // State
  const [localHomeSettings, setLocalHomeSettings] = useState<HomePageSettings>(() => {
    try {
      const saved = localStorage.getItem('eiffel_home_settings');
      return saved ? { ...DEFAULT_HOME_SETTINGS, ...JSON.parse(saved) } : DEFAULT_HOME_SETTINGS;
    } catch {
      return DEFAULT_HOME_SETTINGS;
    }
  });

  const products = Array.isArray(serverProducts) ? serverProducts : [];
  const categories = Array.isArray(serverCategories) ? serverCategories : [];
  const stores = Array.isArray(serverStores) ? serverStores : [];
  const coupons = Array.isArray(serverCoupons) ? serverCoupons : [];
  const orders = Array.isArray(serverOrders) ? serverOrders : [];
  const settings = serverSettings || DEFAULT_SETTINGS;
  const homeSettings = serverHomeSettings || localHomeSettings;
  const banners = Array.isArray(serverAllBanners) && serverAllBanners.length > 0 ? serverAllBanners : (Array.isArray(serverActiveBanners) ? serverActiveBanners : []);
  const activeBanners = Array.isArray(serverActiveBanners) ? serverActiveBanners : [];

  const isLoading = isProductsLoading || isCategoriesLoading || isStoresLoading || isOrdersLoading || isBannersLoading || isCouponsLoading || isSettingsLoading;

  // Mutations: Home Settings
  const updateHomeSettingsMutation = useMutation({
    mutationFn: (newHomeSettings: HomePageSettings) => homeSettingsService.updateHomeSettings(newHomeSettings),
    onSuccess: (data) => {
      setLocalHomeSettings(data);
      queryClient.setQueryData(['homeSettings'], data);
      queryClient.invalidateQueries({ queryKey: ['homeSettings'] });
    },
    onError: (err) => {
      console.warn('Backend update failed:', err);
    }
  });

  // Mutations: Banners
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
    queryClient.setQueryData<Product[]>(['products'], (old: Product[] | undefined) => {
      if (!old) return [];
      return old.map((p: Product) => {
        if (p.id === id) {
          const current = p.stock !== undefined ? p.stock : 0;
          const updated = Math.max(0, current - quantity);
          return { ...p, stock: updated, inStock: updated > 0 };
        }
        return p;
      });
    });

    productService.adjustStock(id, -quantity).catch((err) => {
      console.warn('Backend stock decrement failed', err);
    });
  };

  const incrementStock = (id: string, quantity: number = 1) => {
    queryClient.setQueryData<Product[]>(['products'], (old: Product[] | undefined) => {
      if (!old) return [];
      return old.map((p: Product) => {
        if (p.id === id) {
          const current = p.stock !== undefined ? p.stock : 0;
          const updated = current + quantity;
          return { ...p, stock: updated, inStock: updated > 0 };
        }
        return p;
      });
    });

    productService.adjustStock(id, quantity).catch((err) => {
      console.warn('Backend stock increment failed', err);
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

  // Mutations: Products
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

  // Mutations: Settings
  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: Partial<StoreSettings>) => settingsService.updateSettings(newSettings),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  });

  // Mutations: Orders
  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order['status'] }) =>
      orderService.updateStatus(id, status),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData<Order[]>(['orders'], (old = []) =>
        (old || []).map(o => o.id === updatedOrder.id ? updatedOrder : o)
      );
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', 'my-orders'] });
    },
  });

  // Mutations: Stores
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

  // Mutations: Categories
  const createCategoryMutation = useMutation({
    mutationFn: (cat: Partial<CategoryItem>) => categoryService.create(cat),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('تمت إضافة القسم بنجاح');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'فشل إضافة القسم');
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CategoryItem> }) =>
      categoryService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('تم تحديث القسم بنجاح');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'فشل تحديث القسم');
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] });
      const prevCategories = queryClient.getQueryData<CategoryItem[]>(['categories']);
      if (prevCategories) {
        queryClient.setQueryData<CategoryItem[]>(['categories'], prevCategories.filter(c => c.id !== id));
      }
      return { prevCategories };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('تم حذف القسم نهائياً من قاعدة البيانات');
    },
    onError: (err: any, _id, context) => {
      if (context?.prevCategories) {
        queryClient.setQueryData(['categories'], context.prevCategories);
      }
      toast.error(err?.message || 'فشل حذف القسم');
    }
  });

  // Mutations: Coupons
  const createCouponMutation = useMutation({
    mutationFn: (coupon: Partial<Coupon>) => couponService.create(coupon),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coupons'] }),
  });

  const updateCouponMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Coupon> }) =>
      couponService.update(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coupons'] }),
  });

  const deleteCouponMutation = useMutation({
    mutationFn: (id: string) => couponService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coupons'] }),
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
    createCategoryMutation.mutate(newCat);
  };

  const updateCategory = (id: string, updates: Partial<CategoryItem>) => {
    updateCategoryMutation.mutate({ id, updates });
  };

  const deleteCategory = (id: string) => {
    deleteCategoryMutation.mutate(id);
  };

  // Store Methods
  const addStore = (s: Omit<StoreLocation, 'id'>) => {
    const id = `store-${Date.now()}`;
    const newStore: StoreLocation = { ...s, id };
    createStoreMutation.mutate(newStore);
  };

  const updateStore = (id: string, updates: Partial<StoreLocation>) => {
    updateStoreMutation.mutate({ id, updates });
  };

  const deleteStore = (id: string) => {
    deleteStoreMutation.mutate(id);
  };

  // Coupon Methods
  const addCoupon = (c: Omit<Coupon, 'id'>) => {
    createCouponMutation.mutate(c);
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    updateCouponMutation.mutate({ id, updates });
  };

  const deleteCoupon = (id: string) => {
    deleteCouponMutation.mutate(id);
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
    queryClient.setQueryData<Order[]>(['orders'], (old = []) => [order, ...(old || []).filter(o => o.id !== order.id)]);
    queryClient.invalidateQueries({ queryKey: ['orders'] });
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    updateOrderStatusMutation.mutate({ id: orderId, status });
  };

  const deleteOrder = (orderId: string) => {
    updateOrderStatusMutation.mutate({ id: orderId, status: 'Cancelled' });
    queryClient.setQueryData<Order[]>(['orders'], (old: Order[] | undefined) => (old || []).filter((o: Order) => o.id !== orderId));
  };

  // Settings
  const updateSettings = (updates: Partial<StoreSettings>) => {
    updateSettingsMutation.mutate(updates);
  };

  const exportData = (): string => {
    return JSON.stringify({ products, categories, stores, coupons, orders, settings, homeSettings }, null, 2);
  };

  const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.homeSettings) {
        updateHomeSettings(data.homeSettings);
      }
      if (data.settings) {
        updateSettings(data.settings);
      }
      queryClient.invalidateQueries();
      return true;
    } catch {
      return false;
    }
  };

  const resetAllToDefault = () => {
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
        isLoading,
        isProductsLoading,
        isCategoriesLoading,
        isStoresLoading,
        isOrdersLoading,
        isCouponsLoading,
        isBannersLoading,
        isHomeSettingsLoading,
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
