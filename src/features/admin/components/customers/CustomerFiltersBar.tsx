import React from 'react';
import { Search, Crown } from 'lucide-react';
import { useLanguage } from '@/shared';

interface CustomerFiltersBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  tierFilter: 'all' | 'vip' | 'member';
  onTierFilterChange: (tier: 'all' | 'vip' | 'member') => void;
  totalCount: number;
  vipCount: number;
  memberCount: number;
}

export const CustomerFiltersBar: React.FC<CustomerFiltersBarProps> = ({
  searchQuery,
  onSearchChange,
  tierFilter,
  onTierFilterChange,
  totalCount,
  vipCount,
  memberCount,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-zinc-500 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.adminSearchCustomerPlaceholder}
          className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
        />
      </div>

      {/* Tier Filter Pills */}
      <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1">
        <button
          type="button"
          onClick={() => onTierFilterChange('all')}
          className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
            tierFilter === 'all' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          {t.all} ({totalCount})
        </button>

        <button
          type="button"
          onClick={() => onTierFilterChange('vip')}
          className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
            tierFilter === 'vip' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span>{t.vip} ({vipCount})</span>
        </button>

        <button
          type="button"
          onClick={() => onTierFilterChange('member')}
          className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
            tierFilter === 'member' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          {t.standardMembers} ({memberCount})
        </button>
      </div>
    </div>
  );
};
