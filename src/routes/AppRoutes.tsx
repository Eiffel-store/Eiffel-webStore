import React, { Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AdminProtectedRoute } from '@/features/admin/components/AdminProtectedRoute';
import { HomePage } from '@/features/home';
import {
  Navbar,
  Footer,
  FloatingContactButtons
} from '@/shared';

import {
  // Admin Lazy Components
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
  AdminExchangesPage,
  AdminReviewsPage,
  AdminReportsPage,
  AdminCustomersPage,
  AdminSettingsPage,

  // Storefront Lazy Pages
  CollectionsPage,
  ProductDetailPage,
  CartPage,
  CheckoutPage,
  WishlistPage,
  AccountPage,
  StoreLocatorPage,
  HelpCenterPage,

  // Drawers
  CartDrawer
} from './lazyComponents';

export const StorefrontLayout: React.FC<{ onOpenSearch: () => void }> = ({ onOpenSearch }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface transition-colors duration-200">
      <Navbar onOpenSearch={onOpenSearch} />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Suspense fallback={null}>
        <CartDrawer />
      </Suspense>
      <FloatingContactButtons />
    </div>
  );
};

interface AppRoutesProps {
  onOpenSearch: () => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({ onOpenSearch }) => {
  return (
    <Suspense fallback={null}>
      <Routes>
        {/* ========================================== */}
        {/* 1. ADMIN ROUTES (PROTECTED)                */}
        {/* ========================================== */}
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
          <Route path="exchanges" element={<AdminExchangesPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* ========================================== */}
        {/* 2. CUSTOMER STOREFRONT ROUTES              */}
        {/* ========================================== */}
        <Route element={<StorefrontLayout onOpenSearch={onOpenSearch} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections/:category" element={<CollectionsPage />} />
          <Route path="/offers" element={<Navigate to="/collections/offers" replace />} />
          <Route path="/sale" element={<Navigate to="/collections/offers" replace />} />
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
    </Suspense>
  );
};

export default AppRoutes;
