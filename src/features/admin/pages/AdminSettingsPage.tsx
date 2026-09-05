import React, { useState } from 'react';
import { Check, AlertCircle, Loader2, Save } from 'lucide-react';
import { useStoreData, useLanguage } from '@/shared';
import { AdminContactSettingsForm } from '../components/settings/AdminContactSettingsForm';
import { AdminAnnouncementSettingsForm } from '../components/settings/AdminAnnouncementSettingsForm';
import { AdminLoyaltyVIPSettingsForm } from '../components/settings/AdminLoyaltyVIPSettingsForm';
import { AdminHomePageSectionsForm } from '../components/settings/AdminHomePageSectionsForm';
import { AdminOrderQuantityLimitsForm } from '../components/settings/AdminOrderQuantityLimitsForm';
import { AdminDataBackupCard } from '../components/settings/AdminDataBackupCard';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useStoreData();
  const { isRTL, t } = useLanguage();

  const [formSettings, setFormSettings] = useState(settings);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setError] = useState('');

  React.useEffect(() => {
    if (settings) {
      setFormSettings(settings);
    }
  }, [settings]);

  // Track dirty state per section
  const isContactDirty =
    formSettings.whatsappNumber !== settings.whatsappNumber ||
    formSettings.facebookUrl !== settings.facebookUrl ||
    formSettings.phone !== settings.phone ||
    formSettings.instagramUrl !== settings.instagramUrl;

  const isAnnouncementDirty =
    formSettings.announcementTextAr !== settings.announcementTextAr ||
    formSettings.announcementTextEn !== settings.announcementTextEn ||
    formSettings.freeShippingThreshold !== settings.freeShippingThreshold ||
    formSettings.storeName !== settings.storeName ||
    formSettings.tagline !== settings.tagline ||
    formSettings.currency !== settings.currency;

  const isLoyaltyDirty =
    formSettings.vipRequiredOrders !== settings.vipRequiredOrders ||
    formSettings.vipRequiredPoints !== settings.vipRequiredPoints ||
    formSettings.vipDiscountPercentage !== settings.vipDiscountPercentage ||
    formSettings.loyaltyCashbackRate !== settings.loyaltyCashbackRate ||
    formSettings.vipFreeShipping !== settings.vipFreeShipping;

  const isHomeSectionsDirty =
    formSettings.showHero !== settings.showHero ||
    formSettings.showCategories !== settings.showCategories ||
    formSettings.showFeaturedProducts !== settings.showFeaturedProducts ||
    formSettings.showPromoBanner !== settings.showPromoBanner ||
    formSettings.showShopTheLook !== settings.showShopTheLook;

  const isQuantityLimitsDirty =
    formSettings.minPiecesPerItem !== settings.minPiecesPerItem ||
    formSettings.maxPiecesPerItem !== settings.maxPiecesPerItem;

  const anyDirty =
    isContactDirty ||
    isAnnouncementDirty ||
    isLoyaltyDirty ||
    isHomeSectionsDirty ||
    isQuantityLimitsDirty;

  // Individual Section Save Handlers (Partial Payloads)
  const handleSaveContact = async () => {
    setSavingSection('contact');
    try {
      await updateSettings(
        {
          whatsappNumber: formSettings.whatsappNumber,
          facebookUrl: formSettings.facebookUrl,
          phone: formSettings.phone,
          instagramUrl: formSettings.instagramUrl,
        },
        {
          successMessage: isRTL ? 'تم حفظ بيانات التواصل ومواقع التواصل بنجاح' : 'Contact details and social links saved',
          toastId: 'save-contact-settings',
        }
      );
    } finally {
      setSavingSection(null);
    }
  };

  const handleSaveAnnouncement = async () => {
    setSavingSection('announcement');
    try {
      await updateSettings(
        {
          announcementTextAr: formSettings.announcementTextAr,
          announcementTextEn: formSettings.announcementTextEn,
          freeShippingThreshold: formSettings.freeShippingThreshold,
          storeName: formSettings.storeName,
          tagline: formSettings.tagline,
          currency: formSettings.currency,
        },
        {
          successMessage: isRTL ? 'تم حفظ شريط الإعلانات وهوية المتجر بنجاح' : 'Announcement and store identity saved',
          toastId: 'save-announcement-settings',
        }
      );
    } finally {
      setSavingSection(null);
    }
  };

  const handleSaveLoyalty = async () => {
    setSavingSection('loyalty');
    try {
      await updateSettings(
        {
          vipRequiredOrders: formSettings.vipRequiredOrders,
          vipRequiredPoints: formSettings.vipRequiredPoints,
          vipDiscountPercentage: formSettings.vipDiscountPercentage,
          loyaltyCashbackRate: formSettings.loyaltyCashbackRate,
          vipFreeShipping: formSettings.vipFreeShipping,
        },
        {
          successMessage: isRTL ? 'تم حفظ إعدادات تحويشة إيفل والـ VIP بنجاح' : 'VIP & Loyalty settings saved',
          toastId: 'save-loyalty-settings',
        }
      );
    } finally {
      setSavingSection(null);
    }
  };

  const handleSaveHomeSections = async () => {
    setSavingSection('sections');
    try {
      await updateSettings(
        {
          showHero: formSettings.showHero,
          showCategories: formSettings.showCategories,
          showFeaturedProducts: formSettings.showFeaturedProducts,
          showPromoBanner: formSettings.showPromoBanner,
          showShopTheLook: formSettings.showShopTheLook,
        },
        {
          successMessage: isRTL ? 'تم حفظ ظهور وتنسيق أقسام الصفحة الرئيسية بنجاح' : 'Home page sections visibility saved',
          toastId: 'save-sections-settings',
        }
      );
    } finally {
      setSavingSection(null);
    }
  };

  const handleSaveQuantityLimits = async () => {
    setSavingSection('limits');
    try {
      await updateSettings(
        {
          minPiecesPerItem: formSettings.minPiecesPerItem,
          maxPiecesPerItem: formSettings.maxPiecesPerItem,
        },
        {
          successMessage: isRTL ? 'تم حفظ حدود كميات القطعة الواحدة بنجاح' : 'Order quantity limits saved',
          toastId: 'save-limits-settings',
        }
      );
    } finally {
      setSavingSection(null);
    }
  };

  const handleSaveAll = async () => {
    setSavingSection('all');
    try {
      await updateSettings(formSettings, {
        successMessage: t.adminSettingsSavedSuccess,
        toastId: 'save-all-settings',
      });
    } finally {
      setSavingSection(null);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-wide">
            {t.adminSettings}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {t.adminSettingsDesc}
          </p>
        </div>

        {/* Global Save All Button */}
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={savingSection !== null}
          className={`px-6 py-2.5 text-xs font-label-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-200 cursor-pointer ${
            anyDirty
              ? 'bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/10'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {savingSection === 'all' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-black" />
              <span>{isRTL ? 'جاري حفظ الكل...' : 'Saving All...'}</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isRTL ? 'حفظ جميع الإعدادات' : 'Save All Settings'}</span>
              {anyDirty && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-1" />
              )}
            </>
          )}
        </button>
      </div>

      {/* Global Alerts */}
      {successMessage && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 rounded animate-fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2 rounded animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SECTION 1: Store Contact & Social Channels */}
      <div className="bg-zinc-950 border border-zinc-800 p-6 shadow-xl space-y-6">
        <AdminContactSettingsForm
          settings={formSettings}
          onChange={(updates) => setFormSettings(prev => ({ ...prev, ...updates }))}
        />
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
          <div className="text-xs">
            {isContactDirty ? (
              <span className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                {isRTL ? 'تعديلات غير محفوظة' : 'Unsaved changes'}
              </span>
            ) : (
              <span className="text-zinc-500 text-[11px] font-mono">
                {isRTL ? 'البيانات محفوظة ومتزامنة' : 'Synchronized with server'}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleSaveContact}
            disabled={savingSection !== null}
            className={`px-5 py-2.5 text-xs font-label-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-200 cursor-pointer ${
              isContactDirty
                ? 'bg-white text-black hover:bg-zinc-200 shadow-md shadow-white/10'
                : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {savingSection === 'contact' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{isRTL ? 'جاري الحفظ...' : 'Saving...'}</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isRTL ? 'حفظ بيانات التواصل' : 'Save Contact Info'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SECTION 2: Announcement Bar & Store Identity */}
      <div className="bg-zinc-950 border border-zinc-800 p-6 shadow-xl space-y-6">
        <AdminAnnouncementSettingsForm
          settings={formSettings}
          onChange={(updates) => setFormSettings(prev => ({ ...prev, ...updates }))}
        />
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
          <div className="text-xs">
            {isAnnouncementDirty ? (
              <span className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                {isRTL ? 'تعديلات غير محفوظة' : 'Unsaved changes'}
              </span>
            ) : (
              <span className="text-zinc-500 text-[11px] font-mono">
                {isRTL ? 'البيانات محفوظة ومتزامنة' : 'Synchronized with server'}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleSaveAnnouncement}
            disabled={savingSection !== null}
            className={`px-5 py-2.5 text-xs font-label-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-200 cursor-pointer ${
              isAnnouncementDirty
                ? 'bg-white text-black hover:bg-zinc-200 shadow-md shadow-white/10'
                : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {savingSection === 'announcement' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{isRTL ? 'جاري الحفظ...' : 'Saving...'}</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isRTL ? 'حفظ شريط الإعلانات والهوية' : 'Save Announcement & Identity'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SECTION 3: VIP & Loyalty Program */}
      <div className="bg-zinc-950 border border-zinc-800 p-6 shadow-xl space-y-6">
        <AdminLoyaltyVIPSettingsForm
          settings={formSettings}
          onChange={(updates) => setFormSettings(prev => ({ ...prev, ...updates }))}
        />
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
          <div className="text-xs">
            {isLoyaltyDirty ? (
              <span className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                {isRTL ? 'تعديلات غير محفوظة' : 'Unsaved changes'}
              </span>
            ) : (
              <span className="text-zinc-500 text-[11px] font-mono">
                {isRTL ? 'البيانات محفوظة ومتزامنة' : 'Synchronized with server'}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleSaveLoyalty}
            disabled={savingSection !== null}
            className={`px-5 py-2.5 text-xs font-label-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-200 cursor-pointer ${
              isLoyaltyDirty
                ? 'bg-white text-black hover:bg-zinc-200 shadow-md shadow-white/10'
                : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {savingSection === 'loyalty' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{isRTL ? 'جاري الحفظ...' : 'Saving...'}</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isRTL ? 'حفظ تحويشة إيفل والـ VIP' : 'Save VIP & Loyalty'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SECTION 4: Home Page Sections Visibility */}
      <div className="bg-zinc-950 border border-zinc-800 p-6 shadow-xl space-y-6">
        <AdminHomePageSectionsForm
          settings={formSettings}
          onChange={(updates) => setFormSettings(prev => ({ ...prev, ...updates }))}
        />
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
          <div className="text-xs">
            {isHomeSectionsDirty ? (
              <span className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                {isRTL ? 'تعديلات غير محفوظة' : 'Unsaved changes'}
              </span>
            ) : (
              <span className="text-zinc-500 text-[11px] font-mono">
                {isRTL ? 'البيانات محفوظة ومتزامنة' : 'Synchronized with server'}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleSaveHomeSections}
            disabled={savingSection !== null}
            className={`px-5 py-2.5 text-xs font-label-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-200 cursor-pointer ${
              isHomeSectionsDirty
                ? 'bg-white text-black hover:bg-zinc-200 shadow-md shadow-white/10'
                : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {savingSection === 'sections' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{isRTL ? 'جاري الحفظ...' : 'Saving...'}</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isRTL ? 'حفظ أقسام الصفحة الرئيسية' : 'Save Section Visibility'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SECTION 5: Per-Item Quantity Limits */}
      <div className="bg-zinc-950 border border-zinc-800 p-6 shadow-xl space-y-6">
        <AdminOrderQuantityLimitsForm
          settings={formSettings}
          onChange={(updates) => setFormSettings(prev => ({ ...prev, ...updates }))}
        />
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
          <div className="text-xs">
            {isQuantityLimitsDirty ? (
              <span className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                {isRTL ? 'تعديلات غير محفوظة' : 'Unsaved changes'}
              </span>
            ) : (
              <span className="text-zinc-500 text-[11px] font-mono">
                {isRTL ? 'البيانات محفوظة ومتزامنة' : 'Synchronized with server'}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleSaveQuantityLimits}
            disabled={savingSection !== null}
            className={`px-5 py-2.5 text-xs font-label-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-200 cursor-pointer ${
              isQuantityLimitsDirty
                ? 'bg-white text-black hover:bg-zinc-200 shadow-md shadow-white/10'
                : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {savingSection === 'limits' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{isRTL ? 'جاري الحفظ...' : 'Saving...'}</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isRTL ? 'حفظ حدود كميات القطعة' : 'Save Quantity Limits'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SECTION 6: JSON Backup, Restore & Factory Reset */}
      <AdminDataBackupCard
        onSuccess={(msg) => {
          setSuccessMessage(msg);
          setTimeout(() => setSuccessMessage(''), 3000);
        }}
        onError={(msg) => {
          setError(msg);
          setTimeout(() => setError(''), 3000);
        }}
      />
    </div>
  );
};

