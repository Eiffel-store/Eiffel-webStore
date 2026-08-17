import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  Languages,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { useCart } from '@/features/cart';
import { useWishlist } from '@/features/wishlist';
import { useTheme } from '@/shared';
import { useLanguage } from '@/shared';
import { useAuthStore } from '@/stores/useAuthStore';
import { Logo } from './Logo';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { totalItems, openCart } = useCart();
  const { totalWishlist } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { user, isAuthenticated, role, logout } = useAuthStore();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: t.navMen, href: '/collections/men' },
    { label: t.navKids, href: '/collections/kids' },
    { label: t.navAccessories, href: '/collections/accessories' },
    { label: t.navCollection04, href: '/collections/offers' },
    { label: t.navStores, href: '/stores' }
  ];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-primary text-white dark:bg-zinc-950 dark:text-zinc-200 text-[10px] sm:text-[11px] py-1.5 px-3 sm:px-4 font-label-bold tracking-wider sm:tracking-widest text-center border-b border-black/10 flex items-center justify-between">
        <div className="hidden md:block w-44 text-left rtl:text-right text-zinc-400 font-mono text-[10px]">
          {t.topBannerLocations}
        </div>
        <div className="flex-1 text-center truncate">
          {t.topBannerPromo} <strong>EIFFEL10</strong>
        </div>
        <div className="hidden md:flex w-44 justify-end items-center gap-3 text-[10px] text-zinc-300">
          {(role === 'ROLE_ADMIN' || role === 'ROLE_STAFF') && (
            <Link to="/admin" className="text-amber-400 hover:underline flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3 h-3" />
              <span>{t.adminPanel}</span>
            </Link>
          )}
          <Link to="/help" className="hover:underline">{t.help}</Link>
          <span>•</span>
          <Link to="/stores" className="hover:underline">{t.atelier}</Link>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-surface-container dark:border-zinc-850 transition-all duration-200 ${
          isScrolled ? 'h-[64px] sm:h-[70px] shadow-sm' : 'h-[68px] sm:h-[80px]'
        }`}
      >
        <div className="max-w-[1440px] mx-auto h-full px-3 sm:px-8 md:px-12 flex items-center justify-between">
          {/* Left / Start: Mobile Menu Trigger & Main Links */}
          <div className="flex items-center gap-3 sm:gap-8">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 -ml-1.5 rtl:-ml-0 rtl:-mr-1.5 text-primary dark:text-white hover:opacity-70 transition-opacity"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Brand Logo */}
            <Link
              to="/"
              className="hover:opacity-90 transition-opacity flex items-center py-1"
            >
              <Logo size="md" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`font-label-bold text-xs tracking-widest uppercase transition-all duration-200 py-1 ${
                      isActive
                        ? 'text-primary dark:text-white border-b-2 border-primary dark:border-white'
                        : 'text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right / End Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 text-[11px] sm:text-xs font-label-bold text-primary dark:text-white py-1 px-2 border border-surface-container dark:border-zinc-800 hover:border-primary dark:hover:border-white transition-colors uppercase"
                title="Switch Language / تغيير اللغة"
              >
                <Languages className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{language === 'en' ? 'EN' : 'العربية'}</span>
                <ChevronDown className="w-2.5 h-2.5 text-secondary" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-32 bg-white dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 shadow-xl py-1 z-50 animate-fade-in">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left rtl:text-right px-3 py-2 text-xs font-mono flex items-center justify-between transition-colors ${
                      language === 'en'
                        ? 'bg-surface-container-low dark:bg-zinc-800 text-primary dark:text-white font-bold'
                        : 'text-secondary dark:text-zinc-400 hover:bg-surface-container-low dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span>English</span>
                    <span className="text-[10px] text-secondary">EN</span>
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('ar');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left rtl:text-right px-3 py-2 text-xs font-mono flex items-center justify-between transition-colors ${
                      language === 'ar'
                        ? 'bg-surface-container-low dark:bg-zinc-800 text-primary dark:text-white font-bold'
                        : 'text-secondary dark:text-zinc-400 hover:bg-surface-container-low dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span>العربية</span>
                    <span className="text-[10px] text-secondary">AR</span>
                  </button>
                </div>
              )}
            </div>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-1.5 sm:p-2 text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-1.5 sm:p-2 text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {totalWishlist > 0 && (
                <span className="absolute top-0.5 right-0.5 rtl:right-auto rtl:left-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-primary dark:bg-white text-white dark:text-black font-mono text-[8px] sm:text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalWishlist}
                </span>
              )}
            </Link>

            {/* Account Link (Desktop) with Name or User Icon */}
            <Link
              to="/account"
              className="hidden sm:flex items-center gap-1.5 p-2 text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors"
              aria-label="Account"
            >
              <div className="relative">
                <User className="w-4 h-4" />
                {isAuthenticated && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-zinc-950" />
                )}
              </div>
              {isAuthenticated && user && (
                <span className="text-xs font-label-bold tracking-wider max-w-[80px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-primary text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors px-2.5 sm:px-3 py-1.5 sm:py-2 font-label-bold text-xs tracking-wider"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline font-mono">({totalItems})</span>
              {totalItems > 0 && (
                <span className="sm:hidden absolute -top-1 -right-1 rtl:-right-auto rtl:-left-1 w-4 h-4 bg-error text-white font-mono text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 rtl:left-auto rtl:right-0 w-4/5 max-w-sm bg-white dark:bg-zinc-950 p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-surface-container dark:border-zinc-800">
                <Logo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-secondary hover:text-primary dark:text-zinc-400 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Bar in Mobile Menu */}
              <div className="py-4 border-b border-surface-container dark:border-zinc-800">
                {isAuthenticated && user ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-primary dark:text-white">{user.name}</p>
                      <p className="text-[10px] text-zinc-400 font-mono">{user.email}</p>
                    </div>
                    <button
                      onClick={logout}
                      className="p-1.5 text-red-500 hover:bg-red-500/10 rounded text-xs flex items-center gap-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2 bg-primary text-white dark:bg-white dark:text-black text-xs font-bold uppercase tracking-wider"
                  >
                    {t.signIn} / {t.register}
                  </Link>
                )}
              </div>

              {/* Mobile Links */}
              <div className="py-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base font-editorial font-bold text-primary dark:text-white hover:opacity-70"
                  >
                    {link.label}
                  </Link>
                ))}

                {(role === 'ROLE_ADMIN' || role === 'ROLE_STAFF') && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-bold text-amber-400 hover:underline pt-2 border-t border-zinc-800"
                  >
                    🛡️ {t.adminPanel}
                  </Link>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-surface-container dark:border-zinc-800 text-xs text-zinc-400 font-mono">
              EIFFEL LUXURY MENSWEAR • CAIRO, EG
            </div>
          </div>
        </div>
      )}
    </>
  );
};
