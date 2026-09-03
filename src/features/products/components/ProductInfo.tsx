import React from 'react';
import { ShoppingBag, Check, ArrowRight, Ruler, Truck, RotateCcw, ShieldCheck, AlertCircle, Sparkles, Star } from 'lucide-react';
import { Product } from '@/types';
import { useCurrency, useLanguage, useStoreData } from '@/shared';
import { getColorBackgroundStyle } from '@/shared/utils/productUtils';

interface ProductInfoProps {
  product: Product;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  quantity: number;
  setQuantity: (q: number) => void;
  addedAnimation: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onOpenSizeGuide: () => void;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  addedAnimation,
  onAddToCart,
  onBuyNow,
  onOpenSizeGuide
}) => {
  const { formatPrice } = useCurrency();
  const { t, isRTL } = useLanguage();
  const { settings } = useStoreData();

  const minAllowed = Math.max(1, settings?.minPiecesPerItem ?? 1);
  const maxAllowed = Math.max(minAllowed, settings?.maxPiecesPerItem ?? 3);

  const currentStock = product.stock !== undefined ? product.stock : (product.inStock ? 20 : 0);
  const effectiveMax = Math.min(currentStock, maxAllowed);
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;

  // Ensure current quantity is within [minAllowed, effectiveMax]
  React.useEffect(() => {
    if (!isOutOfStock && quantity < minAllowed) {
      setQuantity(minAllowed);
    }
  }, [minAllowed, isOutOfStock]);

  return (
    <div className="flex flex-col justify-start">
      {/* Editorial Category & Name */}
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-[10px] sm:text-xs font-label-bold tracking-widest text-secondary dark:text-zinc-400 uppercase">
            {product.category}
          </span>
          {product.isNew && (
            <span className="bg-primary text-white dark:bg-white dark:text-black text-[9px] font-label-bold px-2 py-0.5 uppercase tracking-widest">
              {t.newBadge}
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[9px] font-label-bold px-2 py-0.5 uppercase tracking-widest">
              {t.bestSellerBadge}
            </span>
          )}
        </div>

        <h1 className="font-editorial text-2xl sm:text-4xl text-primary dark:text-white uppercase leading-tight">
          {product.name}
        </h1>
        {product.subtitle && (
          <p className="text-xs sm:text-sm text-secondary dark:text-zinc-400 font-mono mt-1">
            {product.subtitle}
          </p>
        )}

        {/* Live Rating & Reviews Jump Link */}
        <div className="mt-2.5 flex items-center gap-2">
          <a
            href="#product-reviews-section"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('product-reviews-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all text-xs font-mono group cursor-pointer"
          >
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold text-amber-300">{(product.rating || 5.0).toFixed(1)}</span>
            </div>
            <span className="text-zinc-500 dark:text-zinc-400 text-[11px] group-hover:text-amber-300 transition-colors">
              ({product.reviewCount || 0} {t.reviews})
            </span>
          </a>
        </div>
      </div>

      {/* Pricing Strip */}
      <div className="mt-4 flex items-baseline gap-3">
        <span className="font-mono text-2xl sm:text-3xl font-bold text-primary dark:text-white">
          {formatPrice(product.price)}
        </span>
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="text-sm font-mono text-secondary dark:text-zinc-500 line-through">
            {formatPrice(product.originalPrice)}
          </span>
        )}
      </div>

      {/* Color Selection */}
      <div className="mt-6">
        <div className="flex justify-between items-center text-xs font-label-bold text-secondary dark:text-zinc-400 uppercase mb-2">
          <span>{t.selectColor}</span>
          <span className="text-primary dark:text-white font-mono">{selectedColor}</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {product.colors.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedColor(c.name)}
              className={`flex items-center gap-2 px-3 py-1.5 border transition-all text-xs cursor-pointer ${
                selectedColor === c.name
                  ? 'border-primary dark:border-white bg-surface-container-low dark:bg-zinc-800 text-primary dark:text-white shadow-sm ring-1 ring-primary/20'
                  : 'border-surface-container dark:border-zinc-800 text-secondary dark:text-zinc-400 hover:border-primary'
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0 shadow-xs"
                style={getColorBackgroundStyle(c)}
              />
              <span className="capitalize font-medium">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className="mt-6">
        <div className="flex justify-between items-center text-xs font-label-bold text-secondary dark:text-zinc-400 uppercase mb-2">
          <span>{t.selectSize}</span>
          <button
            onClick={onOpenSizeGuide}
            className="flex items-center gap-1 text-primary dark:text-white hover:underline text-[11px] cursor-pointer"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>{t.sizeGuide}</span>
          </button>
        </div>
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {product.sizes.map((sz) => (
            <button
              key={sz}
              onClick={() => setSelectedSize(sz)}
              className={`py-2.5 sm:py-3 text-xs font-label-bold border transition-all text-center uppercase cursor-pointer ${
                selectedSize === sz
                  ? 'bg-primary text-white dark:bg-white dark:text-black border-primary dark:border-white shadow-sm'
                  : 'border-surface-container dark:border-zinc-800 hover:border-primary text-primary dark:text-white'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>

        {/* Dynamic Real-time Stock Notice */}
        <div className="mt-3">
          {isOutOfStock ? (
            <div className="flex items-center gap-1.5 text-xs text-rose-500 font-bold bg-rose-500/10 p-2 rounded border border-rose-500/20">
              <AlertCircle className="w-4 h-4" />
              <span>{t.outOfStockAlert}</span>
            </div>
          ) : isLowStock ? (
            <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold bg-amber-500/10 p-2 rounded border border-amber-500/30 animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span>{t.lowStockUrgentAlert.replace('{count}', String(currentStock))}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
              <Check className="w-3.5 h-3.5" />
              <span>{t.inStockReadyToShipCount.replace('{count}', String(currentStock))}</span>
            </div>
          )}
        </div>
      </div>

      {/* Quantity & Purchasing CTA Buttons */}
      <div className="mt-6 sm:mt-8 space-y-2.5 sm:space-y-3">
        <div className="flex gap-2.5 sm:gap-3">
          <div className={`flex items-center border border-surface-container dark:border-zinc-700 bg-surface-container-low dark:bg-zinc-900 px-2 sm:px-3 ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
            <button
              onClick={() => setQuantity(Math.max(minAllowed, quantity - 1))}
              disabled={isOutOfStock || quantity <= minAllowed}
              className="text-primary dark:text-white px-2 py-2 sm:py-3 hover:opacity-60 text-base font-bold disabled:opacity-30 cursor-pointer"
            >
              -
            </button>
            <span className="font-mono text-sm font-bold px-2 sm:px-3 text-primary dark:text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(effectiveMax, quantity + 1))}
              disabled={isOutOfStock || quantity >= effectiveMax}
              className="text-primary dark:text-white px-2 py-2 sm:py-3 hover:opacity-60 text-base font-bold disabled:opacity-30 cursor-pointer"
            >
              +
            </button>
          </div>

          <button
            onClick={onAddToCart}
            disabled={isOutOfStock}
            className="flex-1 py-3.5 sm:py-4 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span>{t.addedToBag}</span>
              </>
            ) : isOutOfStock ? (
              <span>{t.outOfStockBadge}</span>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>{t.addToBag}</span>
              </>
            )}
          </button>
        </div>

        {!isOutOfStock && (
          <button
            onClick={onBuyNow}
            className="w-full py-3.5 sm:py-4 bg-secondary text-white dark:bg-zinc-800 dark:text-zinc-200 font-label-bold text-xs tracking-widest uppercase hover:bg-primary dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t.expressCheckout}</span>
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* Guarantees Bar */}
      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-surface-container dark:border-zinc-800 grid grid-cols-2 gap-3 sm:gap-4 text-[11px] sm:text-xs text-secondary dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-primary dark:text-white shrink-0" />
          <span>{t.footerTrustShippingTitle}</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-primary dark:text-white shrink-0" />
          <span>{t.returnsNotice}</span>
        </div>
      </div>
    </div>
  );
};
