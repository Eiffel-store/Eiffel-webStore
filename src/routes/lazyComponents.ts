import { lazy } from 'react';

// ==========================================
// 1. ADMIN LAZY-LOADED COMPONENTS & PAGES
// ==========================================
export const AdminLayout = lazy(() =>
  import('@/features/admin/components/AdminLayout').then(m => ({ default: m.AdminLayout }))
);

export const AdminLoginPage = lazy(() =>
  import('@/features/admin/pages/AdminLoginPage').then(m => ({ default: m.AdminLoginPage }))
);

export const AdminDashboardPage = lazy(() =>
  import('@/features/admin/pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage }))
);

export const AdminProductsPage = lazy(() =>
  import('@/features/admin/pages/AdminProductsPage').then(m => ({ default: m.AdminProductsPage }))
);

export const AdminProductFormPage = lazy(() =>
  import('@/features/admin/pages/AdminProductFormPage').then(m => ({ default: m.AdminProductFormPage }))
);

export const AdminHomePageEditor = lazy(() =>
  import('@/features/admin/pages/AdminHomePageEditor').then(m => ({ default: m.AdminHomePageEditor }))
);

export const AdminOffersPage = lazy(() =>
  import('@/features/admin/pages/AdminOffersPage').then(m => ({ default: m.AdminOffersPage }))
);

export const AdminCategoriesPage = lazy(() =>
  import('@/features/admin/pages/AdminCategoriesPage').then(m => ({ default: m.AdminCategoriesPage }))
);

export const AdminBranchesPage = lazy(() =>
  import('@/features/admin/pages/AdminBranchesPage').then(m => ({ default: m.AdminBranchesPage }))
);

export const AdminOrdersPage = lazy(() =>
  import('@/features/admin/pages/AdminOrdersPage').then(m => ({ default: m.AdminOrdersPage }))
);

export const AdminReportsPage = lazy(() =>
  import('@/features/admin/pages/AdminReportsPage').then(m => ({ default: m.AdminReportsPage }))
);

export const AdminCustomersPage = lazy(() =>
  import('@/features/admin/pages/AdminCustomersPage').then(m => ({ default: m.AdminCustomersPage }))
);

export const AdminSettingsPage = lazy(() =>
  import('@/features/admin/pages/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage }))
);

// ==========================================
// 2. STOREFRONT LAZY-LOADED PAGES
// ==========================================
export const CollectionsPage = lazy(() =>
  import('@/features/products/pages/CollectionsPage').then(m => ({ default: m.CollectionsPage }))
);

export const ProductDetailPage = lazy(() =>
  import('@/features/products/pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage }))
);

export const CartPage = lazy(() =>
  import('@/features/cart/pages/CartPage').then(m => ({ default: m.CartPage }))
);

export const CheckoutPage = lazy(() =>
  import('@/features/checkout/pages/CheckoutPage').then(m => ({ default: m.CheckoutPage }))
);

export const WishlistPage = lazy(() =>
  import('@/features/wishlist/pages/WishlistPage').then(m => ({ default: m.WishlistPage }))
);

export const AccountPage = lazy(() =>
  import('@/features/account/pages/AccountPage').then(m => ({ default: m.AccountPage }))
);

export const StoreLocatorPage = lazy(() =>
  import('@/features/stores/pages/StoreLocatorPage').then(m => ({ default: m.StoreLocatorPage }))
);

export const HelpCenterPage = lazy(() =>
  import('@/features/help/pages/HelpCenterPage').then(m => ({ default: m.HelpCenterPage }))
);

// ==========================================
// 3. GLOBAL MODALS & DRAWERS
// ==========================================
export const CartDrawer = lazy(() =>
  import('@/features/cart/components/CartDrawer').then(m => ({ default: m.CartDrawer }))
);

export const SearchModal = lazy(() =>
  import('@/features/search/components/SearchModal').then(m => ({ default: m.SearchModal }))
);
