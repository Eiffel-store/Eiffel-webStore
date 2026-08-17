import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, AlertCircle, ExternalLink, RefreshCw, LayoutTemplate } from 'lucide-react';
import { useStoreData, useLanguage } from '@/shared';
import { HomePageSettings } from '@/types';
import { AdminHeroBannerForm } from '../components/home-editor/AdminHeroBannerForm';
import { AdminPromoBannerForm } from '../components/home-editor/AdminPromoBannerForm';
import { AdminShopLookForm } from '../components/home-editor/AdminShopLookForm';

export const AdminHomePageEditor: React.FC = () => {
  const { homeSettings, updateHomeSettings } = useStoreData();
  const { isRTL } = useLanguage();

  const [formData, setFormData] = useState<HomePageSettings>(homeSettings);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomeSettings(formData);
    setSuccessMessage(isRTL ? 'تم حفظ وتحديث الصفحة الرئيسية بنجاح!' : 'Home page contents updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-wide">
              {isRTL ? 'إدارة محتوى وبانرات الصفحة الرئيسية' : 'Home Page & Banners Customizer'}
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            {isRTL
              ? 'التحكم في صور البانرات، العناوين، الأوصاف، وأزرار التوجيه للصفحة الرئيسية للمتجر.'
              : 'Customize Hero banner, mid-page promo editorial, and lookbook visuals in real-time.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <span>{isRTL ? 'معاينة المتجر المباشرة' : 'Live Store Preview'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 rounded animate-fade-in shadow-lg">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Forms */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. Hero Banner Form */}
        <AdminHeroBannerForm
          hero={formData.hero}
          onChange={(hero) => setFormData(prev => ({ ...prev, hero }))}
        />

        {/* 2. Promo Editorial Form */}
        <AdminPromoBannerForm
          promo={formData.promoEditorial}
          onChange={(promoEditorial) => setFormData(prev => ({ ...prev, promoEditorial }))}
        />

        {/* 3. Shop The Look Form */}
        <AdminShopLookForm
          shopLook={formData.shopTheLook}
          onChange={(shopTheLook) => setFormData(prev => ({ ...prev, shopTheLook }))}
        />

        {/* Sticky Action Strip */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800 sticky bottom-4 bg-zinc-950/90 backdrop-blur-md p-4 border rounded shadow-2xl">
          <button
            type="submit"
            className="px-8 py-3 bg-white text-black hover:bg-zinc-200 text-xs font-label-bold uppercase tracking-wider flex items-center gap-2 shadow-xl cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{isRTL ? 'حفظ ونشر التعديلات فوراً' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
