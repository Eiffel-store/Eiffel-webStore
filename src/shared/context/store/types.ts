import {
  Product,
  StoreLocation,
  CategoryItem,
  Coupon,
  Order,
  StoreSettings,
  HomePageSettings,
  Banner,
  Look
} from '@/types';

export interface StoreDataContextType {
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

  // Products CRUD & Stock
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  decrementStock: (id: string, quantity?: number) => void;
  incrementStock: (id: string, quantity?: number) => void;

  // Categories CRUD
  addCategory: (category: Omit<CategoryItem, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => void;

  // Stores CRUD
  addStore: (store: Omit<StoreLocation, 'id'>) => void;
  updateStore: (id: string, updates: Partial<StoreLocation>) => void;
  deleteStore: (id: string) => void;

  // Coupons CRUD & Validation
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  validateCoupon: (code: string, subtotal: number) => Coupon | null;

  // Orders CRUD
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;

  // Settings
  updateSettings: (updates: Partial<StoreSettings>, options?: { successMessage?: string; toastId?: string; showToast?: boolean }) => Promise<StoreSettings | void>;
  updateHomeSettings: (updates: Partial<HomePageSettings>, options?: { successMessage?: string; toastId?: string; showToast?: boolean }) => Promise<StoreSettings | void>;

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

  // Looks / Lookbook Management
  looks: Look[];
  activeLooks: Look[];
  isLooksLoading: boolean;
  addLook: (look: Partial<Look>) => Promise<Look>;
  updateLook: (id: string, updates: Partial<Look>) => Promise<Look>;
  deleteLook: (id: string) => Promise<void>;
  toggleLookStatus: (id: string) => Promise<Look>;
  reorderLooks: (ids: string[]) => Promise<void>;

  // Import / Export & Backup
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  resetAllToDefault: () => void;
}
