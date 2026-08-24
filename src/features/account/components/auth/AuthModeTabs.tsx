import React from 'react';
import { useLanguage } from '@/shared';

interface AuthModeTabsProps {
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

export const AuthModeTabs: React.FC<AuthModeTabsProps> = ({ mode, onModeChange }) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 gap-2 my-6 p-1 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800">
      <button
        type="button"
        onClick={() => onModeChange('login')}
        className={`py-2 text-xs font-label-bold tracking-wider uppercase transition-all ${
          mode === 'login'
            ? 'bg-white dark:bg-zinc-800 text-primary dark:text-white shadow-sm'
            : 'text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white'
        }`}
      >
        {t.signIn}
      </button>
      <button
        type="button"
        onClick={() => onModeChange('register')}
        className={`py-2 text-xs font-label-bold tracking-wider uppercase transition-all ${
          mode === 'register'
            ? 'bg-white dark:bg-zinc-800 text-primary dark:text-white shadow-sm'
            : 'text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white'
        }`}
      >
        {t.register}
      </button>
    </div>
  );
};
