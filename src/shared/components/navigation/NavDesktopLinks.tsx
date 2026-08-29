import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Sparkles } from 'lucide-react';
import { useLanguage } from '@/shared';

export interface NavLinkItem {
  label: string;
  href: string;
  isSpecial?: boolean;
}

interface NavDesktopLinksProps {
  links: NavLinkItem[];
  isMegaMenuOpen: boolean;
  onOpenMegaMenu: () => void;
  onToggleMegaMenu: () => void;
}

export const NavDesktopLinks: React.FC<NavDesktopLinksProps> = ({
  links,
  isMegaMenuOpen,
  onOpenMegaMenu,
  onToggleMegaMenu,
}) => {
  const location = useLocation();
  const { language } = useLanguage();

  return (
    <div className="hidden lg:flex items-center h-full">
      <nav className="flex items-center gap-6 xl:gap-8 h-full">
        {/* Mega Menu Trigger Button: التشكيلات والأقسام / COLLECTIONS */}
        <div
          className="relative flex items-center h-full py-2"
          onMouseEnter={onOpenMegaMenu}
        >
          <button
            type="button"
            onClick={onToggleMegaMenu}
            className={`font-label-bold text-xs tracking-widest uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer py-1.5 ${
              isMegaMenuOpen || location.pathname.startsWith('/collections')
                ? 'text-primary dark:text-white border-b-2 border-primary dark:border-white font-bold'
                : 'text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white'
            }`}
          >
            <span>{language === 'ar' ? 'التشكيلات والأقسام' : 'COLLECTIONS'}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isMegaMenuOpen ? 'rotate-180 text-amber-400' : 'opacity-60'
              }`}
            />
          </button>
        </div>

        {/* Direct Links */}
        {links.map((link) => {
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={link.label}
              to={link.href}
              className={`font-label-bold text-xs tracking-widest uppercase transition-all duration-200 py-1.5 flex items-center gap-1.5 whitespace-nowrap ${
                isActive
                  ? 'text-primary dark:text-white border-b-2 border-primary dark:border-white font-bold'
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
    </div>
  );
};
