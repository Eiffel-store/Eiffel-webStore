import React from 'react';
import { MessageCircle, Phone, Globe } from 'lucide-react';
import { StoreSettings } from '@/types';
import { FacebookIcon } from '@/shared';
import { useLanguage } from '@/shared';

interface AdminContactSettingsFormProps {
  settings: StoreSettings;
  onChange: (updates: Partial<StoreSettings>) => void;
}

export const AdminContactSettingsForm: React.FC<AdminContactSettingsFormProps> = ({
  settings,
  onChange
}) => {
  const { isRTL } = useLanguage();

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
        <MessageCircle className="w-4 h-4 text-emerald-400" />
        <span>{isRTL ? '1. أرقام وروابط التواصل الاجتماعي' : '1. Contact & Social Channels'}</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5 flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-green-500" />
            <span>{isRTL ? 'رقم الواتساب (WhatsApp Number) *' : 'WhatsApp Number *'}</span>
          </label>
          <input
            type="text"
            required
            value={settings.whatsappNumber}
            onChange={(e) => onChange({ whatsappNumber: e.target.value })}
            placeholder="+201009326801"
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
          />
          <p className="text-[11px] text-zinc-500 mt-1 font-mono">
            {isRTL ? 'مربوط بزر الواتساب العائم في أسفل الموقع.' : 'Connected to floating WhatsApp CTA button.'}
          </p>
        </div>

        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5 flex items-center gap-1.5">
            <FacebookIcon className="w-3.5 h-3.5 fill-blue-500" />
            <span>{isRTL ? 'رابط صفحة الفيسبوك (Facebook URL)' : 'Facebook Page URL'}</span>
          </label>
          <input
            type="text"
            value={settings.facebookUrl}
            onChange={(e) => onChange({ facebookUrl: e.target.value })}
            placeholder="https://www.facebook.com/profile.php?id=..."
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-zinc-400" />
            <span>{isRTL ? 'رقم الهاتف الرئيسي للخدمة' : 'Customer Service Phone'}</span>
          </label>
          <input
            type="text"
            value={settings.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+20 100 932 6801"
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-pink-500" />
            <span>{isRTL ? 'حساب الإنستجرام (Instagram)' : 'Instagram Handle / URL'}</span>
          </label>
          <input
            type="text"
            value={settings.instagramUrl}
            onChange={(e) => onChange({ instagramUrl: e.target.value })}
            placeholder="https://instagram.com/..."
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white"
          />
        </div>
      </div>
    </div>
  );
};
