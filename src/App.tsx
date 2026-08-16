import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { StoreDataProvider } from './context/StoreDataContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { SearchModal } from './components/search/SearchModal';
import { ScrollToTop } from './components/common/ScrollToTop';
import { FloatingContactButtons } from './components/common/FloatingContactButtons';

import { HomePage } from './pages/HomePage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { WishlistPage } from './pages/WishlistPage';
import { AccountPage } from './pages/AccountPage';
import { StoreLocatorPage } from './pages/StoreLocatorPage';
import { HelpCenterPage } from './pages/HelpCenterPage';

// Admin Imports
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage';
import { AdminOffersPage } from './pages/admin/AdminOffersPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminBranchesPage } from './pages/admin/AdminBranchesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

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
