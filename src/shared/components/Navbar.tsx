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
  const { t } = useLanguage();
  const { settings } = useStoreData();
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

  // Core Static Navigation Links (Linked to i18n Dictionary)
  const navLinks: NavLinkItem[] = useMemo(() => {
    return [
      {
        label: t.navMen,
        href: '/collections/men',
      },
      {
        label: t.navKids,
        href: '/collections/kids',
      },
      {
        label: t.navAccessories,
        href: '/collections/accessories',
      },
      {
        label: t.navShoes,
        href: '/collections/shoes',
      },
      {
        label: t.navOffers || t.navCollection04,
        href: '/collections/offers',
        isSpecial: true,
      },
      {
        label: t.navStores,
        href: '/stores',
      },
    ];
  }, [t]);

  return (
    <>
      {/* Top Banner Announcement */}
      <NavTopAnnouncement />

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-50 w-full bg-white dark:bg-zinc-950 border-b border-surface-container dark:border-zinc-850 transition-all duration-200 ${
          isScrolled ? 'h-[64px] sm:h-[72px] shadow-sm' : 'h-[70px] sm:h-[82px]'
        }`}
      >
        <div className="w-full h-full px-2.5 min-[360px]:px-4 sm:px-8 md:px-10 lg:px-12 flex items-center justify-between gap-2 min-[360px]:gap-4">
          {/* Left: Mobile Menu Button & Brand Logo */}
          <div className="flex items-center gap-1.5 min-[360px]:gap-3 sm:gap-4 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 -ml-1.5 rtl:-ml-0 rtl:-mr-1.5 text-primary dark:text-white hover:opacity-70 transition-opacity cursor-pointer"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Brand Logo & Store Name */}
            <Link
              to="/"
              className="hover:opacity-90 transition-opacity flex items-center gap-1.5 min-[360px]:gap-2.5 py-1"
            >
              <Logo size="md" />
              <span className="font-editorial text-sm min-[360px]:text-base sm:text-xl font-bold tracking-widest text-primary dark:text-white uppercase whitespace-nowrap">
                {settings?.storeName || 'EIFFEL'}
              </span>
            </Link>
          </div>

          {/* Center: Spaced Category Links */}
          <div className="hidden lg:flex flex-1 justify-center px-2 xl:px-6">
            <NavDesktopLinks links={navLinks} />
          </div>

          {/* Right: Search, Wishlist, Theme, Account, Cart */}
          <div className="shrink-0 flex items-center">
            <NavActionButtons onOpenSearch={onOpenSearch} />
          </div>
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
