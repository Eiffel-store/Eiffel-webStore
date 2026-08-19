import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  LayoutTemplate,
  ExternalLink,
  Eye,
  MousePointerClick,
  TrendingUp,
  Sliders,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Calendar,
  Layers,
  MessageSquare,
  Maximize2,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { useStoreData, useLanguage } from '@/shared';
import { Banner, BannerPlacement } from '@/types';
import { AdminBannerModal } from '../components/banners/AdminBannerModal';
import { AdminShopLookForm } from '../components/home-editor/AdminShopLookForm';

export const AdminHomePageEditor: React.FC = () => {
  const {
    banners = [],
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    reorderBanners,
    homeSettings,
    updateHomeSettings
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1 shadow-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>{isRTL ? 'الحملات النشطة' : 'Active Campaigns'}</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {activeCount} <span className="text-xs font-sans text-zinc-500 font-normal">/ {banners.length}</span>
          </div>
        </div>

        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1 shadow-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>{isRTL ? 'إجمالي المشاهدات' : 'Total Impressions'}</span>
            <Eye className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {totalImpressions.toLocaleString()}
          </div>
        </div>

        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1 shadow-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>{isRTL ? 'إجمالي النقرات' : 'Total Clicks'}</span>
            <MousePointerClick className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {totalClicks.toLocaleString()}
          </div>
        </div>

        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1 shadow-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>{isRTL ? 'معدل التحويل والنقر' : 'Avg Click-Through (CTR)'}</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-amber-400">
            {overallCtr}%
          </div>
        </div>
      </div>

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
        <div className="space-y-4">
          {currentTabBanners.length === 0 ? (
            <div className="p-12 text-center bg-zinc-950 border border-zinc-800 rounded-lg space-y-3">
              <ImageIcon className="w-10 h-10 text-zinc-600 mx-auto" />
              <h3 className="text-sm font-bold text-zinc-300">
                {isRTL ? 'لا توجد بانرات مضافة في هذا الموضع بعد' : 'No banners created for this placement yet'}
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                {isRTL ? 'قم بإضافة بانر جديد وتخصيص العنوان، الصور، وروابط التوجيه لنشره فوراً.' : 'Create a new banner and customize titles, images and CTA links.'}
              </p>
              <button
                onClick={handleOpenCreate}
                className="mt-2 px-4 py-2 bg-amber-500 text-black font-bold text-xs rounded hover:bg-amber-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isRTL ? 'إضافة أول بانر' : 'Add First Banner'}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {currentTabBanners.map((banner, index) => {
                const ctr = (banner.impressions || 0) > 0
                  ? (((banner.clicks || 0) / (banner.impressions || 1)) * 100).toFixed(1)
                  : '0.0';

                return (
                  <div
                    key={banner.id}
                    className={`p-4 sm:p-5 bg-zinc-950 border rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                      banner.isActive ? 'border-zinc-800 hover:border-zinc-700' : 'border-zinc-900 opacity-60'
                    }`}
                  >
                    {/* Left: Thumbnail & Details */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Image Thumbnail */}
                      <div className="w-24 h-16 sm:w-32 sm:h-20 bg-zinc-900 rounded overflow-hidden relative shrink-0 border border-zinc-800">
                        {banner.desktopImageUrl || banner.mobileImageUrl ? (
                          <img
                            src={banner.desktopImageUrl || banner.mobileImageUrl}
                            alt={banner.titleEn || 'Banner'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-[10px]">
                            {isRTL ? 'بدون صورة' : 'No Image'}
                          </div>
                        )}
                        {banner.mobileImageUrl && (
                          <span className="absolute bottom-1 right-1 bg-black/80 text-[8px] text-zinc-300 px-1 rounded font-mono">
                            +Mob
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            banner.isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-zinc-900 text-zinc-400'
                          }`}>
                            {banner.isActive ? (isRTL ? '● نشط لايف' : '● Live') : (isRTL ? '✕ معطل' : '✕ Inactive')}
                          </span>

                          {banner.tagAr && (
                            <span className="text-[9px] font-mono bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">
                              {isRTL ? banner.tagAr : banner.tagEn}
                            </span>
                          )}

                          {banner.discountCode && (
                            <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                              CODE: {banner.discountCode}
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm sm:text-base font-editorial font-bold text-white truncate">
                          {isRTL ? (banner.titleAr || banner.titleEn) : (banner.titleEn || banner.titleAr)}
                        </h3>

                        <p className="text-xs text-zinc-400 line-clamp-1">
                          {isRTL ? (banner.subtitleAr || banner.subtitleEn) : (banner.subtitleEn || banner.subtitleAr)}
                        </p>

                        {(banner.startDate || banner.endDate) && (
                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
                            <Calendar className="w-3 h-3" />
                            <span>{banner.startDate ? banner.startDate.substring(0, 10) : 'Now'}</span>
                            <span>→</span>
                            <span>{banner.endDate ? banner.endDate.substring(0, 10) : 'Forever'}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Middle: Stats */}
                    <div className="flex items-center gap-4 bg-zinc-900/60 p-2.5 rounded border border-zinc-800/80 shrink-0 font-mono text-xs">
                      <div className="text-center px-2">
                        <div className="text-zinc-500 text-[9px] uppercase">{isRTL ? 'مشاهدات' : 'Views'}</div>
                        <div className="font-bold text-white">{(banner.impressions || 0).toLocaleString()}</div>
                      </div>
                      <div className="h-6 w-px bg-zinc-800" />
                      <div className="text-center px-2">
                        <div className="text-zinc-500 text-[9px] uppercase">{isRTL ? 'نقرات' : 'Clicks'}</div>
                        <div className="font-bold text-white">{(banner.clicks || 0).toLocaleString()}</div>
                      </div>
                      <div className="h-6 w-px bg-zinc-800" />
                      <div className="text-center px-2">
                        <div className="text-zinc-500 text-[9px] uppercase">CTR</div>
                        <div className="font-bold text-amber-400">{ctr}%</div>
                      </div>
                    </div>

                    {/* Right: Controls & Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      {/* Reorder Buttons (for Sliders) */}
                      {currentTabBanners.length > 1 && (
                        <div className="flex items-center bg-zinc-900 rounded border border-zinc-800">
                          <button
                            onClick={() => handleMove(index, 'up')}
                            disabled={index === 0}
                            className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMove(index, 'down')}
                            disabled={index === currentTabBanners.length - 1}
                            className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Active Status Switch */}
                      <button
                        onClick={() => handleToggle(banner.id)}
                        className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
                          banner.isActive
                            ? 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800'
                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        }`}
                      >
                        {banner.isActive ? (isRTL ? 'تفعيل' : 'Active') : (isRTL ? 'تعطيل' : 'Off')}
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEdit(banner)}
                        className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded border border-zinc-800 transition-colors cursor-pointer"
                        title="Edit Banner"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="p-2 bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-400 rounded border border-zinc-800 transition-colors cursor-pointer"
                        title="Delete Banner"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Admin Banner Modal (Create / Edit) */}
      {isModalOpen && (
        <AdminBannerModal
          banner={selectedBanner}
          defaultPlacement={activeTab !== 'SHOP_THE_LOOK' ? activeTab : 'HERO_SLIDER'}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveBanner}
        />
      )}
    </div>
  );
};
