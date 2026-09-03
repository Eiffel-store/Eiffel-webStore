import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Check, AlertCircle, Truck, RotateCcw } from 'lucide-react';
import { useStoreData, useCurrency, useLanguage, CachedImage } from '@/shared';
import { useCart } from '@/features/cart';
import { Product } from '@/types';
import toast from 'react-hot-toast';

export const ShopTheLook: React.FC = () => {
  const { products = [], activeLooks = [] } = useStoreData();
  const { addToCart, openCart } = useCart();
  const { formatPrice } = useCurrency();
  const { t, language } = useLanguage();

  const [selectedLookIndex, setSelectedLookIndex] = useState(0);
  const [highlightedPinIndex, setHighlightedPinIndex] = useState<number | null>(null);
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const [addedEntireLook, setAddedEntireLook] = useState(false);

  // If no active looks exist in database, do NOT render this section at all!
  if (!activeLooks || activeLooks.length === 0) {
    return null;
  }

  const safeIndex = selectedLookIndex >= activeLooks.length ? 0 : selectedLookIndex;
  const currentLook = activeLooks[safeIndex];
  if (!currentLook || !currentLook.imageUrl) return null;

  const isArabic = language === 'ar';
  const title = (isArabic ? currentLook.titleAr : currentLook.titleEn) || t.shopTheLook;
  const subtitle = (isArabic ? currentLook.subtitleAr : currentLook.subtitleEn) || t.curatedEnsemble;
  const mainImage = currentLook.imageUrl;

  const hotspots = currentLook.hotspots || [];
  const lookProducts = hotspots.length > 0
    ? hotspots.map(spot => {
        const matching = products.find(p => p.id === spot.productId);
        if (matching) return matching;
        return {
          id: spot.productId || spot.id,
          name: (isArabic ? spot.titleAr : spot.titleEn) || (isArabic ? spot.titleEn : spot.titleAr),
          subtitle: isArabic ? spot.titleEn : spot.titleAr,
          price: spot.price || 0,
          images: [mainImage],
          category: currentLook.category || 'men',
          inStock: true
        } as any;
      })
    : [];

  const isProductOutOfStock = (p: any) => {
    if (p.stock !== undefined) return p.stock <= 0;
    return p.inStock === false;
  };

  const inStockPieces = lookProducts.filter(p => !isProductOutOfStock(p));
  const outOfStockPieces = lookProducts.filter(p => isProductOutOfStock(p));
  const totalLookPrice = lookProducts.reduce((sum, p) => sum + (p.price || 0), 0);
  const isAllOutOfStock = lookProducts.length > 0 && inStockPieces.length === 0;
  const hasOutOfStockPiece = outOfStockPieces.length > 0;

  const handleAddToCartWithFeedback = (product: Product, id: string) => {
    if (isProductOutOfStock(product)) {
      toast.error(
        isArabic
          ? `عذراً، قطعة "${product.nameAr || product.name}" غير متوفرة في المخزون حالياً.`
          : `Sorry, "${product.name}" is currently out of stock.`
      );
      return;
    }
    addToCart(product, product.sizes?.[0] || 'M', product.colors?.[0]?.name || 'Standard', 1);
    setAddedItemIds(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [id]: false }));
    }, 1800);
  };

  const handleAddEntireLookToBag = () => {
    if (lookProducts.length === 0) return;

    if (isAllOutOfStock) {
      toast.error(
        isArabic
          ? 'عذراً، جميع قطع هذا الطقم غير متوفرة في المخزون حالياً.'
          : 'Sorry, all items in this look are currently out of stock.'
      );
      return;
    }

    // Alert if some pieces are sold out
    if (hasOutOfStockPiece) {
      const outNames = outOfStockPieces
        .map(p => (isArabic ? p.nameAr : p.nameEn) || p.name)
        .join('، ');
      toast.error(
        isArabic
          ? `تنبيه: القطعة (${outNames}) غير متوفرة في المخزون حالياً ولن تتم إضافتها.`
          : `Notice: Item (${outNames}) is out of stock and was skipped.`,
        { duration: 4500, id: 'look-out-of-stock-alert' }
      );
    }

    let addedCount = 0;
    inStockPieces.forEach(product => {
      const size = product.sizes?.[0] || 'M';
      const color = product.colors?.[0]?.name || 'Standard';
      const success = addToCart(product, size, color, 1);
      if (success) addedCount++;
    });

    if (addedCount > 0) {
      setAddedEntireLook(true);
      setTimeout(() => setAddedEntireLook(false), 2500);

      toast.success(
        hasOutOfStockPiece
          ? (isArabic
              ? `تمت إضافة ${addedCount} قطع متوفرة من الطقم إلى حقيبتك!`
              : `Added ${addedCount} available pieces to your bag!`)
          : (isArabic
              ? 'تمت إضافة الطقم كاملاً بنجاح إلى حقيبة التسوق!'
              : 'Complete look added to your shopping bag!'),
        { icon: '🛍️', id: 'look-added-success' }
      );

      openCart();
    }
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
              const lookTabName = (isArabic ? (look.categoryAr || look.titleAr) : (look.categoryEn || look.titleEn)) || t.lookNumber.replace('{number}', String(idx + 1));

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
                    <span className="font-semibold block">{(isArabic ? spot.titleAr : spot.titleEn) || (isArabic ? spot.titleEn : spot.titleAr)}</span>
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
                {t.piecesInThisLook}
              </span>
              <span className="text-xs font-mono text-secondary dark:text-zinc-400">
                {lookProducts.length} {t.items}
              </span>
            </div>

            <div className="space-y-3">
              {lookProducts.map((product, index) => {
                const isHighlighted = highlightedPinIndex === index;
                const isAdded = addedItemIds[product.id];
                const isOutOfStock = isProductOutOfStock(product);

                return (
                  <div
                    key={product.id || index}
                    onMouseEnter={() => setHighlightedPinIndex(index)}
                    onMouseLeave={() => setHighlightedPinIndex(null)}
                    className={`p-4 flex items-center justify-between gap-4 transition-all duration-300 border rounded-xl ${
                      isHighlighted
                        ? 'bg-surface-container-high dark:bg-zinc-800 border-purple-500/60 shadow-lg scale-[1.02]'
                        : 'bg-surface-container-low dark:bg-zinc-900/90 border-surface-container dark:border-zinc-800'
                    } ${isOutOfStock ? 'opacity-70' : ''}`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Numeric Index Pin Badge */}
                      <span className="w-6 h-6 shrink-0 rounded-full bg-zinc-800 text-zinc-300 text-[11px] font-mono flex items-center justify-center font-bold">
                        {index + 1}
                      </span>

                      {/* Product Thumbnail */}
                      <div className="w-12 h-14 bg-surface-container dark:bg-zinc-950 overflow-hidden shrink-0 rounded">
                        <img
                          src={product.images?.[0] || mainImage}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-primary dark:text-white truncate">
                            {product.name}
                          </h4>
                          {isOutOfStock && (
                            <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                              {isArabic ? 'نفد من المخزون' : 'Out of Stock'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-purple-400 font-semibold mt-0.5">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>

                    {/* Add to Bag Button */}
                    <button
                      onClick={() => !isOutOfStock && handleAddToCartWithFeedback(product, product.id)}
                      disabled={isAdded || isOutOfStock}
                      className={`px-3 py-2 text-[11px] font-label-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200 shrink-0 shadow-sm rounded-lg ${
                        isOutOfStock
                          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                          : isAdded
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-primary text-white dark:bg-white dark:text-black hover:opacity-90 cursor-pointer'
                      }`}
                    >
                      {isOutOfStock ? (
                        <span>{isArabic ? 'غير متوفر' : 'Unavailable'}</span>
                      ) : isAdded ? (
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

            {/* Complete Look Bundle Action Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-zinc-900 border border-amber-500/30 shadow-2xl space-y-4 mt-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                <div>
                  <span className="text-xs font-label-bold text-zinc-400 uppercase tracking-wider block">
                    {isArabic ? 'إجمالي سعر الطقم كامل:' : 'Complete Look Total:'}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    {inStockPieces.length} {isArabic ? 'قطع متوفرة جاهزة للشحن' : 'in-stock pieces ready'}
                  </span>
                </div>
                <div className="text-right rtl:text-left">
                  <span className="font-mono text-lg sm:text-xl font-bold text-amber-400 tracking-tight block">
                    {formatPrice(totalLookPrice)}
                  </span>
                </div>
              </div>

              {/* Status Alert Note if a piece is out of stock */}
              {hasOutOfStockPiece && (
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    {isArabic
                      ? `ملاحظة: ${outOfStockPieces.length} قطعة من الطقم غير متوفرة حالياً وسيتم طلب المتوفر فقط.`
                      : `Notice: ${outOfStockPieces.length} item(s) in this look are out of stock.`}
                  </span>
                </div>
              )}

              {/* Primary Add Entire Look Button */}
              <button
                onClick={handleAddEntireLookToBag}
                disabled={isAllOutOfStock}
                className="w-full py-4 px-6 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl cursor-pointer"
              >
                {addedEntireLook ? (
                  <>
                    <Check className="w-5 h-5 text-black stroke-[3]" />
                    <span>{isArabic ? '✓ تمت إضافة الطقم إلى حقيبتك!' : '✓ Added Look to Bag!'}</span>
                  </>
                ) : isAllOutOfStock ? (
                  <>
                    <AlertCircle className="w-5 h-5 text-black" />
                    <span>{isArabic ? 'الطقم غير متوفر حالياً' : 'Look Unavailable'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 text-black" />
                    <span>
                      {isArabic
                        ? `إضافة الطقم كامل إلى الحقيبة (${formatPrice(totalLookPrice)})`
                        : `Add Entire Look to Bag (${formatPrice(totalLookPrice)})`}
                    </span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-zinc-400 pt-1">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-amber-400" />
                  {isArabic ? 'شحن سريع لكافة المحافظات' : 'Express Delivery'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-3 h-3 text-amber-400" />
                  {isArabic ? 'استبدال واسترجاع سهل' : 'Easy Exchanges'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopTheLook;
