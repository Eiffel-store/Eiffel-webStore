import React from 'react';
import { Crown, Sparkles } from 'lucide-react';
import { useLanguage } from '@/shared';
import { User } from '@/types';

interface AccountHeaderProps {
  user: User;
}

export const AccountHeader: React.FC<AccountHeaderProps> = ({ user }) => {
  const { t, isRTL } = useLanguage();

  const isVip = Boolean(user.isVip) || user.tier === 'VIP' || user.tier === 'VIP_PLATINUM' || ((user.points ?? user.tierPoints ?? 0) >= 200);
  const points = user.points ?? user.tierPoints ?? 0;

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 sm:pb-8 border-b border-surface-container dark:border-zinc-800 gap-4 sm:gap-6">
      <div>
        <span className="text-[10px] sm:text-xs font-mono text-secondary dark:text-zinc-400 uppercase tracking-widest">
          {t.clientDashboard}
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl text-primary dark:text-white mt-1">
          {t.welcomeClient} {(user.name || user.email || 'CLIENT').toUpperCase()}
        </h1>
      </div>

      <div className="flex items-center justify-between sm:justify-start gap-4 p-3 sm:p-4 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 rounded-xl shadow-lg">
        {/* Tier Badge */}
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
            isVip ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30' : 'bg-zinc-800 text-zinc-400'
          }`}>
            {isVip ? <Crown className="w-5 h-5" /> : <Sparkles className="w-5 h-5 text-amber-400" />}
          </div>
          <div>
            <div className="text-[9px] sm:text-[10px] font-mono text-secondary dark:text-zinc-400 uppercase tracking-wider">
              {isRTL ? 'مستوى العضوية' : 'Membership Tier'}
            </div>
            <div className="font-mono text-xs sm:text-sm font-bold text-primary dark:text-white flex items-center gap-1.5 mt-0.5">
              {isVip ? (
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <span>VIP 👑</span>
                  <span className="text-[11px] text-zinc-400 font-sans">({isRTL ? 'عميل مميز' : 'Exclusive'})</span>
                </span>
              ) : (
                <span className="text-zinc-300">
                  {isRTL ? 'عضو عادي (Member)' : 'Standard Member'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Points Display */}
        <div className="border-l rtl:border-l-0 rtl:border-r border-surface-container dark:border-zinc-800 pl-4 rtl:pl-0 rtl:pr-4">
          <div className="text-[9px] sm:text-[10px] font-mono text-secondary dark:text-zinc-400 uppercase tracking-wider">
            {isRTL ? 'نقاط الولاء المتاحة' : 'Loyalty Points'}
          </div>
          <div className="font-mono text-sm sm:text-base font-bold text-emerald-400 mt-0.5">
            {points} <span className="text-xs text-zinc-400">PTS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
