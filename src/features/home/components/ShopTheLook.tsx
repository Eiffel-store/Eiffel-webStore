import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Check } from 'lucide-react';
import { useStoreData, useCurrency, useLanguage, CachedImage } from '@/shared';
import { useCart } from '@/features/cart';
import { Look, Product } from '@/types';

export const ShopTheLook: React.FC = () => {
  const { products = [], activeLooks = [], homeSettings } = useStoreData();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { t, isRTL } = useLanguage();

  const [selectedLookIndex, setSelectedLookIndex] = useState(0);
  const [highlightedPinIndex, setHighlightedPinIndex] = useState<number | null>(null);
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  // Fallback look from homeSettings if no database looks exist yet
  const fallbackLook: Partial<Look> | null = homeSettings?.shopTheLook?.imageUrl ? {
    id: 'legacy-home-look',
    titleAr: homeSettings.shopTheLook.titleAr || t.shopTheLook,
    titleEn: homeSettings.shopTheLook.titleEn || t.shopTheLook,
    subtitleAr: homeSettings.shopTheLook.subtitleAr || t.curatedEnsemble,
    subtitleEn: homeSettings.shopTheLook.subtitleEn || t.curatedEnsemble,
    imageUrl: homeSettings.shopTheLook.imageUrl,
    hotspots: homeSettings.shopTheLook.hotspots || [],
    category: 'men'
  } : null;

  const displayLooks: Partial<Look>[] = activeLooks.length > 0
    ? activeLooks
    : (fallbackLook ? [fallbackLook] : []);

  // If no looks and no products exist, do not render empty section
  if (displayLooks.length === 0 && (!products || products.length === 0)) {
    return null;
  }

  const safeIndex = selectedLookIndex >= displayLooks.length ? 0 : selectedLookIndex;
  const currentLook = displayLooks[safeIndex] || displayLooks[0];
  const title = isRTL ? (currentLook?.titleAr || t.shopTheLook) : (currentLook?.titleEn || t.shopTheLook);
  const subtitle = isRTL ? (currentLook?.subtitleAr || t.curatedEnsemble) : (currentLook?.subtitleEn || t.curatedEnsemble);
  const mainImage = currentLook?.imageUrl || products?.[0]?.images?.[0] || 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop';

  const hotspots = currentLook?.hotspots || [];
  const lookProducts = hotspots.length > 0
    ? hotspots.map(spot => {
        const matching = products.find(p => p.id === spot.productId);
        if (matching) return matching;
        return {
          id: spot.productId || spot.id,
          name: isRTL ? (spot.titleAr || spot.titleEn) : (spot.titleEn || spot.titleAr),
          subtitle: isRTL ? spot.titleEn : spot.titleAr,
          price: spot.price || 0,
          images: [mainImage],
          category: currentLook?.category || 'men',
          inStock: true
        } as any;
      })
    : (products || []).slice(0, 3);

  const handleAddToCartWithFeedback = (product: Product, id: string) => {
    addToCart(product, product.sizes?.[0] || 'M', product.colors?.[0]?.name || 'Standard', 1);
    setAddedItemIds(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [id]: false }));
    }, 1800);
  };

  return (
    <section className="py-12 sm:py-20 px-3 sm:px-8 md:px-12 max-w-[1440px] mx-auto w-full">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 pb-4 border-b border-surface-container dark:border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-label-bold text-secondary dark:text-zinc-400 uppercase tracking-widest">
              {subtitle}
            </span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl text-primary dark:text-white uppercase">
            {title}
          </h2>
        </div>

        {/* Multi-Look Selection Category Tabs */}
        {displayLooks.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
            {displayLooks.map((look: any, idx: number) => {
              const isActive = idx === safeIndex;
              const lookTabName = isRTL ? (look.categoryAr || look.titleAr || `إطلالة ${idx + 1}`) : (look.categoryEn || look.titleEn || `Look ${idx + 1}`);

              return (
                <button
                  key={look.id || idx}
                  onClick={() => {
                    setSelectedLookIndex(idx);
                    setHighlightedPinIndex(null);
                  }}
                  className={`px-4 py-2 text-xs font-label-bold tracking-wider uppercase whitespace-nowrap rounded-full transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30 scale-105'
                      : 'bg-surface-container dark:bg-zinc-900 text-secondary dark:text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-purple-400 animate-ping' : 'bg-zinc-500'}`} />
                  <span>{lookTabName}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Grid: Visual with Pins + Products List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
        
        {/* Editorial Visual with Numbered Hotspot Pins */}
        <div className="lg:col-span-7 relative aspect-[3/4] sm:aspect-[4/3] lg:aspect-[3/4] bg-zinc-950 overflow-hidden shadow-2xl group rounded-xl border border-surface-container dark:border-zinc-800">
          <CachedImage
            key={currentLook?.id || selectedLookIndex}
            src={mainImage}
            alt={title}
            width={1000}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />

          {/* Interactive Pins Overlay */}
          {hotspots.map((spot, idx) => {
            const isHighlighted = highlightedPinIndex === idx;

            return (
              <div
                key={spot.id || idx}
                style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                onMouseEnter={() => setHighlightedPinIndex(idx)}
                onMouseLeave={() => setHighlightedPinIndex(null)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center font-bold text-[11px] font-mono shadow-2xl transition-all duration-300 cursor-pointer z-30 ${
                  isHighlighted
                    ? 'w-9 h-9 bg-purple-500 text-white ring-4 ring-purple-300 scale-125 z-40'
                    : 'w-7 h-7 bg-white text-black border-2 border-black hover:scale-110 hover:bg-purple-100'
                }`}
                title={`${isRTL ? (spot.titleAr || spot.titleEn) : (spot.titleEn || spot.titleAr)} (${spot.price || 0} EGP)`}
              >
                <span>{idx + 1}</span>

                {/* Hotspot Floating Tooltip */}
                <div
                  className={`absolute bottom-full mb-2 whitespace-nowrap px-3 py-1.5 bg-black/95 text-white text-[11px] rounded-md font-sans shadow-2xl border border-zinc-700 pointer-events-none transition-all duration-200 ${
                    isHighlighted ? 'opacity-100 scale-100 -translate-y-1' : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  <div className="font-bold">{isRTL ? (spot.titleAr || spot.titleEn) : (spot.titleEn || spot.titleAr)}</div>
                  <div className="text-[10px] text-purple-300 font-mono">{formatPrice(spot.price || 0)}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Products in this Look */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-label-bold tracking-widest text-secondary dark:text-zinc-400 uppercase">
              {t.piecesInThisLook}
            </h3>
            <span className="text-[11px] text-zinc-500 font-mono">
              {lookProducts.length} {isRTL ? 'قطع' : 'items'}
            </span>
          </div>

          <div className="space-y-3">
            {lookProducts.map((product: any, idx: number) => {
              if (!product) return null;
              const prodImg = product.images?.[0] || mainImage;
              const isPinHighlighted = highlightedPinIndex === idx;
              const isAdded = addedItemIds[product.id || String(idx)];

              return (
                <div
                  key={product.id || idx}
                  onMouseEnter={() => setHighlightedPinIndex(idx)}
                  onMouseLeave={() => setHighlightedPinIndex(null)}
                  className={`flex items-center justify-between p-3.5 bg-surface-container-low dark:bg-zinc-900 border transition-all duration-300 rounded-lg group ${
                    isPinHighlighted
                      ? 'border-purple-500 bg-purple-950/10 dark:bg-purple-950/20 shadow-md ring-1 ring-purple-500/40 -translate-y-0.5'
                      : 'border-surface-container dark:border-zinc-800 hover:border-primary/50 dark:hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className={`w-6 h-6 rounded-full text-xs font-mono font-bold flex items-center justify-center shrink-0 transition-colors ${
                      isPinHighlighted
                        ? 'bg-purple-600 text-white'
                        : 'bg-zinc-800 text-zinc-300 group-hover:bg-zinc-700'
                    }`}>
                      {idx + 1}
                    </span>

                    <div className="w-14 h-18 rounded-md overflow-hidden bg-zinc-800 shrink-0">
                      <CachedImage
                        src={prodImg}
                        alt={product.name || 'Product'}
                        width={120}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 pr-2">
                      <h4 className="font-editorial text-sm font-bold text-primary dark:text-white truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-secondary dark:text-purple-300 font-mono font-bold mt-0.5">
                        {formatPrice(product.price || 0)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCartWithFeedback(product, product.id || String(idx))}
                    className={`px-3.5 py-2.5 text-xs font-label-bold tracking-wider uppercase flex items-center gap-1.5 shrink-0 rounded-md cursor-pointer transition-all duration-200 ${
                      isAdded
                        ? 'bg-emerald-600 text-white scale-95'
                        : 'bg-primary text-white dark:bg-white dark:text-black hover:opacity-90 hover:shadow-md'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{t.added}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{t.add}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopTheLook;
