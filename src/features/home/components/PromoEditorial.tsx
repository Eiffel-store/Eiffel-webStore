import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { useStoreData, useCurrency, useLanguage } from '@/shared';
import { useCart } from '@/features/cart';

export const PromoEditorial: React.FC = () => {
  const { products, homeSettings, activeBanners = [], trackBannerImpression, trackBannerClick } = useStoreData();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { t, isRTL } = useLanguage();

  // Find active dynamic promo editorial banner
  const dynamicPromo = activeBanners.find(b => b.placement === 'PROMO_EDITORIAL' && b.isActive !== false);
  const staticPromo = homeSettings?.promoEditorial;

  const promoId = dynamicPromo?.id;
  const trackedRef = useRef(false);

  useEffect(() => {
    if (promoId && !trackedRef.current) {
      trackBannerImpression(promoId);
      trackedRef.current = true;
    }
  }, [promoId, trackBannerImpression]);

  const featuredProduct = (products && products.length > 0)
    ? (products.find(p => p && p.originalPrice && p.originalPrice > p.price) || products[0])
    : null;

  // If no dynamic promo, no custom promo in DB, and no products, don't render empty dummy container
  if (!dynamicPromo && !staticPromo?.titleAr && !staticPromo?.titleEn && !featuredProduct) {
    return null;
  }

  const badge = isRTL
    ? (dynamicPromo?.tagAr || staticPromo?.badgeAr || t.promoCapsule)
    : (dynamicPromo?.tagEn || staticPromo?.badgeEn || t.promoCapsule);

  const title = isRTL
    ? (dynamicPromo?.titleAr || staticPromo?.titleAr || featuredProduct?.name || 'EIFFEL CAPSULE')
    : (dynamicPromo?.titleEn || staticPromo?.titleEn || featuredProduct?.name || 'EIFFEL CAPSULE');

  const description = isRTL
    ? (dynamicPromo?.subtitleAr || staticPromo?.descriptionAr || featuredProduct?.subtitle || t.promoDesc)
    : (dynamicPromo?.subtitleEn || staticPromo?.descriptionEn || featuredProduct?.subtitle || t.promoDesc);

  const buttonText = isRTL
    ? (dynamicPromo?.buttonTextAr || staticPromo?.buttonTextAr || t.acquirePiece)
    : (dynamicPromo?.buttonTextEn || staticPromo?.buttonTextEn || t.acquirePiece);

  const buttonLink = dynamicPromo?.buttonLink || staticPromo?.buttonLink || (featuredProduct ? `/product/${featuredProduct.id}` : '/collections/offers');

  const discountBadge = isRTL
    ? (dynamicPromo?.discountCode ? `كود الخصم: ${dynamicPromo.discountCode}` : staticPromo?.discountBadgeAr || t.promoTailoringNotice)
    : (dynamicPromo?.discountCode ? `CODE: ${dynamicPromo.discountCode}` : staticPromo?.discountBadgeEn || t.promoTailoringNotice);

  const desktopImg = dynamicPromo?.desktopImageUrl || staticPromo?.imageUrl || featuredProduct?.images?.[0] || 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop';
  const mobileImg = dynamicPromo?.mobileImageUrl || desktopImg;

  const handleCtaClick = () => {
    if (promoId) {
      trackBannerClick(promoId);
    }
  };

  return (
    <section className="bg-surface-container-low dark:bg-zinc-900 py-10 sm:py-16 px-3 sm:px-8 md:px-12 border-y border-surface-container dark:border-zinc-800">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Banner Responsive Media */}
        <div className="lg:col-span-7 relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-zinc-950 shadow-md group">
          <picture>
            <source media="(max-width: 640px)" srcSet={mobileImg} />
            <img
              src={desktopImg}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </picture>
          <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 bg-primary text-white dark:bg-white dark:text-black text-[9px] sm:text-[10px] font-label-bold tracking-widest px-2.5 py-1 uppercase shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{badge}</span>
          </div>
        </div>

        {/* Content Side */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-4 sm:space-y-6 lg:pl-6 rtl:lg:pl-0 rtl:lg:pr-6">
          <div>
            <span className="text-[10px] sm:text-xs font-label-bold tracking-widest text-secondary dark:text-zinc-400 uppercase">
              {t.exclusiveBadge}
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl text-primary dark:text-white leading-[1.0] sm:leading-[0.95] mt-1">
              {title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-secondary dark:text-zinc-300 leading-relaxed font-light">
            {description}
          </p>

          {featuredProduct && (
            <div className="flex flex-wrap items-baseline gap-3 pt-1">
              <span className="font-mono text-xl sm:text-2xl font-bold text-primary dark:text-white">{formatPrice(featuredProduct.price || 0)}</span>
              {featuredProduct.originalPrice && (
                <span className="text-xs font-mono text-secondary line-through">{formatPrice(featuredProduct.originalPrice)}</span>
              )}
              <span className="text-xs font-label-bold text-emerald-600 dark:text-emerald-400">{discountBadge}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to={buttonLink}
              onClick={handleCtaClick}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>{buttonText}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
            {featuredProduct && (
              <button
                onClick={() => addToCart(featuredProduct)}
                className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 border border-primary dark:border-white font-label-bold text-xs tracking-widest uppercase text-primary dark:text-white hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-black transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.quickAdd}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
