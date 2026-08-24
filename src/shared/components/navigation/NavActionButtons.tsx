import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Sun, Moon } from 'lucide-react';
import { useCart } from '@/features/cart';
import { useWishlist } from '@/features/wishlist';
import { useTheme } from '@/shared';
import { useAuthStore } from '@/stores/useAuthStore';
import { NavLanguageDropdown } from './NavLanguageDropdown';

interface NavActionButtonsProps {
  onOpenSearch: () => void;
}

export const NavActionButtons: React.FC<NavActionButtonsProps> = ({ onOpenSearch }) => {
  const { totalItems, openCart } = useCart();
  const { totalWishlist } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuthStore();

  return (
    <div className="flex items-center gap-1.5 sm:gap-3">
      {/* Language Switcher */}
      <NavLanguageDropdown />

      {/* Dark/Light Mode Toggle */}
      <button
        onClick={toggleTheme}
        className="p-1.5 sm:p-2 text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors cursor-pointer"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      {/* Search Trigger */}
      <button
        onClick={onOpenSearch}
        className="p-1.5 sm:p-2 text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors cursor-pointer"
        aria-label="Search"
      >
        <Search className="w-4 h-4" />
      </button>

      {/* Wishlist Link */}
      <Link
        to="/wishlist"
        className="relative p-1.5 sm:p-2 text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors cursor-pointer"
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
        className="hidden sm:flex items-center gap-1.5 p-2 text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors cursor-pointer"
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
            {(user.name || user.email || 'User').split(' ')[0]}
          </span>
        )}
      </Link>

      {/* Cart Trigger */}
      <button
        onClick={openCart}
        className="relative flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-primary text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors px-2.5 sm:px-3 py-1.5 sm:py-2 font-label-bold text-xs tracking-wider cursor-pointer"
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
  );
};
