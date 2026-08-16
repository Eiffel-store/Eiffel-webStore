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
  Globe,
  ChevronDown,
  Languages
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import { useCurrency, CURRENCIES } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { Logo } from './Logo';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { totalItems, openCart } = useCart();
  const { totalWishlist } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrencyCode } = useCurrency();
  const { language, toggleLanguage, setLanguage, t, isRTL } = useLanguage();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
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
    { label: t.navCollection04, href: '/collections/new-arrivals' },
    { label: t.navJournal, href: '/journal' },
    { label: t.navStores, href: '/stores' }
  ];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-primary text-white dark:bg-zinc-900 dark:text-zinc-200 text-[10px] sm:text-[11px] py-1.5 px-3 sm:px-4 font-label-bold tracking-wider sm:tracking-widest text-center border-b border-black/10 flex items-center justify-between">
        <div className="hidden md:block w-36 text-left rtl:text-right text-zinc-400 font-mono text-[10px]">
          {t.topBannerLocations}
        </div>
        <div className="flex-1 text-center truncate">
          {t.topBannerPromo} <strong>EIFFEL10</strong>
        </div>
        <div className="hidden md:flex w-36 justify-end items-center gap-4 text-[10px] text-zinc-300">
          <Link to="/help" className="hover:underline">{t.help}</Link>
          <span>•</span>
          <Link to="/stores" className="hover:underline">{t.atelier}</Link>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 w-full bg-surface-container-lowest/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-surface-container dark:border-zinc-800 transition-all duration-200 ${
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
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-32 bg-surface-container-lowest dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 shadow-xl py-1 z-50 animate-fade-in">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left rtl:text-right px-3 py-2 text-xs font-mono flex items-center justify-between transition-colors ${
                      language === 'en'
                        ? 'bg-surface-container dark:bg-zinc-800 text-primary dark:text-white font-bold'
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
                        ? 'bg-surface-container dark:bg-zinc-800 text-primary dark:text-white font-bold'
                        : 'text-secondary dark:text-zinc-400 hover:bg-surface-container-low dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span>العربية</span>
                    <span className="text-[10px] text-secondary">AR</span>
                  </button>
                </div>
              )}
            </div>

            {/* Currency Selector (Desktop) */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 text-xs font-mono font-medium text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors py-1 px-2 border border-transparent hover:border-surface-container dark:hover:border-zinc-800"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{currency.code}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-32 bg-surface-container-lowest dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 shadow-xl py-1 z-50 animate-fade-in">
                  {Object.values(CURRENCIES).map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrencyCode(c.code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left rtl:text-right px-3 py-1.5 text-xs font-mono flex items-center justify-between transition-colors ${
                        currency.code === c.code
                          ? 'bg-surface-container dark:bg-zinc-800 text-primary dark:text-white font-bold'
                          : 'text-secondary dark:text-zinc-400 hover:bg-surface-container-low dark:hover:bg-zinc-800'
                      }`}
                    >
                      <span>{c.code}</span>
                      <span className="text-secondary dark:text-zinc-500">{c.symbol}</span>
                    </button>
                  ))}
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

            {/* Account Link (Desktop) */}
            <Link
              to="/account"
              className="hidden sm:flex p-2 text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors"
              aria-label="Account"
            >
              <User className="w-4 h-4" />
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

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} w-[85vw] max-w-xs bg-surface-container-lowest dark:bg-zinc-950 shadow-2xl p-6 flex flex-col justify-between z-10 animate-fade-in border-r rtl:border-r-0 rtl:border-l border-surface-container dark:border-zinc-800`}>
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-surface-container dark:border-zinc-800">
                <Logo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-primary dark:text-white"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <nav className="py-5 flex flex-col gap-3.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-editorial text-xl tracking-wide text-primary dark:text-white hover:opacity-70 transition-opacity py-1"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Language & Account in Mobile */}
              <div className="pt-5 border-t border-surface-container dark:border-zinc-800 flex flex-col gap-3">
                <div className="flex gap-2 mb-1">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`flex-1 py-2 text-xs font-mono font-bold border transition-colors ${
                      language === 'en'
                        ? 'bg-primary text-white dark:bg-white dark:text-black border-primary'
                        : 'border-surface-container text-secondary'
                    }`}
                  >
                    English (EN)
                  </button>
                  <button
                    onClick={() => setLanguage('ar')}
                    className={`flex-1 py-2 text-xs font-mono font-bold border transition-colors ${
                      language === 'ar'
                        ? 'bg-primary text-white dark:bg-white dark:text-black border-primary'
                        : 'border-surface-container text-secondary'
                    }`}
                  >
                    العربية (AR)
                  </button>
                </div>

                <Link
                  to="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 font-label-bold text-xs tracking-wider text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white uppercase py-1"
                >
                  <User className="w-4 h-4" />
                  <span>{t.navAccount}</span>
                </Link>
                <Link
                  to="/help"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 font-label-bold text-xs tracking-wider text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white uppercase py-1"
                >
                  <Globe className="w-4 h-4" />
                  <span>{t.helpCenterTitle}</span>
                </Link>
              </div>
            </div>

            {/* Mobile Currency & Copyright */}
            <div className="pt-5 border-t border-surface-container dark:border-zinc-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-label-bold text-secondary dark:text-zinc-400 uppercase">CURRENCY</span>
                <select
                  value={currency.code}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                  className="bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 text-xs font-mono px-2 py-1 text-primary dark:text-white focus:outline-none"
                >
                  {Object.values(CURRENCIES).map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[10px] text-secondary dark:text-zinc-500 font-mono text-center">
                © {new Date().getFullYear()} EIFFEL STUDIO S.A.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
