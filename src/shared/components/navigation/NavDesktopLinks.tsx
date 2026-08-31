import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

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

  return (
    <nav className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-7">
      {links.map((link) => {
        const isActive = location.pathname === link.href;
        return (
          <Link
            key={link.href + link.label}
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
  );
};
