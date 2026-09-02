import React, { useState, Suspense, lazy } from 'react';
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
  Check,
  Clock
} from 'lucide-react';
import { useStoreData, useLanguage, AdminTableSkeleton } from '@/shared';
import { Banner, BannerPlacement } from '@/types';
import { AdminBannerStatsCards } from '../components/home-editor/AdminBannerStatsCards';
import { AdminBannerList } from '../components/home-editor/AdminBannerList';

// Lazy-Loaded Subcomponents & Modals
const AdminBannerModal = lazy(() => import('../components/banners/AdminBannerModal').then(m => ({ default: m.AdminBannerModal })));
const AdminShopTheLookManager = lazy(() => import('../components/home-editor/AdminShopTheLookManager').then(m => ({ default: m.AdminShopTheLookManager })));


export const AdminHomePageEditor: React.FC = () => {
  const {
    settings,
    updateSettings,
    banners = [],
    looks = [],
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    reorderBanners,
    isBannersLoading
  } = useStoreData();

  const { isRTL, t } = useLanguage();

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
      showSuccess(t.adminBannerUpdatedSuccess);
    } else {
      await addBanner(bannerData);
      showSuccess(t.adminBannerCreatedSuccess);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    await deleteBanner(id);
    showSuccess(t.adminBannerDeleted);
  };

  const handleToggle = async (id: string) => {
    await toggleBannerStatus(id);
    showSuccess(t.adminBannerStatusUpdated);
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const list = [...currentTabBanners];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);

    const ids = list.map(b => b.id);
    await reorderBanners(ids);
    showSuccess(t.adminBannersReordered);
  };

  if (isBannersLoading && banners.length === 0) {
    return (
      <div className="py-24">
        <AdminTableSkeleton />
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
              {t.adminHomeBanners}
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            {t.adminCampaignsBannersDesc}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{t.adminLiveStorefront}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {activeTab !== 'SHOP_THE_LOOK' && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-label-bold text-xs uppercase tracking-wider rounded flex items-center gap-1.5 shadow-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.adminAddBanner}</span>
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
          { id: 'HERO_SLIDER', label: t.adminHeroSliderPlacement, icon: Sliders, count: banners.filter(b => b.placement === 'HERO_SLIDER').length },
          { id: 'PROMO_EDITORIAL', label: t.adminPromoEditorialPlacement, icon: Layers, count: banners.filter(b => b.placement === 'PROMO_EDITORIAL').length },
          { id: 'TOP_ANNOUNCEMENT', label: t.adminTopAnnouncementPlacement, icon: MessageSquare, count: banners.filter(b => b.placement === 'TOP_ANNOUNCEMENT').length },
          { id: 'POPUP_MODAL', label: t.adminPopupModalPlacement, icon: Maximize2, count: banners.filter(b => b.placement === 'POPUP_MODAL').length },
          { id: 'SHOP_THE_LOOK', label: t.adminShopTheLookPlacement, icon: Sparkles, count: looks.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
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
        <Suspense fallback={<AdminTableSkeleton />}>
          <AdminShopTheLookManager />
        </Suspense>
      ) : (
        <div className="space-y-4">
          {/* Quick Hero Slider Settings Bar */}
          {activeTab === 'HERO_SLIDER' && (
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isRTL ? 'مدة تبديل السلايدر التلقائي' : 'Hero Slider Auto-Transition Speed'}
                  </span>
                  <span className="text-[11px] text-zinc-400 block mt-0.5">
                    {isRTL
                      ? 'حدد سرعة الانتقال بين البنرات عند وجود أكثر من بنر نشط.'
                      : 'Configure transition duration when multiple active banners exist.'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer select-none px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-300 font-mono hover:border-zinc-700">
                  <span>{isRTL ? 'تفعيل التبديل' : 'Auto Play'}</span>
                  <input
                    type="checkbox"
                    checked={settings?.heroAutoPlay !== false}
                    onChange={(e) => {
                      updateSettings({ heroAutoPlay: e.target.checked });
                      showSuccess(isRTL ? 'تم حفظ إعدادات السلايدر' : 'Slider settings updated');
                    }}
                    className="accent-amber-500 w-3.5 h-3.5 cursor-pointer"
                  />
                </label>

                {[3, 5, 7, 10].map((sec) => {
                  const isSelected = (settings?.heroSliderIntervalSeconds || 5) === sec;
                  return (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => {
                        updateSettings({ heroSliderIntervalSeconds: sec });
                        showSuccess(isRTL ? `تم ضبط السرعة إلى ${sec} ثوانٍ` : `Speed set to ${sec}s`);
                      }}
                      className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-black font-bold shadow-md'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                      }`}
                    >
                      {sec} {isRTL ? 'ثوانٍ' : 's'}
                    </button>
                  );
                })}

                <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {isRTL ? 'مخصص:' : 'Custom:'}
                  </span>
                  <input
                    type="number"
                    min={2}
                    max={30}
                    value={settings?.heroSliderIntervalSeconds || 5}
                    onChange={(e) => {
                      const val = Math.max(2, Math.min(30, parseInt(e.target.value) || 5));
                      updateSettings({ heroSliderIntervalSeconds: val });
                    }}
                    className="w-12 bg-zinc-950 border border-zinc-700 px-1 py-0.5 text-xs text-white text-center font-mono rounded focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {isRTL ? 'ث' : 's'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <AdminBannerList
            banners={currentTabBanners}
            onOpenCreate={handleOpenCreate}
            onOpenEdit={handleOpenEdit}
            onToggleStatus={handleToggle}
            onDelete={handleDeleteBanner}
            onMove={handleMove}
          />
        </div>
      )}

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <Suspense fallback={null}>
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
        </Suspense>
      )}
    </div>
  );
};
