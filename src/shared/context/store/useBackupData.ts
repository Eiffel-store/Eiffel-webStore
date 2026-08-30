import { QueryClient } from '@tanstack/react-query';
import {
  Product,
  CategoryItem,
  StoreLocation,
  Coupon,
  Order,
  StoreSettings,
  HomePageSettings
} from '@/types';

interface BackupDataParams {
  products: Product[];
  categories: CategoryItem[];
  stores: StoreLocation[];
  coupons: Coupon[];
  orders: Order[];
  settings: StoreSettings;
  homeSettings: HomePageSettings;
  updateSettings: (updates: Partial<StoreSettings>) => void;
  updateHomeSettings: (updates: Partial<HomePageSettings>) => void;
  queryClient: QueryClient;
}

export const useBackupData = ({
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
}: BackupDataParams) => {
  const exportData = (): string => {
    return JSON.stringify(
      { products, categories, stores, coupons, orders, settings, homeSettings },
      null,
      2
    );
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
    localStorage.removeItem('eiffel_categories');
    queryClient.invalidateQueries();
  };

  return {
    exportData,
    importData,
    resetAllToDefault
  };
};
