import React, { useState } from 'react';
import { Upload, Link as LinkIcon, Sparkles, Loader2 } from 'lucide-react';
import { HeroBannerSettings } from '@/types';
import { useLanguage } from '@/shared';
import { uploadService } from '@/services/uploadService';

interface AdminHeroBannerFormProps {
  hero: HeroBannerSettings;
  onChange: (hero: HeroBannerSettings) => void;
}

export const AdminHeroBannerForm: React.FC<AdminHeroBannerFormProps> = ({
  hero,
  onChange
}) => {
  const { t } = useLanguage();
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Attempt live server upload
      const res = await uploadService.uploadImage(file);
      if (res?.fileUrl) {
        onChange({ ...hero, imageUrl: res.fileUrl });
        return;
      }
      throw new Error('No URL returned');
    } catch {
      // 2. Offline / local fallback to Data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onChange({ ...hero, imageUrl: reader.result });
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    onChange({ ...hero, imageUrl: urlInput.trim() });
    setUrlInput('');
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-6 shadow-xl">
      <div className="pb-3 border-b border-zinc-800 flex items-center justify-between">
        <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{t.adminMainHeroBanner}</span>
        </h2>
        <span className="text-[11px] text-zinc-500 font-mono">
          {t.adminDisplaysTopHomepage}
        </span>
      </div>

      {/* Hero Image & Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Preview Container */}
        <div className="lg:col-span-5 relative aspect-[16/9] bg-zinc-900 border border-zinc-800 overflow-hidden group">
          <img
            src={hero.imageUrl}
            alt="Hero Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
            <span className="text-[10px] font-mono text-zinc-300 bg-black/70 px-2 py-0.5 border border-white/10">
              {t.adminCoverPreview}
            </span>
          </div>
        </div>

        {/* Upload Controls */}
        <div className="lg:col-span-7 space-y-3">
          <label className="block text-xs text-zinc-300 font-bold">
            {t.adminHeroBgImage}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-dashed border-zinc-700 text-xs font-medium cursor-pointer transition-colors">
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              ) : (
                <Upload className="w-4 h-4 text-emerald-400" />
              )}
              <span>{isUploading ? t.adminUploading : t.adminUploadFromDevice}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>

            <div className="flex gap-1.5">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={t.adminPasteImageUrl}
                className="flex-1 bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium border border-zinc-700 transition-colors cursor-pointer"
              >
                {t.adminApplyBtn}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-zinc-500 font-mono">
            {t.adminRecommendedSizeHero}
          </p>
        </div>
      </div>

      {/* Headings & Text Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Title Ar */}
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1">
            {t.adminHeadlineTitleAr}
          </label>
          <input
            type="text"
            required
            value={hero.titleAr}
            onChange={(e) => onChange({ ...hero, titleAr: e.target.value })}
            placeholder="مثال: أحدث صيحات الملابس الرجالية"
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white"
          />
        </div>

        {/* Title En */}
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1">
            {t.adminHeadlineTitleEn}
          </label>
          <input
            type="text"
            required
            value={hero.titleEn}
            onChange={(e) => onChange({ ...hero, titleEn: e.target.value })}
            placeholder="e.g. CONTEMPORARY READY-TO-WEAR"
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Subtitle Ar */}
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1">
            {t.adminSubtitleParagraphAr}
          </label>
          <textarea
            rows={2}
            value={hero.subtitleAr}
            onChange={(e) => onChange({ ...hero, subtitleAr: e.target.value })}
            placeholder="اكتب وصفاً جذاباً للتشكيلة..."
            className="w-full bg-zinc-900 border border-zinc-700 p-3 text-xs text-white focus:outline-none focus:border-white"
          />
        </div>

        {/* Subtitle En */}
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1">
            {t.adminSubtitleParagraphEn}
          </label>
          <textarea
            rows={2}
            value={hero.subtitleEn}
            onChange={(e) => onChange({ ...hero, subtitleEn: e.target.value })}
            placeholder="Write luxury editorial description..."
            className="w-full bg-zinc-900 border border-zinc-700 p-3 text-xs text-white focus:outline-none focus:border-white font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tag Ar */}
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1">
            {t.adminSeasonTagBadgeAr}
          </label>
          <input
            type="text"
            value={hero.tagAr}
            onChange={(e) => onChange({ ...hero, tagAr: e.target.value })}
            placeholder="مثال: تشكيلة خريف / شتاء 2026 الحصرية"
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white"
          />
        </div>

        {/* Tag En */}
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1">
            {t.adminSeasonTagBadgeEn}
          </label>
          <input
            type="text"
            value={hero.tagEn}
            onChange={(e) => onChange({ ...hero, tagEn: e.target.value })}
            placeholder="e.g. AUTUMN / WINTER 2026 CAMPAIGN"
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
          />
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-zinc-800/80">
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1">
            {t.adminMainCtaTextAr}
          </label>
          <input
            type="text"
            value={hero.buttonTextAr}
            onChange={(e) => onChange({ ...hero, buttonTextAr: e.target.value })}
            placeholder="استكشف التشكيلة"
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1">
            {t.adminMainCtaTextEn}
          </label>
          <input
            type="text"
            value={hero.buttonTextEn}
            onChange={(e) => onChange({ ...hero, buttonTextEn: e.target.value })}
            placeholder="EXPLORE COLLECTION"
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1 flex items-center gap-1">
            <LinkIcon className="w-3 h-3 text-zinc-500" />
            <span>{t.adminButtonDestinationLink}</span>
          </label>
          <input
            type="text"
            value={hero.buttonLink}
            onChange={(e) => onChange({ ...hero, buttonLink: e.target.value })}
            placeholder="/collections/men"
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
          />
        </div>
      </div>
    </div>
  );
};
