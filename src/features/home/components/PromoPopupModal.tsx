import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Sparkles, Copy, Check, ArrowRight } from 'lucide-react';
import { useStoreData, useLanguage } from '@/shared';

export const PromoPopupModal: React.FC = () => {
  const { activeBanners = [], trackBannerImpression, trackBannerClick } = useStoreData();
  const { t, isRTL } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [copied, setCopied] = useState(false);

  // Find active popup modal banner
  const popupBanner = activeBanners.find(b => b.placement === 'POPUP_MODAL' && b.isActive !== false);

  useEffect(() => {
    if (!popupBanner) return;

    // Check if dismissed previously today
    const hideUntil = localStorage.getItem('eiffel_hide_popup_until');
    if (hideUntil && new Date().getTime() < parseInt(hideUntil, 10)) {
      return;
    }

    // Delayed trigger for premium feel
    const timer = setTimeout(() => {
      setIsOpen(true);
      trackBannerImpression(popupBanner.id);
    }, 2800);

    return () => clearTimeout(timer);
  }, [popupBanner, trackBannerImpression]);

  if (!isOpen || !popupBanner) return null;

  const handleClose = () => {
    if (dontShowAgain) {
      // Hide for 24 hours
      const next24h = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem('eiffel_hide_popup_until', next24h.toString());
    }
    setIsOpen(false);
  };

  const handleAction = () => {
    trackBannerClick(popupBanner.id);
    handleClose();
  };

  const handleCopy = () => {
    if (popupBanner.discountCode) {
      navigator.clipboard.writeText(popupBanner.discountCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const title = isRTL ? (popupBanner.titleAr || popupBanner.titleEn) : (popupBanner.titleEn || popupBanner.titleAr);
  const subtitle = isRTL ? (popupBanner.subtitleAr || popupBanner.subtitleEn) : (popupBanner.subtitleEn || popupBanner.subtitleAr);
  const tag = isRTL ? (popupBanner.tagAr || popupBanner.tagEn) : (popupBanner.tagEn || popupBanner.tagAr);
  const buttonText = isRTL ? (popupBanner.buttonTextAr || t.shopNow) : (popupBanner.buttonTextEn || t.shopNow);
  const buttonLink = popupBanner.buttonLink || '/collections/men';
  const imgUrl = popupBanner.desktopImageUrl || popupBanner.mobileImageUrl || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden rounded-lg flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 rtl:right-auto rtl:left-3 z-30 w-8 h-8 rounded-full bg-black/60 text-zinc-300 hover:text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Media Side */}
        <div className="md:w-5/12 h-44 md:h-auto relative bg-zinc-900 overflow-hidden">
          <img
            src={imgUrl}
            alt={title || 'Promotion'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Content Side */}
        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div>
            {tag && (
              <span className="inline-flex items-center gap-1 text-[10px] font-label-bold tracking-widest text-amber-400 uppercase mb-2">
                <Sparkles className="w-3 h-3" />
                <span>{tag}</span>
              </span>
            )}
            <h3 className="font-editorial text-2xl sm:text-3xl text-white uppercase leading-tight">
              {title}
            </h3>
            <p className="font-inter text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Discount Voucher Strip */}
          {popupBanner.discountCode && (
            <div className="p-3 bg-zinc-900 border border-dashed border-amber-500/40 rounded flex items-center justify-between gap-2">
              <div>
                <div className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono">
                  {t.exclusivePromoCode}
                </div>
                <div className="font-mono text-sm font-bold text-amber-300">
                  {popupBanner.discountCode}
                </div>
              </div>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-amber-500 text-black text-xs font-bold rounded hover:bg-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.copy}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <Link
              to={buttonLink}
              onClick={handleAction}
              className="w-full py-3 bg-white text-black hover:bg-zinc-200 text-xs font-label-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
            >
              <span>{buttonText}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-500">
              <input
                type="checkbox"
                id="dontShowPopup"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="dontShowPopup" className="cursor-pointer">
                {t.dontShowAgainToday}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
