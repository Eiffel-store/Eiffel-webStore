import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface NavLinkItem {
  label: string;
  href: string;
}

interface NavDesktopLinksProps {
  links: NavLinkItem[];
}

export const NavDesktopLinks: React.FC<NavDesktopLinksProps> = ({ links }) => {
  const location = useLocation();

  return (
    <nav className="hidden lg:flex items-center gap-7">
      {links.map((link) => {
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
  );
};
