import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useLanguage } from '@/shared';
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
          isScrolled ? 'h-[64px] sm:h-[70px] shadow-sm' : 'h-[68px] sm:h-[80px]'
        }`}
      >
        <div className="max-w-[1440px] mx-auto h-full px-3 sm:px-8 md:px-12 flex items-center justify-between">
          {/* Left / Start: Mobile Menu Button, Brand Logo & Direct Category Links */}
          <div className="flex items-center gap-4 sm:gap-8 h-full">
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

            {/* Direct Desktop Links for the Top 4 Categories */}
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
