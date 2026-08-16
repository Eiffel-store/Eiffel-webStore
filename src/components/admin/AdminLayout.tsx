import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  Grid,
  MapPin,
  Package,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sun,
  Moon,
  Plus,
  Bell,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useStoreData } from '../../context/StoreDataContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export const AdminLayout: React.FC = () => {
  const { logoutAdmin } = useAdminAuth();
  const { orders, products } = useStoreData();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, isRTL } = useLanguage();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const pendingOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;

  const navItems = [
    { label: isRTL ? 'لوحة المعلومات' : 'Dashboard', href: '/admin', icon: LayoutDashboard, end: true },
    { label: isRTL ? 'إدارة المنتجات' : 'Products', href: '/admin/products', icon: ShoppingBag, badge: products.length },
    { label: isRTL ? 'العروض والكوبونات' : 'Offers & Coupons', href: '/admin/offers', icon: Tag },
    { label: isRTL ? 'الأقسام والتصنيفات' : 'Categories', href: '/admin/categories', icon: Grid },
    { label: isRTL ? 'إدارة الفروع' : 'Branches & Stores', href: '/admin/branches', icon: MapPin },
    { label: isRTL ? 'الطلبات والمبيعات' : 'Orders', href: '/admin/orders', icon: Package, badge: pendingOrdersCount ? `${pendingOrdersCount}` : undefined, badgeColor: 'bg-amber-500' },
    { label: isRTL ? 'إعدادات المتجر' : 'Store Settings', href: '/admin/settings', icon: Settings }
  ];

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <div className={`min-h-screen bg-[#0F0F10] text-zinc-100 flex flex-col md:flex-row ${isRTL ? 'font-arabic' : 'font-sans'}`}>
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-800 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 text-zinc-300 hover:text-white rounded-md bg-zinc-900 border border-zinc-800"
            aria-label="Toggle menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-1.5">
            <span className="font-editorial text-xl font-bold tracking-widest text-white">EIFFEL</span>
            <span className="text-[9px] font-mono uppercase bg-white text-black px-1.5 py-0.5 font-bold tracking-wider">ADMIN</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/products/new"
            className="p-1.5 bg-white text-black text-xs font-bold flex items-center gap-1 hover:bg-zinc-200"
          >
            <Plus className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-zinc-400 hover:text-white rounded-md bg-zinc-900 border border-zinc-800"
            title={isRTL ? 'معاينة المتجر' : 'View Storefront'}
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Sidebar Overlay for Mobile */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50 w-72 bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : isRTL ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2">
              <span className="font-editorial text-2xl font-bold tracking-widest text-white">EIFFEL</span>
              <span className="text-[10px] font-mono uppercase bg-white text-black px-2 py-0.5 font-bold tracking-wider">
                CONTROL
              </span>
            </Link>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          {/* Quick Action Button */}
          <div className="px-4 py-4">
            <Link
              to="/admin/products/new"
              onClick={() => setMobileSidebarOpen(false)}
              className="w-full py-2.5 px-4 bg-white text-black hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 font-label-bold text-xs uppercase tracking-wider shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>{isRTL ? 'إضافة منتج جديد' : 'Add New Product'}</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.end}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded text-xs uppercase tracking-wider transition-all font-medium ${
                      isActive
                        ? 'bg-zinc-800 text-white font-bold border-l-2 rtl:border-l-0 rtl:border-r-2 border-white'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0 text-zinc-400 group-hover:text-white" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        item.badgeColor ? `${item.badgeColor} text-black` : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-800/80 space-y-3">
          {/* Storefront Link */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isRTL ? 'معاينة المتجر المباشر' : 'Live Storefront'}</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500">↗</span>
          </Link>

          {/* Admin User Info & Logout */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-left rtl:text-right">
                <div className="text-xs font-bold text-white">Store Admin</div>
                <div className="text-[10px] text-zinc-500 font-mono">Master Mode</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-950/20 rounded transition-colors"
              title={isRTL ? 'تسجيل الخروج' : 'Logout'}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0c0c0d]">
        {/* Desktop Top Navbar */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 bg-zinc-950 border-b border-zinc-800/80 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-label-bold uppercase tracking-widest text-zinc-300">
              {location.pathname === '/admin' && (isRTL ? 'لوحة التحكم الرئيسية' : 'Dashboard Overview')}
              {location.pathname === '/admin/products' && (isRTL ? 'كتالوج وإدارة المنتجات' : 'Products Catalog')}
              {location.pathname === '/admin/products/new' && (isRTL ? 'إضافة منتج جديد' : 'New Product Entry')}
              {location.pathname.startsWith('/admin/products/edit') && (isRTL ? 'تعديل بيانات المنتج' : 'Edit Product Details')}
              {location.pathname === '/admin/offers' && (isRTL ? 'العروض والتخفيضات والكوبونات' : 'Offers & Promo Codes')}
              {location.pathname === '/admin/categories' && (isRTL ? 'إدارة الأقسام والتصنيفات' : 'Categories Management')}
              {location.pathname === '/admin/branches' && (isRTL ? 'إدارة مواقع الفروع' : 'Branch Locations')}
              {location.pathname === '/admin/orders' && (isRTL ? 'سجل وإدارة طلبات العملاء' : 'Orders Management')}
              {location.pathname === '/admin/settings' && (isRTL ? 'إعدادات المتجر والنسخ الاحتياطي' : 'Store Settings & Backup')}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="px-2.5 py-1 text-xs font-mono bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 rounded transition-colors"
            >
              {language === 'ar' ? 'English' : 'عربي'}
            </button>

            {/* View Storefront */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 rounded flex items-center gap-1.5 transition-colors"
            >
              <span>{isRTL ? 'المتجر' : 'Storefront'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Dynamic Page Outlet */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
