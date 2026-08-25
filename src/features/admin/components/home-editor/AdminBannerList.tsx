import React from 'react';
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import { Banner } from '@/types';
import { useLanguage } from '@/shared';

interface AdminBannerListProps {
  banners: Banner[];
  onOpenCreate: () => void;
  onOpenEdit: (banner: Banner) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
}

export const AdminBannerList: React.FC<AdminBannerListProps> = ({
  banners,
  onOpenCreate,
  onOpenEdit,
  onToggleStatus,
  onDelete,
  onMove,
}) => {
  const { isRTL, t } = useLanguage();

  if (banners.length === 0) {
    return (
      <div className="p-12 text-center bg-zinc-950 border border-zinc-800 rounded-lg space-y-3">
        <ImageIcon className="w-10 h-10 text-zinc-600 mx-auto" />
        <h3 className="text-sm font-bold text-zinc-300">
          {t.adminNoBannersYet}
        </h3>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
          {t.adminCampaignsBannersDesc}
        </p>
        <button
          type="button"
          onClick={onOpenCreate}
          className="mt-2 px-4 py-2 bg-amber-500 text-black font-bold text-xs rounded hover:bg-amber-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.adminAddBanner}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {banners.map((banner, index) => {
        const ctr =
          (banner.impressions || 0) > 0
            ? (((banner.clicks || 0) / (banner.impressions || 1)) * 100).toFixed(1)
            : '0.0';

        return (
          <div
            key={banner.id}
            className={`p-4 sm:p-5 bg-zinc-950 border rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
              banner.isActive ? 'border-zinc-800 hover:border-zinc-700' : 'border-zinc-900 opacity-60'
            }`}
          >
            {/* Left: Thumbnail & Details */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Image Thumbnail */}
              <div className="w-24 h-16 sm:w-32 sm:h-20 bg-zinc-900 rounded overflow-hidden relative shrink-0 border border-zinc-800">
                {banner.desktopImageUrl || banner.mobileImageUrl ? (
                  <img
                    src={banner.desktopImageUrl || banner.mobileImageUrl}
                    alt={banner.titleEn || 'Banner'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600 text-[10px]">
                    {t.adminNoImage}
                  </div>
                )}
                {banner.mobileImageUrl && (
                  <span className="absolute bottom-1 right-1 bg-black/80 text-[8px] text-zinc-300 px-1 rounded font-mono">
                    +Mob
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      banner.isActive
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    {banner.isActive ? `● ${t.adminActiveStatus}` : `✕ ${t.adminInactiveStatus}`}
                  </span>

                  {banner.tagAr && (
                    <span className="text-[9px] font-mono bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">
                      {isRTL ? banner.tagAr : banner.tagEn}
                    </span>
                  )}

                  {banner.discountCode && (
                    <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                      CODE: {banner.discountCode}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white truncate font-sans">
                  {isRTL ? (banner.titleAr || banner.titleEn) : (banner.titleEn || banner.titleAr)}
                </h3>

                {(banner.subtitleAr || banner.subtitleEn) && (
                  <p className="text-xs text-zinc-400 truncate">
                    {isRTL ? banner.subtitleAr : banner.subtitleEn}
                  </p>
                )}

                <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500 pt-1">
                  <span>CTA: {banner.buttonLink || '/'}</span>
                  <span>•</span>
                  <span>{banner.impressions || 0} views</span>
                  <span>•</span>
                  <span>{banner.clicks || 0} clicks</span>
                  <span>•</span>
                  <span className="text-amber-400">{ctr}% CTR</span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 self-end md:self-center shrink-0">
              <button
                type="button"
                onClick={() => onMove(index, 'up')}
                disabled={index === 0}
                className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                title={t.adminMoveUp}
              >
                <ArrowUp className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onMove(index, 'down')}
                disabled={index === banners.length - 1}
                className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                title={t.adminMoveDown}
              >
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onToggleStatus(banner.id)}
                className={`px-2 py-1 rounded text-[11px] font-mono cursor-pointer ${
                  banner.isActive
                    ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    : 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-800'
                }`}
              >
                {banner.isActive ? t.adminDisableAction : t.adminEnableAction}
              </button>

              <button
                type="button"
                onClick={() => onOpenEdit(banner)}
                className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
                title={t.adminEditCategory}
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onDelete(banner.id)}
                className="p-1.5 rounded bg-zinc-900 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 cursor-pointer"
                title={t.delete}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
