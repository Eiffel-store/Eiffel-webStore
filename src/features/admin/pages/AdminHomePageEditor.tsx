import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  LayoutTemplate,
  ExternalLink,
  Sliders,
  Sparkles,
  Layers,
  MessageSquare,
  Maximize2,
  Check
} from 'lucide-react';
import { useStoreData, useLanguage, EiffelLoader } from '@/shared';
import { Banner, BannerPlacement } from '@/types';
import { AdminBannerModal } from '../components/banners/AdminBannerModal';
import { AdminShopLookForm } from '../components/home-editor/AdminShopLookForm';
import { AdminBannerStatsCards } from '../components/home-editor/AdminBannerStatsCards';
import { AdminBannerList } from '../components/home-editor/AdminBannerList';

export const AdminHomePageEditor: React.FC = () => {
  const {
    banners = [],
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    reorderBanners,
    homeSettings,
    updateHomeSettings,
    isBannersLoading
  } = useStoreData();

  const { isRTL } = useLanguage();

  const [activeTab, setActiveTab] = useState<BannerPlacement | 'SHOP_THE_LOOK'>('HERO_SLIDER');
  const [selectedBanner, setSelectedBanner] = useState<Partial<Banner> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Filter banners for current active tab
  const currentTabBanners = banners.filter(b => b.placement === activeTab);

  // Overall analytics metrics
  const totalImpressions = banners.reduce((sum, b) => sum + (b.impressions || 0), 0);
  const totalClicks = banners.reduce((sum, b) => sum + (b.clicks || 0), 0);
  const overallCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0.0';
  const activeCount = banners.filter(b => b.isActive).length;

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  const handleOpenCreate = () => {
    setSelectedBanner(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsModalOpen(true);
  };

  const handleSaveBanner = async (bannerData: Partial<Banner>) => {
    if (bannerData.id) {
      await updateBanner(bannerData.id, bannerData);
      showSuccess(isRTL ? 'تم تحديث البانر بنجاح' : 'Banner updated successfully');
    } else {
      await addBanner(bannerData);
      showSuccess(isRTL ? 'تمت إضافة البانر الجديد بنجاح' : 'New banner added successfully');
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (window.confirm(isRTL ? 'هل أنت متأكد من حذف هذا البانر نهائياً؟' : 'Are you sure you want to delete this banner?')) {
      await deleteBanner(id);
      showSuccess(isRTL ? 'تم حذف البانر' : 'Banner deleted');
    }
  };

  const handleToggle = async (id: string) => {
    await toggleBannerStatus(id);
    showSuccess(isRTL ? 'تم تغيير حالة تفعيل البانر' : 'Banner status updated');
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const list = [...currentTabBanners];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);

    const ids = list.map(b => b.id);
    await reorderBanners(ids);
    showSuccess(isRTL ? 'تم تحديث ترتيب البانرات' : 'Banners reordered');
  };

  if (isBannersLoading && banners.length === 0) {
    return (
      <div className="py-24">
        <EiffelLoader message={isRTL ? 'جاري جلب إعدادات وبانرات الواجهة الرئيسية...' : 'Loading home page CMS editor...'} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-wide">
              {isRTL ? 'إدارة الحملات والبانرات التفاعلية' : 'Campaigns & Dynamic Banners CMS'}
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            {isRTL
              ? 'التحكم في سلايدر البداية، البانرات الترويجية، الأشرطة العلوية، النوافذ المنبثقة، وتتبع نسب التحويل (CTR).'
              : 'Manage hero carousels, editorial promos, announcement strips, popups, and track CTR conversion live.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 rounded text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{isRTL ? 'معاينة المتجر المباشر' : 'Live Storefront'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {activeTab !== 'SHOP_THE_LOOK' && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-label-bold text-xs uppercase tracking-wider rounded flex items-center gap-1.5 shadow-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isRTL ? 'إضافة بانر جديد' : 'New Banner'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2 rounded shadow-xl animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Performance Analytics Metric Cards */}
      <AdminBannerStatsCards
        activeCount={activeCount}
        totalBanners={banners.length}
        totalImpressions={totalImpressions}
        totalClicks={totalClicks}
        overallCtr={overallCtr}
      />

      {/* Navigation Placement Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-2">
        {[
          { id: 'HERO_SLIDER', label: isRTL ? 'سلايدر الهيرو الرئيسي' : 'Hero Slider', icon: Sliders, count: banners.filter(b => b.placement === 'HERO_SLIDER').length },
          { id: 'PROMO_EDITORIAL', label: isRTL ? 'بانر العروض الترويجي' : 'Promo Editorial', icon: Layers, count: banners.filter(b => b.placement === 'PROMO_EDITORIAL').length },
          { id: 'TOP_ANNOUNCEMENT', label: isRTL ? 'الشريط العلوي' : 'Top Announcement', icon: MessageSquare, count: banners.filter(b => b.placement === 'TOP_ANNOUNCEMENT').length },
          { id: 'POPUP_MODAL', label: isRTL ? 'نافذة العروض المنبثقة' : 'Popup Modal', icon: Maximize2, count: banners.filter(b => b.placement === 'POPUP_MODAL').length },
          { id: 'SHOP_THE_LOOK', label: isRTL ? 'تسوق الإطلالة (Lookbook)' : 'Shop The Look', icon: Sparkles, count: null }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-black font-bold shadow-lg'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-black/15 text-black' : 'bg-zinc-800 text-zinc-300'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'SHOP_THE_LOOK' ? (
        <div className="space-y-6">
          <AdminShopLookForm
            shopLook={homeSettings.shopTheLook}
            onChange={(shopTheLook) => updateHomeSettings({ shopTheLook })}
          />
        </div>
      ) : (
        <AdminBannerList
          banners={currentTabBanners}
          onOpenCreate={handleOpenCreate}
          onOpenEdit={handleOpenEdit}
          onToggleStatus={handleToggle}
          onDelete={handleDeleteBanner}
          onMove={handleMove}
        />
      )}

      {/* Create / Edit Modal Dialog */}
      <AdminBannerModal
        isOpen={isModalOpen}
        banner={selectedBanner}
        defaultPlacement={activeTab === 'SHOP_THE_LOOK' ? 'HERO_SLIDER' : activeTab}
        onClose={() => setIsModalOpen(false)}
        onSave={async (data) => {
          await handleSaveBanner(data);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};
