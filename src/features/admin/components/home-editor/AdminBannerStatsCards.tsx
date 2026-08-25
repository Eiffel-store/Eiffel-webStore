import React from 'react';
import { Sparkles, Eye, MousePointerClick, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/shared';

interface AdminBannerStatsCardsProps {
  activeCount: number;
  totalBanners: number;
  totalImpressions: number;
  totalClicks: number;
  overallCtr: string;
}

export const AdminBannerStatsCards: React.FC<AdminBannerStatsCardsProps> = ({
  activeCount,
  totalBanners,
  totalImpressions,
  totalClicks,
  overallCtr,
}) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1 shadow-md">
        <div className="flex items-center justify-between text-zinc-400 text-xs">
          <span>{t.adminActiveCampaigns}</span>
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-2xl font-mono font-bold text-white">
          {activeCount} <span className="text-xs font-sans text-zinc-500 font-normal">/ {totalBanners}</span>
        </div>
      </div>

      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1 shadow-md">
        <div className="flex items-center justify-between text-zinc-400 text-xs">
          <span>{t.adminTotalImpressions}</span>
          <Eye className="w-4 h-4 text-sky-400" />
        </div>
        <div className="text-2xl font-mono font-bold text-white">
          {totalImpressions.toLocaleString()}
        </div>
      </div>

      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1 shadow-md">
        <div className="flex items-center justify-between text-zinc-400 text-xs">
          <span>{t.adminTotalClicks}</span>
          <MousePointerClick className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-mono font-bold text-white">
          {totalClicks.toLocaleString()}
        </div>
      </div>

      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1 shadow-md">
        <div className="flex items-center justify-between text-zinc-400 text-xs">
          <span>{t.adminAvgCtr}</span>
          <TrendingUp className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-2xl font-mono font-bold text-amber-400">
          {overallCtr}%
        </div>
      </div>
    </div>
  );
};
