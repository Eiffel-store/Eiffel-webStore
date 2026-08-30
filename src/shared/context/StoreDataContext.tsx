import React, { createContext, useContext } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  StoreDataContextType,
  DEFAULT_SETTINGS,
  DEFAULT_HOME_SETTINGS,
  STATIC_CATEGORIES,
  useProductsData,
  useCategoriesData,
  useStoresData,
  useCouponsData,
  useOrdersData,
  useSettingsData,
  useBannersData,
  useLooksData,
  useBackupData
} from './store';

// Re-export defaults and types for backward compatibility
export { DEFAULT_SETTINGS, DEFAULT_HOME_SETTINGS, STATIC_CATEGORIES };
export type { StoreDataContextType };

export const StoreDataContext = createContext<StoreDataContextType | undefined>(undefined);

export const StoreDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const isAdminOrStaff = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_STAFF';

  // Domain Hooks
  const {
    products,
    isProductsLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    decrementStock,
    incrementStock
  } = useProductsData(queryClient);

  const {
    categories,
    isCategoriesLoading,
    addCategory,
    updateCategory,
    deleteCategory
  } = useCategoriesData();

  const {
    stores,
    isStoresLoading,
    addStore,
    updateStore,
    deleteStore
  } = useStoresData(queryClient);

  const {
    coupons,
    isCouponsLoading,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon
  } = useCouponsData(queryClient);

  const {
    orders,
    isOrdersLoading,
    addOrder,
    updateOrderStatus,
    deleteOrder
  } = useOrdersData(queryClient, isAdminOrStaff);

  const {
    settings,
    homeSettings,
    isSettingsLoading,
    isHomeSettingsLoading,
    updateSettings,
    updateHomeSettings
  } = useSettingsData(queryClient);

  const {
    banners,
    activeBanners,
    isBannersLoading,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    reorderBanners,
    trackBannerImpression,
    trackBannerClick
  } = useBannersData(queryClient, isAdminOrStaff);

  const {
    looks,
    activeLooks,
    isLooksLoading,
    addLook,
    updateLook,
    deleteLook,
    toggleLookStatus,
    reorderLooks
  } = useLooksData(queryClient, isAdminOrStaff);

  const { exportData, importData, resetAllToDefault } = useBackupData({
    products,
    categories,
    stores,
    coupons,
    orders,
    settings,
    homeSettings,
    updateSettings,
    updateHomeSettings,
    queryClient
  });

  const isLoading =
    isProductsLoading ||
    isCategoriesLoading ||
    isStoresLoading ||
    isOrdersLoading ||
    isBannersLoading ||
    isCouponsLoading ||
    isSettingsLoading ||
    isLooksLoading;

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
        looks,
        activeLooks,
        isLoading,
        isProductsLoading,
        isCategoriesLoading,
        isStoresLoading,
        isOrdersLoading,
        isCouponsLoading,
        isBannersLoading,
        isLooksLoading,
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
        addLook,
        updateLook,
        deleteLook,
        toggleLookStatus,
        reorderLooks,
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
