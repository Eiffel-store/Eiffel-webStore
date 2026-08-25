import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/stores/useAuthStore';

// Shared App Core Providers & Components
import {
  LanguageProvider,
  ThemeProvider,
  CurrencyProvider,
  StoreDataProvider,
  Navbar,
  Footer,
  ScrollToTop,
  FloatingContactButtons
} from './shared';

// Feature Modules
import {
  AdminAuthProvider,
  AdminProtectedRoute,
  AdminLayout,
  AdminLoginPage,
  AdminDashboardPage,
  AdminProductsPage,
  AdminProductFormPage,
  AdminHomePageEditor,
  AdminOffersPage,
  AdminCategoriesPage,
  AdminBranchesPage,
  AdminOrdersPage,
  AdminReportsPage,
  AdminCustomersPage,
  AdminSettingsPage
} from './features/admin';

import { HomePage } from './features/home';
import { CollectionsPage, ProductDetailPage } from './features/products';
import { CartProvider, CartDrawer, CartPage } from './features/cart';
import { CheckoutPage } from './features/checkout';
import { WishlistProvider, WishlistPage } from './features/wishlist';
import { AuthProvider, AccountPage } from './features/account';
import { StoreLocatorPage } from './features/stores';
import { HelpCenterPage } from './features/help';
import { SearchModal } from './features/search';

const queryClient = new QueryClient({
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

const StorefrontLayout: React.FC<{ onOpenSearch: () => void }> = ({ onOpenSearch }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface transition-colors duration-200">
      <Navbar onOpenSearch={onOpenSearch} />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <CartDrawer />
      <FloatingContactButtons />
    </div>
  );
};

export const App: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const { token, isAuthenticated, fetchProfile } = useAuthStore();

  useEffect(() => {
    const storedToken = localStorage.getItem('token') || localStorage.getItem('eiffel_auth_token');
    if (storedToken || token || isAuthenticated) {
      fetchProfile();
    }
  }, [token, isAuthenticated, fetchProfile]);

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
                      <Router basename={import.meta.env.BASE_URL}>
                        <ScrollToTop />
                        <Routes>
                          {/* Admin Routes */}
                          <Route path="/admin/login" element={<AdminLoginPage />} />
                          <Route
                            path="/admin"
                            element={
                              <AdminProtectedRoute>
                                <AdminLayout />
                              </AdminProtectedRoute>
                            }
                          >
                            <Route index element={<AdminDashboardPage />} />
                            <Route path="products" element={<AdminProductsPage />} />
                            <Route path="products/new" element={<AdminProductFormPage />} />
                            <Route path="products/edit/:id" element={<AdminProductFormPage />} />
                            <Route path="home" element={<AdminHomePageEditor />} />
                            <Route path="offers" element={<AdminOffersPage />} />
                            <Route path="categories" element={<AdminCategoriesPage />} />
                            <Route path="branches" element={<AdminBranchesPage />} />
                            <Route path="orders" element={<AdminOrdersPage />} />
                            <Route path="reports" element={<AdminReportsPage />} />
                            <Route path="customers" element={<AdminCustomersPage />} />
                            <Route path="settings" element={<AdminSettingsPage />} />
                          </Route>

                          {/* Customer Storefront Routes */}
                          <Route element={<StorefrontLayout onOpenSearch={() => setSearchOpen(true)} />}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/collections/:category" element={<CollectionsPage />} />
                            <Route path="/product/:id" element={<ProductDetailPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/wishlist" element={<WishlistPage />} />
                            <Route path="/account" element={<AccountPage />} />
                            <Route path="/stores" element={<StoreLocatorPage />} />
                            <Route path="/help" element={<HelpCenterPage />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                          </Route>
                        </Routes>

                        {/* Global Search Modal */}
                        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

                        {/* Luxury Hot Toast Notifications */}
                        <Toaster
                          position="top-center"
                          reverseOrder={false}
                          gutter={8}
                          toastOptions={{
                            duration: 3500,
                            style: {
                              background: '#09090b',
                              color: '#f4f4f5',
                              border: '1px solid rgba(251, 191, 36, 0.25)',
                              borderRadius: '0.75rem',
                              padding: '12px 18px',
                              fontSize: '0.8125rem',
                              fontFamily: 'inherit',
                              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.6)',
                            },
                            success: {
                              iconTheme: {
                                primary: '#fbbf24',
                                secondary: '#000000',
                              },
                            },
                            error: {
                              iconTheme: {
                                primary: '#ef4444',
                                secondary: '#ffffff',
                              },
                            },
                          }}
                        />
                      </Router>
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

export default App;
