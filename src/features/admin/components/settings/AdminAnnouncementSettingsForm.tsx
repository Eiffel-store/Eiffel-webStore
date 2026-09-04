import React from 'react';
import { DollarSign, Sparkles, Coins } from 'lucide-react';
import { StoreSettings } from '@/types';
import { useLanguage } from '@/shared';

interface AdminAnnouncementSettingsFormProps {
  settings: StoreSettings;
  onChange: (updates: Partial<StoreSettings>) => void;
}

export const AdminAnnouncementSettingsForm: React.FC<AdminAnnouncementSettingsFormProps> = ({
  settings,
  onChange
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
        <DollarSign className="w-4 h-4 text-amber-400" />
        <span>{t.adminAnnouncementSection}</span>
      </h2>

      {/* Top Announcement Bar Text (Ar / En) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {t.adminAnnouncementTextAr}
          </label>
          <input
            type="text"
            value={settings.announcementTextAr || ''}
            onChange={(e) => onChange({ announcementTextAr: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {t.adminAnnouncementTextEn}
          </label>
          <input
            type="text"
            value={settings.announcementTextEn || ''}
            onChange={(e) => onChange({ announcementTextEn: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white"
          />
        </div>
      </div>

      {/* Shipping Threshold & Store Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {t.adminFreeShippingThresholdEgp}
          </label>
          <input
            type="number"
            value={settings.freeShippingThreshold || 0}
            onChange={(e) => onChange({ freeShippingThreshold: parseFloat(e.target.value) || 0 })}
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {t.adminStoreDisplayName}
          </label>
          <input
            type="text"
            value={settings.storeName || ''}
            onChange={(e) => onChange({ storeName: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
          />
        </div>
      </div>

      {/* Tagline & Currency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.adminStoreTagline}</span>
          </label>
          <input
            type="text"
            value={settings.tagline || ''}
            onChange={(e) => onChange({ tagline: e.target.value })}
            placeholder="الأناقة المعمارية الفاخرة في مصر"
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white"
          />
          <p className="text-[10px] text-zinc-500 mt-1">
            {t.adminStoreTaglineTip}
          </p>
        </div>

        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.adminStoreCurrency}</span>
          </label>
          <input
            type="text"
            value={settings.currency || 'EGP'}
            onChange={(e) => onChange({ currency: e.target.value })}
            placeholder="EGP"
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white font-mono uppercase"
          />
        </div>
      </div>
    </div>
  );
};
