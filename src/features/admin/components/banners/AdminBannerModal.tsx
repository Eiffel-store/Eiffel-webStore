import React, { useState } from 'react';
import {
  X,
  Upload,
  Sparkles,
  Loader2,
  Calendar,
  Smartphone,
  Monitor,
  Check,
  Zap,
  Tag,
  Link2,
  ShoppingBag
} from 'lucide-react';
import { Banner, BannerPlacement } from '@/types';
import { useLanguage, useStoreData } from '@/shared';
import { uploadService } from '@/services/uploadService';
import toast from 'react-hot-toast';

interface AdminBannerModalProps {
  banner: Partial<Banner> | null;
  defaultPlacement?: BannerPlacement;
  isOpen: boolean;
  onClose: () => void;
  onSave: (banner: Partial<Banner>) => Promise<void>;
}

import { CAMPAIGN_PRESETS, STORE_DESTINATIONS, BUTTON_PRESETS } from '../../constants';

export const AdminBannerModal: React.FC<AdminBannerModalProps> = ({
  banner,
  defaultPlacement = 'HERO_SLIDER',
  isOpen,
  onClose,
  onSave
}) => {
  const { isRTL, t } = useLanguage();
  const { products = [], coupons = [] } = useStoreData();

  const [formData, setFormData] = useState<Partial<Banner>>(() => ({
    placement: defaultPlacement,
    type: 'IMAGE',
    isActive: true,
    displayOrder: 1,
    titleEn: '',
    titleAr: '',
    subtitleEn: '',
    subtitleAr: '',
    tagEn: '',
    tagAr: '',
    buttonTextEn: 'EXPLORE COLLECTION',
    buttonTextAr: 'استكشف التشكيلة',
    buttonLink: '/collections/men',
    secondaryButtonTextEn: '',
    secondaryButtonTextAr: '',
    secondaryButtonLink: '',
    discountCode: '',
    desktopImageUrl: '',
    mobileImageUrl: '',
    startDate: '',
    endDate: '',
    targetAudience: 'ALL',
    ...banner
  }));

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isUploadingDesktop, setIsUploadingDesktop] = useState(false);
  const [isUploadingMobile, setIsUploadingMobile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [desktopUrlInput, setDesktopUrlInput] = useState('');
  const [mobileUrlInput, setMobileUrlInput] = useState('');
  const [linkMode, setLinkMode] = useState<'preset' | 'product' | 'custom'>('preset');

  React.useEffect(() => {
    if (banner) {
      setFormData({
        placement: defaultPlacement,
        type: 'IMAGE',
        isActive: true,
        displayOrder: 1,
        titleEn: '',
        titleAr: '',
        subtitleEn: '',
        subtitleAr: '',
        tagEn: '',
        tagAr: '',
        buttonTextEn: 'EXPLORE COLLECTION',
        buttonTextAr: 'استكشف التشكيلة',
        buttonLink: '/collections/men',
        secondaryButtonTextEn: '',
        secondaryButtonTextAr: '',
        secondaryButtonLink: '',
        discountCode: '',
        desktopImageUrl: '',
        mobileImageUrl: '',
        startDate: '',
        endDate: '',
        targetAudience: 'ALL',
        ...banner
      });
      setDesktopUrlInput(banner.desktopImageUrl || '');
      setMobileUrlInput(banner.mobileImageUrl || '');
    } else {
      setFormData({
        placement: defaultPlacement,
        type: 'IMAGE',
        isActive: true,
        displayOrder: 1,
        titleEn: '',
        titleAr: '',
        subtitleEn: '',
        subtitleAr: '',
        tagEn: '',
        tagAr: '',
        buttonTextEn: 'EXPLORE COLLECTION',
        buttonTextAr: 'استكشف التشكيلة',
        buttonLink: '/collections/men',
        secondaryButtonTextEn: '',
        secondaryButtonTextAr: '',
        secondaryButtonLink: '',
        discountCode: '',
        desktopImageUrl: '',
        mobileImageUrl: '',
        startDate: '',
        endDate: '',
        targetAudience: 'ALL'
      });
      setDesktopUrlInput('');
      setMobileUrlInput('');
    }
  }, [banner, defaultPlacement, isOpen]);

  if (!isOpen) return null;

  // Apply a full campaign preset into the form with 1 click
  const handleApplyPreset = (presetId: string) => {
    const p = CAMPAIGN_PRESETS.find(x => x.id === presetId);
    if (!p) return;

    setFormData(prev => ({
      ...prev,
      tagAr: p.tagAr,
      tagEn: p.tagEn,
      titleAr: p.titleAr,
      titleEn: p.titleEn,
      subtitleAr: p.subtitleAr,
      subtitleEn: p.subtitleEn,
      buttonTextAr: p.buttonTextAr,
      buttonTextEn: p.buttonTextEn,
      buttonLink: p.buttonLink,
      discountCode: p.discountCode || prev.discountCode
    }));
  };

  const handleApplyButtonPreset = (ar: string, en: string) => {
    setFormData(prev => ({
      ...prev,
      buttonTextAr: ar,
      buttonTextEn: en
    }));
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'desktopImageUrl' | 'mobileImageUrl',
    setUploading: (val: boolean) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      if (res?.fileUrl) {
        setFormData(prev => ({ ...prev, [field]: res.fileUrl }));
        return;
      }
      throw new Error('No URL returned');
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({ ...prev, [field]: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleAr && !formData.titleEn) {
      toast.error(isRTL ? 'يرجى إدخال عنوان للبانر (بالعربي أو الإنجليزي)' : 'Please enter a headline for the banner');
      return;
    }
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      console.error('Failed to save banner:', err);
      const errMsg = err?.response?.data?.message || err?.message || (isRTL ? 'فشل حفظ البانر، يرجى المحاولة مجدداً' : 'Failed to save banner');
      toast.error(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const currentImg = previewDevice === 'desktop'
    ? (formData.desktopImageUrl || formData.mobileImageUrl)
    : (formData.mobileImageUrl || formData.desktopImageUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base sm:text-lg font-editorial font-bold text-white tracking-wide">
                {formData.id ? t.adminEditCampaignBanner : t.adminCreateCampaignBanner}
              </h2>
              <span className="text-[11px] text-zinc-400">
                {t.adminBannerPresetAutoFillDesc}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form & Live Preview */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: 7 cols */}
          <form id="bannerForm" onSubmit={handleSubmit} className="lg:col-span-7 space-y-5">
            
            {/* Quick Presets Dropdown */}
            <div className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-lg space-y-2">
              <label className="block text-xs font-mono text-amber-300 font-bold flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{t.adminQuickMarketingPresets}</span>
              </label>
              <select
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) handleApplyPreset(e.target.value);
                }}
                className="w-full bg-zinc-900 border border-amber-500/40 text-amber-200 rounded p-2 text-xs font-mono focus:border-amber-400 focus:outline-none cursor-pointer"
              >
                <option value="" disabled>{t.adminChoosePresetAutoFill}</option>
                {CAMPAIGN_PRESETS.map(preset => (
                  <option key={preset.id} value={preset.id}>
                    {isRTL ? preset.labelAr : preset.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Placement & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  {t.adminPlacementLabel}
                </label>
                <select
                  value={formData.placement}
                  onChange={(e) => setFormData(prev => ({ ...prev, placement: e.target.value as BannerPlacement }))}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded p-2.5 text-xs font-mono focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="HERO_SLIDER">{t.adminHeroSliderPlacement}</option>
                  <option value="PROMO_EDITORIAL">{t.adminPromoEditorialPlacement}</option>
                  <option value="TOP_ANNOUNCEMENT">{t.adminTopAnnouncementPlacement}</option>
                  <option value="POPUP_MODAL">{t.adminPopupModalPlacement}</option>
                  <option value="COLLECTION_HEADER">{t.adminCollectionHeaderPlacement}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  {t.status}
                </label>
                <div className="flex items-center gap-3 pt-1">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isActive)}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                  <span className="text-xs font-bold text-zinc-300">
                    {formData.isActive ? t.adminActiveStatus : t.adminInactiveStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Bilingual Titles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  {t.adminHeadlineTitleAr}
                </label>
                <input
                  type="text"
                  required
                  value={formData.titleAr || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, titleAr: e.target.value }))}
                  placeholder="مثال: أحدث صيحات الملابس الجاهزة"
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded p-2.5 text-xs text-right focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  {t.adminHeadlineTitleEn}
                </label>
                <input
                  type="text"
                  required
                  value={formData.titleEn || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                  placeholder="e.g. ARCHITECTURAL FORM"
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded p-2.5 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Bilingual Subtitles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  {t.adminSubtitleParagraphAr}
                </label>
                <textarea
                  rows={2}
                  value={formData.subtitleAr || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitleAr: e.target.value }))}
                  placeholder="الوصف أو التفاصيل بالعربية..."
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded p-2 text-xs text-right focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  {t.adminSubtitleParagraphEn}
                </label>
                <textarea
                  rows={2}
                  value={formData.subtitleEn || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitleEn: e.target.value }))}
                  placeholder="Subtitle or brief details in English..."
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded p-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Tag / Badge & Coupon Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  {t.adminSeasonTagBadgeAr}
                </label>
                <input
                  type="text"
                  value={formData.tagAr || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, tagAr: e.target.value }))}
                  placeholder="تشكيلة الشتاء"
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded p-2.5 text-xs text-right focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  {t.adminSeasonTagBadgeEn}
                </label>
                <input
                  type="text"
                  value={formData.tagEn || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, tagEn: e.target.value }))}
                  placeholder="WINTER 2026"
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded p-2.5 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Coupon Dropdown Selector */}
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-amber-400" />
                  <span>{t.adminCouponCode}</span>
                </label>
                <select
                  value={formData.discountCode || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountCode: e.target.value }))}
                  className="w-full bg-zinc-900 border border-zinc-700 text-amber-300 font-mono rounded p-2.5 text-xs focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="">{t.adminNoCouponCode}</option>
                  {coupons.map(c => (
                    <option key={c.id} value={c.code}>
                      {c.code} ({c.discountPercentage}% OFF)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* CTA Destination Link Selector */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.adminButtonDestinationLink}</span>
                </label>
                <div className="flex items-center gap-1 text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setLinkMode('preset')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${linkMode === 'preset' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400'}`}
                  >
                    {t.adminStoreCollections}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkMode('product')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${linkMode === 'product' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400'}`}
                  >
                    {t.product}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkMode('custom')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${linkMode === 'custom' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400'}`}
                  >
                    {t.adminCustomLink}
                  </button>
                </div>
              </div>

              {linkMode === 'preset' && (
                <select
                  value={formData.buttonLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, buttonLink: e.target.value }))}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded p-2.5 text-xs font-mono focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  {STORE_DESTINATIONS.map(d => (
                    <option key={d.path} value={d.path}>
                      {isRTL ? d.labelAr : d.labelEn} ({d.path})
                    </option>
                  ))}
                </select>
              )}

              {linkMode === 'product' && (
                <select
                  value={formData.buttonLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, buttonLink: e.target.value }))}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded p-2.5 text-xs font-mono focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="" disabled>{t.adminChooseProductAutoFill}</option>
                  {products.map(p => (
                    <option key={p.id} value={`/product/${p.id}`}>
                      {p.name} ({p.price} EGP)
                    </option>
                  ))}
                </select>
              )}

              {linkMode === 'custom' && (
                <input
                  type="text"
                  value={formData.buttonLink || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, buttonLink: e.target.value }))}
                  placeholder="/collections/... أو https://..."
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded p-2.5 text-xs font-mono focus:border-amber-500 focus:outline-none"
                />
              )}
            </div>

            {/* Quick Button Texts Dropdown & Inputs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-zinc-400">
                  {t.adminCtaButtonText}
                </label>
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const found = BUTTON_PRESETS.find(x => x.en === e.target.value);
                    if (found) handleApplyButtonPreset(found.ar, found.en);
                  }}
                  className="bg-zinc-900 border border-zinc-700 text-zinc-300 rounded px-2 py-0.5 text-[11px] font-mono focus:outline-none cursor-pointer"
                >
                  <option value="" disabled>{t.adminChooseButtonPreset}</option>
                  {BUTTON_PRESETS.map((bp, i) => (
                    <option key={i} value={bp.en}>
                      {isRTL ? bp.ar : bp.en}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={formData.buttonTextAr || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, buttonTextAr: e.target.value }))}
                  placeholder="نص الزر بالعربية (استكشف التشكيلة)"
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded p-2 text-xs text-right focus:border-amber-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={formData.buttonTextEn || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, buttonTextEn: e.target.value }))}
                  placeholder="Button text in English (EXPLORE COLLECTION)"
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded p-2 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Responsive Media: Desktop & Mobile Images */}
            <div className="space-y-4 pt-2 border-t border-zinc-800">
              <h3 className="text-xs font-label-bold uppercase text-zinc-300 tracking-wider">
                {t.adminResponsiveImages}
              </h3>

              {/* Desktop Image */}
              <div className="space-y-2 p-3 bg-zinc-900/60 border border-zinc-800 rounded">
                <div className="flex items-center justify-between text-xs text-zinc-300">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Monitor className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.adminDesktopImage}</span>
                  </span>
                  {formData.desktopImageUrl && <span className="text-emerald-400 text-[10px]">✓ {t.adminSet}</span>}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={desktopUrlInput}
                    onChange={(e) => setDesktopUrlInput(e.target.value)}
                    placeholder="https://... أو ارفع صورة"
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white rounded px-2.5 py-1.5 text-xs font-mono focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (desktopUrlInput.trim()) {
                        setFormData(prev => ({ ...prev, desktopImageUrl: desktopUrlInput.trim() }));
                        setDesktopUrlInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs cursor-pointer"
                  >
                    {t.adminApplyBtn}
                  </button>
                  <label className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded text-xs flex items-center gap-1 cursor-pointer">
                    {isUploadingDesktop ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{t.adminCloudUpload}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'desktopImageUrl', setIsUploadingDesktop)}
                    />
                  </label>
                </div>
              </div>

              {/* Mobile Image */}
              <div className="space-y-2 p-3 bg-zinc-900/60 border border-zinc-800 rounded">
                <div className="flex items-center justify-between text-xs text-zinc-300">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.adminMobileImage}</span>
                  </span>
                  {formData.mobileImageUrl && <span className="text-emerald-400 text-[10px]">✓ {t.adminSet}</span>}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mobileUrlInput}
                    onChange={(e) => setMobileUrlInput(e.target.value)}
                    placeholder="https://... أو ارفع صورة موبايل"
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white rounded px-2.5 py-1.5 text-xs font-mono focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (mobileUrlInput.trim()) {
                        setFormData(prev => ({ ...prev, mobileImageUrl: mobileUrlInput.trim() }));
                        setMobileUrlInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs cursor-pointer"
                  >
                    {t.adminApplyBtn}
                  </button>
                  <label className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded text-xs flex items-center gap-1 border border-zinc-700 cursor-pointer">
                    {isUploadingMobile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{t.adminUploadMobile}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'mobileImageUrl', setIsUploadingMobile)}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Campaign Scheduling (Dates) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-800">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.adminStartDateOptional}</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate ? formData.startDate.substring(0, 16) : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded p-2 text-xs font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-red-400" />
                  <span>{t.adminEndDateOptional}</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate ? formData.endDate.substring(0, 16) : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded p-2 text-xs font-mono focus:outline-none"
                />
              </div>
            </div>
          </form>

          {/* Right: Live Device Mockup Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-3 flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-label-bold text-zinc-300 uppercase">
                {t.adminLiveMockupPreview}
              </span>
              <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    previewDevice === 'desktop' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Desktop Preview"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    previewDevice === 'mobile' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Mobile Preview"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mockup Frame */}
            {previewDevice === 'desktop' ? (
              <div className="w-full aspect-[16/10] bg-zinc-900 rounded-lg border border-zinc-700 overflow-hidden relative shadow-2xl flex flex-col justify-end p-4 text-white">
                {currentImg ? (
                  <img src={currentImg} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-xs font-mono">
                    {t.adminNoImage}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="relative z-10 space-y-1">
                  {formData.tagAr && (
                    <span className="inline-block bg-white text-black text-[8px] font-bold px-1.5 py-0.5 uppercase">
                      {isRTL ? formData.tagAr : formData.tagEn}
                    </span>
                  )}
                  <h4 className="font-editorial text-lg font-bold uppercase truncate">
                    {isRTL ? (formData.titleAr || t.adminHeadlineTitleAr) : (formData.titleEn || t.adminHeadlineTitleEn)}
                  </h4>
                  <p className="text-[10px] text-zinc-300 line-clamp-2">
                    {isRTL ? formData.subtitleAr : formData.subtitleEn}
                  </p>
                  {formData.buttonTextAr && (
                    <div className="pt-1">
                      <span className="inline-block bg-white text-black text-[9px] font-bold px-3 py-1 uppercase">
                        {isRTL ? formData.buttonTextAr : formData.buttonTextEn}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-56 aspect-[9/16] bg-zinc-900 rounded-2xl border-4 border-zinc-700 overflow-hidden relative shadow-2xl flex flex-col justify-end p-3 text-white">
                {currentImg ? (
                  <img src={currentImg} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-xs font-mono">
                    {t.adminMobileFrame}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                <div className="relative z-10 space-y-1">
                  <h4 className="font-editorial text-sm font-bold uppercase truncate">
                    {isRTL ? (formData.titleAr || t.adminHeadlineTitleAr) : (formData.titleEn || t.adminHeadlineTitleEn)}
                  </h4>
                  <p className="text-[9px] text-zinc-300 line-clamp-2">
                    {isRTL ? formData.subtitleAr : formData.subtitleEn}
                  </p>
                  {formData.buttonTextAr && (
                    <div className="pt-1">
                      <span className="inline-block bg-white text-black text-[8px] font-bold px-2 py-0.5 uppercase">
                        {isRTL ? formData.buttonTextAr : formData.buttonTextEn}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-end gap-3 bg-zinc-900/80 sticky bottom-0 z-20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-bold rounded cursor-pointer"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            form="bannerForm"
            disabled={isSaving}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-label-bold uppercase tracking-wider rounded flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>{t.adminSavePublishBanner}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
