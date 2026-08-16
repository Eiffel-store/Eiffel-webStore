import React from 'react';
import { DollarSign } from 'lucide-react';
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
  const { isRTL } = useLanguage();

  return (
    <div className="space-y-4 pt-4 border-t border-zinc-800">
      <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
        <DollarSign className="w-4 h-4 text-amber-400" />
        <span>{isRTL ? '2. شريط الإعلانات والشحن المجاني' : '2. Top Announcement Bar & Free Shipping'}</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {isRTL ? 'نص الإعلان (عربي)' : 'Announcement Text (Arabic)'}
          </label>
          <input
            type="text"
            value={settings.announcementTextAr}
            onChange={(e) => onChange({ announcementTextAr: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {isRTL ? 'نص الإعلان (إنجليزي)' : 'Announcement Text (English)'}
          </label>
          <input
            type="text"
            value={settings.announcementTextEn}
            onChange={(e) => onChange({ announcementTextEn: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {isRTL ? 'الحد الأدنى للشحن المجاني (EGP)' : 'Free Shipping Threshold (EGP)'}
          </label>
          <input
            type="number"
            value={settings.freeShippingThreshold}
            onChange={(e) => onChange({ freeShippingThreshold: parseFloat(e.target.value) || 0 })}
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {isRTL ? 'اسم المتجر المعروض' : 'Store Display Name'}
          </label>
          <input
            type="text"
            value={settings.storeName}
            onChange={(e) => onChange({ storeName: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
          />
        </div>
      </div>
    </div>
  );
};
