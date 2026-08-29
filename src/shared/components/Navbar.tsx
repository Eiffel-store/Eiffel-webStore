import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useLanguage, useStoreData } from '@/shared';
import { Logo } from './Logo';
import {
  NavTopAnnouncement,
  NavDesktopLinks,
  NavActionButtons,
  NavMobileDrawer,
  NavLinkItem,
} from './navigation';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { t, language } = useLanguage();
  const { categories } = useStoreData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Dynamic Navigation Links: Generated directly from active categories in backend
  const navLinks: NavLinkItem[] = useMemo(() => {
    const dynamicCats: NavLinkItem[] = categories.map((cat) => ({
      label: language === 'ar' ? (cat.name || cat.nameEn) : (cat.nameEn || cat.name),
      href: `/collections/${cat.id}`,
    }));

    return [
      ...dynamicCats,
      { label: language === 'ar' ? 'أحدث الإصدارات' : 'NEW ARRIVALS', href: '/collections/new-arrivals' },
      { label: t.navCollection04, href: '/collections/offers', isSpecial: true },
      { label: t.navStores, href: '/stores' },
    ];
  }, [categories, language, t]);

  return (
    <>
      {/* Top Banner Announcement */}
      <NavTopAnnouncement />

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-surface-container dark:border-zinc-850 transition-all duration-200 ${
          isScrolled ? 'h-[64px] sm:h-[70px] shadow-sm' : 'h-[68px] sm:h-[80px]'
        }`}
      >
        <div className="max-w-[1440px] mx-auto h-full px-3 sm:px-8 md:px-12 flex items-center justify-between">
          {/* Left / Start: Mobile Menu Button & Brand Links */}
          <div className="flex items-center gap-3 sm:gap-8">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 -ml-1.5 rtl:-ml-0 rtl:-mr-1.5 text-primary dark:text-white hover:opacity-70 transition-opacity cursor-pointer"
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

            {/* Desktop Navigation Links (Option 1: Direct Dynamic Links) */}
            <NavDesktopLinks links={navLinks} />
          </div>

          {/* Right / End: Search, Wishlist, Theme, Account, Cart */}
          <NavActionButtons onOpenSearch={onOpenSearch} />
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Menu */}
      <NavMobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={navLinks}
      />
    </>
  );
};
