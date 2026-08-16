import React from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { User } from '../../types';

interface AccountHeaderProps {
  user: User;
}

export const AccountHeader: React.FC<AccountHeaderProps> = ({ user }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 sm:pb-8 border-b border-surface-container dark:border-zinc-800 gap-4 sm:gap-6">
      <div>
        <span className="text-[10px] sm:text-xs font-mono text-secondary dark:text-zinc-400 uppercase tracking-widest">
          {t.clientDashboard}
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl text-primary dark:text-white mt-1">
          {t.welcomeClient} {user.name.toUpperCase()}
        </h1>
      </div>

      <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4 p-3 sm:p-4 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 shrink-0" />
          <div>
            <div className="text-[9px] sm:text-[10px] font-label-bold text-secondary dark:text-zinc-400 uppercase">
              {t.membershipTier}
            </div>
            <div className="font-editorial text-lg sm:text-xl text-primary dark:text-white">
              {user.tier}
            </div>
          </div>
        </div>
        <div className="border-l rtl:border-l-0 rtl:border-r border-surface-container dark:border-zinc-800 pl-3 sm:pl-4 rtl:pl-0 rtl:pr-3 rtl:sm:pr-4">
          <div className="text-[9px] sm:text-[10px] font-label-bold text-secondary dark:text-zinc-400 uppercase">
            {t.privePoints}
          </div>
          <div className="font-mono text-xs sm:text-sm font-bold text-primary dark:text-white">
            {user.tierPoints} PTS
          </div>
        </div>
      </div>
    </div>
  );
};
