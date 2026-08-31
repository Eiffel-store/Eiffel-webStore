import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Copy, Check } from 'lucide-react';
import { useLanguage, useStoreData } from '@/shared';
import { useAuthStore } from '@/stores/useAuthStore';
import toast from 'react-hot-toast';

export const NavTopAnnouncement: React.FC = () => {
  const { language, isRTL, t } = useLanguage();
  const { role } = useAuthStore();
  const { activeBanners = [], settings } = useStoreData();
  const [copiedCode, setCopiedCode] = useState(false);

  const announcementBanner = activeBanners.find(
    (b) => b.placement === 'TOP_ANNOUNCEMENT' && b.isActive !== false
  );

  const announcementTitle = announcementBanner
    ? (language === 'ar'
        ? announcementBanner.titleAr || announcementBanner.titleEn
        : announcementBanner.titleEn || announcementBanner.titleAr)
    : (language === 'ar'
        ? settings?.announcementTextAr || t.topBannerPromo
        : settings?.announcementTextEn || t.topBannerPromo);

  const announcementSub = announcementBanner
    ? (language === 'ar'
        ? announcementBanner.subtitleAr || announcementBanner.subtitleEn
        : announcementBanner.subtitleEn || announcementBanner.subtitleAr)
    : t.topBannerLocations;

  const promoCode = announcementBanner?.discountCode || 'EIFFEL10';

  const handleCopyCode = () => {
    if (promoCode) {
      navigator.clipboard.writeText(promoCode);
      setCopiedCode(true);
      toast.success(
        isRTL
          ? `تم نسخ كود الخصم (${promoCode})! 🎉`
          : `Coupon code (${promoCode}) copied! 🎉`,
        { id: 'promo-code-copy' }
      );
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="bg-primary text-white dark:bg-zinc-950 dark:text-zinc-200 text-[10px] sm:text-[11px] py-1.5 px-3 sm:px-4 font-label-bold tracking-wider sm:tracking-widest text-center border-b border-black/10 flex items-center justify-between">
      <div className="hidden md:block w-48 text-left rtl:text-right text-zinc-400 font-mono text-[10px] truncate">
        {announcementSub}
      </div>
      <div className="flex-1 text-center truncate flex items-center justify-center gap-1.5">
        <span>{announcementTitle}</span>
        {promoCode && (
          <button
            onClick={handleCopyCode}
            title="Copy Coupon Code"
            className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/25 text-white px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer"
          >
            <strong>{promoCode}</strong>
            {copiedCode ? (
              <Check className="w-2.5 h-2.5 text-emerald-400" />
            ) : (
              <Copy className="w-2.5 h-2.5 text-zinc-300" />
            )}
          </button>
        )}
      </div>
      <div className="hidden md:flex w-48 justify-end items-center gap-3 text-[10px] text-zinc-300">
        {(role === 'ROLE_ADMIN' || role === 'ROLE_STAFF') && (
          <Link
            to="/admin"
            className="text-amber-400 hover:underline flex items-center gap-1 font-bold"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>{t.adminPanel}</span>
          </Link>
        )}
        <Link to="/help" className="hover:underline">
          {t.help}
        </Link>
        <span>•</span>
        <Link to="/stores" className="hover:underline">
          {t.atelier}
        </Link>
      </div>
    </div>
  );
};
