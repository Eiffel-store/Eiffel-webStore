import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

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
  AdminOffersPage,
  AdminCategoriesPage,
  AdminBranchesPage,
  AdminOrdersPage,
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

  return (
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
                          <Route path="offers" element={<AdminOffersPage />} />
                          <Route path="categories" element={<AdminCategoriesPage />} />
                          <Route path="branches" element={<AdminBranchesPage />} />
                          <Route path="orders" element={<AdminOrdersPage />} />
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
                    </Router>
                  </AdminAuthProvider>
                </CartProvider>
              </WishlistProvider>
            </AuthProvider>
          </StoreDataProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
