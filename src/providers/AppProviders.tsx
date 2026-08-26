import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Core App Providers
import {
  LanguageProvider,
  ThemeProvider,
  CurrencyProvider,
  StoreDataProvider
} from '@/shared';

// Feature Providers
import { AdminAuthProvider } from '@/features/admin/context/AdminAuthContext';
import { AuthProvider } from '@/features/account/context/AuthContext';
import { CartProvider } from '@/features/cart/context/CartContext';
import { WishlistProvider } from '@/features/wishlist/context/WishlistContext';

// Centralized QueryClient Configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 5, // 5 minutes default fresh cache
      gcTime: 1000 * 60 * 30, // 30 minutes in-memory garbage collection
      retry: 1,
    },
  },
});

/**
 * Higher-Order Provider Composition Utility
 * Flattens the "Provider Pyramid / Hell" into an elegant, linear pipeline.
 */
type ProviderComponent = React.ComponentType<{ children: React.ReactNode }>;

export const composeProviders = (
  ...providers: (ProviderComponent | [ProviderComponent, Record<string, any>])[]
): React.FC<{ children: React.ReactNode }> => {
  return ({ children }) => {
    return providers.reduceRight<React.ReactNode>((acc, item) => {
      if (Array.isArray(item)) {
        const [Provider, props] = item;
        return <Provider {...props}>{acc}</Provider>;
      }
      const Provider = item;
      return <Provider>{acc}</Provider>;
    }, children) as React.ReactElement;
  };
};

/**
 * Ordered Application Context Stack:
 * 1. QueryClientProvider  (Foundation for all network queries & server state)
 * 2. LanguageProvider     (i18n - English / Arabic RTL engine)
 * 3. ThemeProvider        (Dark / Light luxury aesthetics)
 * 4. CurrencyProvider     (EGP / USD / SAR conversions & formatting)
 * 5. StoreDataProvider    (Catalogs, categories, banners, settings)
 * 6. AuthProvider         (Customer sessions, VIP loyalty tiers)
 * 7. WishlistProvider     (Saved customer favorites)
 * 8. CartProvider         (Shopping bag state & checkout calculation)
 * 9. AdminAuthProvider    (Admin control panel authentication)
 */
export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider>
          <CurrencyProvider>
            <StoreDataProvider>
              <AuthProvider>
                <WishlistProvider>
                  <CartProvider>
                    <AdminAuthProvider>
                      {children}
                    </AdminAuthProvider>
                  </CartProvider>
                </WishlistProvider>
              </AuthProvider>
            </StoreDataProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
