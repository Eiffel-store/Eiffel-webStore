import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Sparkles } from 'lucide-react';
import { useLanguage } from '@/shared';
import { NavMegaMenu } from './NavMegaMenu';

export interface NavLinkItem {
  label: string;
  href: string;
  isSpecial?: boolean;
}

interface NavDesktopLinksProps {
  links: NavLinkItem[];
}

export const NavDesktopLinks: React.FC<NavDesktopLinksProps> = ({ links }) => {
  const location = useLocation();
  const { language } = useLanguage();
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 200);
  };

  return (
    <div
      className="hidden lg:flex items-center"
      onMouseLeave={handleMouseLeave}
    >
      <nav className="flex items-center gap-6 xl:gap-8">
        {/* Mega Menu Trigger: التشكيلات / COLLECTIONS */}
        <div
          className="relative py-3"
          onMouseEnter={handleMouseEnter}
        >
          <button
            type="button"
            onClick={() => setMegaMenuOpen(!megaMenuOpen)}
            className={`font-label-bold text-xs tracking-widest uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer py-1 ${
              megaMenuOpen || location.pathname.startsWith('/collections')
                ? 'text-primary dark:text-white border-b-2 border-primary dark:border-white'
                : 'text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white'
            }`}
          >
            <span>{language === 'ar' ? 'التشكيلات' : 'COLLECTIONS'}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                megaMenuOpen ? 'rotate-180 text-amber-400' : 'opacity-60'
              }`}
            />
          </button>
        </div>

        {/* Other Top-Level Direct Links */}
        {links.map((link) => {
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={link.label}
              to={link.href}
              className={`font-label-bold text-xs tracking-widest uppercase transition-all duration-200 py-1 flex items-center gap-1.5 ${
                isActive
                  ? 'text-primary dark:text-white border-b-2 border-primary dark:border-white'
                  : link.isSpecial
                  ? 'text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 font-bold'
                  : 'text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white'
              }`}
            >
              {link.isSpecial && <Sparkles className="w-3 h-3 text-amber-400" />}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Luxury Full-Width Mega Menu Dropdown */}
      <NavMegaMenu
        isOpen={megaMenuOpen}
        onClose={() => setMegaMenuOpen(false)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
};
