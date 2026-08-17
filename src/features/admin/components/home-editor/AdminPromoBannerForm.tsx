import React, { useState } from 'react';
import { Tag, Upload, Link as LinkIcon, Sparkles } from 'lucide-react';
import { PromoBannerSettings } from '@/types';
import { useLanguage } from '@/shared';

interface AdminPromoBannerFormProps {
  promo: PromoBannerSettings;
  onChange: (promo: PromoBannerSettings) => void;
}

export const AdminPromoBannerForm: React.FC<AdminPromoBannerFormProps> = ({
  promo,
  onChange
}) => {
  const { isRTL } = useLanguage();
  const [urlInput, setUrlInput] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onChange({ ...promo, imageUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    onChange({ ...promo, imageUrl: urlInput.trim() });
    setUrlInput('');
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-6 shadow-xl">
      <div className="pb-3 border-b border-zinc-800 flex items-center justify-between">
        <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Tag className="w-4 h-4 text-emerald-400" />
          <span>{isRTL ? '2. بانر العرض الترويجي في منتصف الصفحة (Promo Editorial)' : '2. Mid-Page Promo Editorial'}</span>
        </h2>
        <span className="text-[11px] text-zinc-500 font-mono">
          {isRTL ? 'يظهر بين الأقسام وقسم وصل حديثاً' : 'Displays between categories and new arrivals'}
        </span>
      </div>

      {/* Media Upload & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-5 relative aspect-[16/10] bg-zinc-900 border border-zinc-800 overflow-hidden">
          <img
            src={promo.imageUrl}
            alt="Promo Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 shadow">
            {promo.badgeEn}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-3">
          <label className="block text-xs text-zinc-300 font-bold">
            {isRTL ? 'صورة البانر الترويجي (Promo Image)' : 'Promo Banner Image'}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-dashed border-zinc-700 text-xs font-medium cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>{isRTL ? 'رفع صورة من الجهاز' : 'Upload from Device'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div className="flex gap-1.5">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={isRTL ? 'أو ضع رابط صورة مباشر...' : 'Or paste image URL...'}
                className="flex-1 bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium border border-zinc-700 transition-colors"
              >
                {isRTL ? 'تطبيق' : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Headings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1">
            {isRTL ? 'عنوان العرض (عربي) *' : 'Promo Title (Arabic) *'}
          </label>
          <input
            type="text"
            required
            value={promo.titleAr}
            onChange={(e) => onChange({ ...promo, titleAr: e.target.value })}
            placeholder="مثال: قميص إيفل المعماري الثقيل"
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1">
            {isRTL ? 'عنوان العرض (إنجليزي) *' : 'Promo Title (English) *'}
          </label>
          <input
            type="text"
            required
            value={promo.titleEn}
            onChange={(e) => onChange({ ...promo, titleEn: e.target.value })}
            placeholder="e.g. EIFFEL HEAVY OVERSHIRT"
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
          />
        </div>
      </div>

      {/* Description */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1">
            {isRTL ? 'نص الوصف (عربي)' : 'Description (Arabic)'}
          </label>
          <textarea
            rows={2}
            value={promo.descriptionAr}
            onChange={(e) => onChange({ ...promo, descriptionAr: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-700 p-3 text-xs text-white focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1">
            {isRTL ? 'نص الوصف (إنجليزي)' : 'Description (English)'}
          </label>
          <textarea
            rows={2}
            value={promo.descriptionEn}
            onChange={(e) => onChange({ ...promo, descriptionEn: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-700 p-3 text-xs text-white focus:outline-none focus:border-white font-mono"
          />
        </div>
      </div>

      {/* Badges & Button */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-zinc-800/80">
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1">
            {isRTL ? 'شارة الخصم (عربي)' : 'Discount Badge (Arabic)'}
          </label>
          <input
            type="text"
            value={promo.discountBadgeAr}
            onChange={(e) => onChange({ ...promo, discountBadgeAr: e.target.value })}
            placeholder="خصم يصل إلى 30%"
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1">
            {isRTL ? 'نص الزر (عربي)' : 'Button Text (Arabic)'}
          </label>
          <input
            type="text"
            value={promo.buttonTextAr}
            onChange={(e) => onChange({ ...promo, buttonTextAr: e.target.value })}
            placeholder="اطلب القطعة الآن"
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1">
            {isRTL ? 'رابط التوجيه' : 'Destination Link'}
          </label>
          <input
            type="text"
            value={promo.buttonLink}
            onChange={(e) => onChange({ ...promo, buttonLink: e.target.value })}
            placeholder="/collections/offers"
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
          />
        </div>
      </div>
    </div>
  );
};
