import React from 'react';
import { Link } from 'react-router-dom';
import { X, LogOut, Sparkles, Sun, Moon } from 'lucide-react';
import { Logo } from '../Logo';
import { useLanguage, useStoreData, useTheme } from '@/shared';
import { useAuthStore } from '@/stores/useAuthStore';
import { NavLinkItem } from './NavDesktopLinks';

interface NavMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLinkItem[];
}

export const NavMobileDrawer: React.FC<NavMobileDrawerProps> = ({
  isOpen,
  onClose,
  links,
}) => {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { settings } = useStoreData();
  const { user, isAuthenticated, role, logout } = useAuthStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-sm">
      <div className="fixed inset-y-0 left-0 rtl:left-auto rtl:right-0 w-4/5 max-w-sm bg-white dark:bg-zinc-950 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-surface-container dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <Logo size="sm" />
              <span className="font-editorial text-sm font-bold tracking-widest text-primary dark:text-white uppercase">
                {settings?.storeName || 'EIFFEL'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-secondary hover:text-primary dark:text-zinc-400 dark:hover:text-white cursor-pointer"
              aria-label="Close mobile menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Bar in Mobile Menu */}
          <div className="py-4 border-b border-surface-container dark:border-zinc-800">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-primary dark:text-white">
                    {user.name || user.email || 'User'}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-mono">{user.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-red-500 hover:bg-red-500/10 rounded text-xs flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/account"
                onClick={onClose}
                className="block text-center py-2 bg-primary text-white dark:bg-white dark:text-black text-xs font-bold uppercase tracking-wider rounded"
              >
                {t.signIn} / {t.register}
              </Link>
            )}
          </div>

          {/* Mobile Direct Links */}
          <div className="py-6 space-y-3">
            {links.map((link) => (
              <Link
                key={link.href + link.label}
                to={link.href}
                onClick={onClose}
                className={`block text-base font-editorial font-bold hover:opacity-70 py-1.5 border-b border-surface-container-low dark:border-zinc-900 ${
                  link.isSpecial ? 'text-amber-500 dark:text-amber-400' : 'text-primary dark:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  {link.isSpecial && <Sparkles className="w-4 h-4 text-amber-400" />}
                  <span>{link.label}</span>
                </div>
              </Link>
            ))}

            {(role === 'ROLE_ADMIN' || role === 'ROLE_STAFF') && (
              <Link
                to="/admin"
                onClick={onClose}
                className="block text-sm font-bold text-amber-400 hover:underline pt-3 mt-2 border-t border-surface-container dark:border-zinc-800"
              >
                🛡️ {t.adminPanel}
              </Link>
            )}
          </div>
        </div>

        <div className="pt-6 pb-2 border-t border-surface-container dark:border-zinc-800 space-y-3">
          {/* Quick Preferences Bar (Theme & Language in Mobile Drawer) */}
          <div className="flex items-center justify-between py-2 border-y border-zinc-850">
            <span className="text-xs font-mono text-secondary dark:text-zinc-400 uppercase tracking-wider">
              {t.theme || 'THEME'}
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 text-xs font-mono text-primary dark:text-white"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>LIGHT</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-blue-400" />
                  <span>DARK</span>
                </>
              )}
            </button>
          </div>

          <div className="text-[11px] text-zinc-500 font-mono tracking-wider">
            EIFFEL LUXURY MENSWEAR • CAIRO, EG
          </div>
        </div>
      </div>
    </div>
  );
};
