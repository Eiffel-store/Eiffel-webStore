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
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let prevY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;

          // Compact header style threshold
          setIsScrolled(currentY > 20);

          // Smart Show / Hide (Headroom luxury behavior)
          if (currentY <= 60) {
            // Near the very top: always fully visible
            setIsVisible(true);
          } else {
            const diff = currentY - prevY;
            if (diff > 8) {
              // Scrolling DOWN: glide up smoothly
              setIsVisible(false);
            } else if (diff < -8) {
              // Scrolling UP: reveal instantly with smooth slide-down
              setIsVisible(true);
            }
          }

          prevY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setIsVisible(true);
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

      {/* Main Sticky Header with Smart Hide/Show */}
      <header
        className={`sticky top-0 z-50 w-full border-b border-surface-container dark:border-zinc-850 transition-all duration-300 ease-in-out ${
          isVisible || mobileMenuOpen
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0 pointer-events-none'
        } ${
          isScrolled
            ? 'h-[64px] sm:h-[72px] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-md'
            : 'h-[70px] sm:h-[82px] bg-white dark:bg-zinc-950 shadow-none'
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
