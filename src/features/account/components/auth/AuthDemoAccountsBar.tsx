import React from 'react';
import { useLanguage } from '@/shared';

interface AuthDemoAccountsBarProps {
  onDemoSelect: (email: string, pass: string) => void;
}

export const AuthDemoAccountsBar: React.FC<AuthDemoAccountsBarProps> = ({ onDemoSelect }) => {
  const { t } = useLanguage();

  return (
    <div className="mt-8 pt-6 border-t border-surface-container dark:border-zinc-800">
      <span className="block text-center text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-3">
        {t.demoAccounts}
      </span>
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => onDemoSelect('client@eiffel.com', 'client123')}
          className="px-2 py-1.5 bg-surface-container-low dark:bg-zinc-900 hover:bg-zinc-800 border border-surface-container dark:border-zinc-800 text-[10px] font-mono text-primary dark:text-zinc-300 transition-colors cursor-pointer"
        >
          {t.clientRole}
        </button>
        <button
          type="button"
          onClick={() => onDemoSelect('staff@eiffel.com', 'staff123')}
          className="px-2 py-1.5 bg-surface-container-low dark:bg-zinc-900 hover:bg-zinc-800 border border-surface-container dark:border-zinc-800 text-[10px] font-mono text-primary dark:text-zinc-300 transition-colors cursor-pointer"
        >
          {t.staffRole}
        </button>
        <button
          type="button"
          onClick={() => onDemoSelect('admin@eiffel.com', 'admin123')}
          className="px-2 py-1.5 bg-surface-container-low dark:bg-zinc-900 hover:bg-zinc-800 border border-surface-container dark:border-zinc-800 text-[10px] font-mono text-primary dark:text-zinc-300 transition-colors cursor-pointer"
        >
          {t.adminRole}
        </button>
      </div>
    </div>
  );
};
