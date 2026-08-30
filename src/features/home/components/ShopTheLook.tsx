import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Check } from 'lucide-react';
import { useStoreData, useCurrency, useLanguage, CachedImage } from '@/shared';
import { useCart } from '@/features/cart';
import { Product } from '@/types';

export const ShopTheLook: React.FC = () => {
  const { products = [], activeLooks = [] } = useStoreData();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { t, isRTL } = useLanguage();

  const [selectedLookIndex, setSelectedLookIndex] = useState(0);
  const [highlightedPinIndex, setHighlightedPinIndex] = useState<number | null>(null);
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  // If no active looks exist in database, do NOT render this section at all!
  if (!activeLooks || activeLooks.length === 0) {
    return null;
  }

  const safeIndex = selectedLookIndex >= activeLooks.length ? 0 : selectedLookIndex;
  const currentLook = activeLooks[safeIndex];
  if (!currentLook || !currentLook.imageUrl) return null;

  const title = isRTL ? (currentLook.titleAr || t.shopTheLook) : (currentLook.titleEn || t.shopTheLook);
  const subtitle = isRTL ? (currentLook.subtitleAr || t.curatedEnsemble) : (currentLook.subtitleEn || t.curatedEnsemble);
  const mainImage = currentLook.imageUrl;

  const hotspots = currentLook.hotspots || [];
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
          category: currentLook.category || 'men',
          inStock: true
        } as any;
      })
    : [];

  const handleAddToCartWithFeedback = (product: Product, id: string) => {
    addToCart(product, product.sizes?.[0] || 'M', product.colors?.[0]?.name || 'Standard', 1);
    setAddedItemIds(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [id]: false }));
    }, 1800);
  };

  return (
    <section className="py-12 sm:py-20 px-3 sm:px-8 md:px-12 max-w-[1440px] mx-auto w-full animate-fade-in">
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
        {activeLooks.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
            {activeLooks.map((look: any, idx: number) => {
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
                      ? 'bg-primary text-white dark:bg-white dark:text-black shadow-md'
                      : 'bg-surface-container-low dark:bg-zinc-900 text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white'
                  }`}
                >
                  <span>{lookTabName}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Grid: Look Interactive Visual on Left, Pieces on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Image with Hotspots */}
        <div className="lg:col-span-7 relative group aspect-[3/4] sm:aspect-[4/5] bg-surface-container-low dark:bg-zinc-900 overflow-hidden shadow-2xl">
          <CachedImage
            src={mainImage}
            alt={title}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Interactive Pins / Hotspots */}
          {hotspots.map((spot, index) => {
            const isHighlighted = highlightedPinIndex === index;
            return (
              <button
                key={spot.id || index}
                onClick={() => setHighlightedPinIndex(isHighlighted ? null : index)}
                onMouseEnter={() => setHighlightedPinIndex(index)}
                style={{
                  top: `${spot.y}%`,
                  left: `${spot.x}%`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 z-20 cursor-pointer shadow-xl ${
                  isHighlighted
                    ? 'bg-white text-black scale-125 ring-4 ring-purple-500/50'
                    : 'bg-black/75 text-white border border-white/40 backdrop-blur-sm hover:scale-110'
                }`}
              >
                <span>{index + 1}</span>

                {/* Micro Tooltip */}
                {isHighlighted && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/95 text-white text-[11px] font-sans py-1.5 px-3 rounded shadow-2xl whitespace-nowrap pointer-events-none z-30 border border-zinc-800">
                    <span className="font-semibold block">{isRTL ? (spot.titleAr || spot.titleEn) : (spot.titleEn || spot.titleAr)}</span>
                    {spot.price && spot.price > 0 ? (
                      <span className="text-purple-400 font-mono font-bold">{formatPrice(spot.price)}</span>
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Pieces Breakdown Cards */}
        {lookProducts.length > 0 && (
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container dark:border-zinc-800">
              <span className="text-xs font-label-bold uppercase tracking-widest text-secondary dark:text-zinc-400">
                {t.piecesInThisLook || (isRTL ? 'القطع المكونة للإطلالة' : 'Pieces in this Look')}
              </span>
              <span className="text-xs font-mono text-secondary dark:text-zinc-400">
                {lookProducts.length} {isRTL ? 'قطع' : 'Items'}
              </span>
            </div>

            <div className="space-y-3">
              {lookProducts.map((product, index) => {
                const isHighlighted = highlightedPinIndex === index;
                const isAdded = addedItemIds[product.id];

                return (
                  <div
                    key={product.id || index}
                    onMouseEnter={() => setHighlightedPinIndex(index)}
                    onMouseLeave={() => setHighlightedPinIndex(null)}
                    className={`p-4 flex items-center justify-between gap-4 transition-all duration-300 border ${
                      isHighlighted
                        ? 'bg-surface-container-high dark:bg-zinc-800 border-purple-500/60 shadow-lg scale-[1.02]'
                        : 'bg-surface-container-low dark:bg-zinc-900/90 border-surface-container dark:border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Numeric Index Pin Badge */}
                      <span className="w-6 h-6 shrink-0 rounded-full bg-zinc-800 text-zinc-300 text-[11px] font-mono flex items-center justify-center font-bold">
                        {index + 1}
                      </span>

                      {/* Product Thumbnail */}
                      <div className="w-12 h-14 bg-surface-container dark:bg-zinc-950 overflow-hidden shrink-0">
                        <img
                          src={product.images?.[0] || mainImage}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-primary dark:text-white truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs font-mono text-purple-400 font-semibold mt-0.5">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>

                    {/* Add to Bag Button */}
                    <button
                      onClick={() => handleAddToCartWithFeedback(product, product.id)}
                      disabled={isAdded}
                      className={`px-3 py-2 text-[11px] font-label-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200 shrink-0 cursor-pointer shadow-sm ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-primary text-white dark:bg-white dark:text-black hover:opacity-90'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{t.added || 'تمت'}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{t.addToBag || 'إضافة'}</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopTheLook;
