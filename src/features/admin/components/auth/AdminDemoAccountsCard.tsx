import React from 'react';
import { useLanguage } from '@/shared';
import { ADMIN_DEMO_ACCOUNTS } from '../../constants';

interface AdminDemoAccountsCardProps {
  onQuickFill: (email: string, pass: string) => void;
}

export const AdminDemoAccountsCard: React.FC<AdminDemoAccountsCardProps> = ({ onQuickFill }) => {
  const { isRTL, t } = useLanguage();

  return (
    <div className="mt-8 pt-6 border-t border-zinc-800">
      <div className="flex items-center justify-between mb-3 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
        <span>{t.demoAccounts}:</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {ADMIN_DEMO_ACCOUNTS.map(account => (
          <button
            key={account.email}
            type="button"
            onClick={() => onQuickFill(account.email, account.pass)}
            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left rtl:text-right transition-colors group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${account.badgeColor}`}>
                {isRTL ? account.roleAr : account.roleEn}
              </span>
              <span className="text-[9px] text-zinc-500 font-mono">{account.scope}</span>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{account.email}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

