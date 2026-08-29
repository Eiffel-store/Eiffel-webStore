import React, { useState, useRef } from 'react';
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
}

export const NavDesktopLinks: React.FC<NavDesktopLinksProps> = ({ links }) => {
  const location = useLocation();
  const { isRTL, language } = useLanguage();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // If there are more than 5 links, show first 4 and put remaining in "More / المزيد"
  const MAX_DIRECT_LINKS = 5;
  const visibleLinks = links.length > MAX_DIRECT_LINKS ? links.slice(0, 4) : links;
  const overflowLinks = links.length > MAX_DIRECT_LINKS ? links.slice(4) : [];

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMoreMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setMoreMenuOpen(false);
    }, 150);
  };

  return (
    <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
      {/* Primary Visible Direct Links */}
      {visibleLinks.map((link) => {
        const isActive = location.pathname === link.href;
        return (
          <Link
            key={link.href + link.label}
            to={link.href}
            className={`font-label-bold text-xs tracking-widest uppercase transition-all duration-200 py-1 flex items-center gap-1.5 whitespace-nowrap ${
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

      {/* Elegant Compact "More" Dropdown for remaining categories if > 5 */}
      {overflowLinks.length > 0 && (
        <div
          className="relative py-2"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            type="button"
            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            className={`font-label-bold text-xs tracking-widest uppercase transition-all duration-200 flex items-center gap-1 py-1 cursor-pointer whitespace-nowrap ${
              moreMenuOpen || overflowLinks.some((l) => location.pathname === l.href)
                ? 'text-primary dark:text-white border-b-2 border-primary dark:border-white'
                : 'text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white'
            }`}
          >
            <span>{language === 'ar' ? 'المزيد' : 'MORE'}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                moreMenuOpen ? 'rotate-180 text-amber-400' : 'opacity-60'
              }`}
            />
          </button>

          {moreMenuOpen && (
            <div
              className={`absolute top-full ${
                isRTL ? 'right-0' : 'left-0'
              } mt-1 w-48 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border border-surface-container dark:border-zinc-800 rounded-lg p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150`}
            >
              <div className="space-y-1">
                {overflowLinks.map((link) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.href + link.label}
                      to={link.href}
                      onClick={() => setMoreMenuOpen(false)}
                      className={`block px-3 py-2 text-xs font-mono rounded transition-colors ${
                        isActive
                          ? 'bg-zinc-100 dark:bg-zinc-900 text-amber-500 font-bold'
                          : 'text-secondary dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/80 hover:text-primary dark:hover:text-white'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
