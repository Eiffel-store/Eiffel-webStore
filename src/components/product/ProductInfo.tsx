import React from 'react';
import { Star, Ruler, ShoppingBag, Check, ArrowRight, Truck, RotateCcw } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { Product } from '../../types';

interface ProductInfoProps {
  product: Product;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  quantity: number;
  setQuantity: (qty: number) => void;
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
  onOpenSizeGuide,
}) => {
  const { formatPrice } = useCurrency();
  const { t, isRTL } = useLanguage();

  return (
    <div>
      {/* Reference ID & Category */}
      <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-secondary dark:text-zinc-400 uppercase">
        <span>{t.refNumber} {product.id.toUpperCase()}</span>
        <span>{t.madeInItaly}</span>
      </div>

      {/* Title & Subtitle */}
      <h1 className="font-editorial text-3xl sm:text-5xl text-primary dark:text-white mt-1 sm:mt-2 leading-[1.0] sm:leading-[0.95]">
        {product.name}
      </h1>
      <p className="text-xs sm:text-sm text-secondary dark:text-zinc-300 mt-1.5 sm:mt-2 font-light">
        {product.subtitle}
      </p>

      {/* Price & Rating */}
      <div className="flex items-center justify-between mt-4 sm:mt-6 pb-4 sm:pb-6 border-b border-surface-container dark:border-zinc-800">
        <div className="flex items-baseline gap-2.5 sm:gap-3">
          <span className="font-mono text-2xl sm:text-3xl font-bold text-primary dark:text-white">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs sm:text-sm font-mono text-secondary line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-secondary dark:text-zinc-400">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
          <span className="font-mono text-[11px] sm:text-xs">({product.reviewCount})</span>
        </div>
      </div>

      {/* Color Swatches */}
      <div className="mt-5 sm:mt-6">
        <div className="flex justify-between items-center text-xs font-label-bold text-secondary dark:text-zinc-400 uppercase mb-2">
          <span>{t.colorway} <strong className="text-primary dark:text-white">{selectedColor}</strong></span>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedColor(c.name)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border text-xs font-label-bold uppercase transition-all ${
                selectedColor === c.name
                  ? 'border-primary dark:border-white bg-surface-container-high dark:bg-zinc-800 text-primary dark:text-white shadow-sm'
                  : 'border-surface-container dark:border-zinc-800 text-secondary hover:border-secondary'
              }`}
            >
              <span className="w-3 h-3 rounded-full border border-black/30" style={{ backgroundColor: c.hex }} />
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Size Selector */}
      <div className="mt-5 sm:mt-6">
        <div className="flex justify-between items-center text-xs font-label-bold text-secondary dark:text-zinc-400 uppercase mb-2">
          <span>{t.selectSize}</span>
          <button
            onClick={onOpenSizeGuide}
            className="flex items-center gap-1 text-primary dark:text-white hover:underline text-[11px]"
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
              className={`py-2.5 sm:py-3 text-xs font-label-bold border transition-all text-center uppercase ${
                selectedSize === sz
                  ? 'bg-primary text-white dark:bg-white dark:text-black border-primary dark:border-white shadow-sm'
                  : 'border-surface-container dark:border-zinc-800 hover:border-primary text-primary dark:text-white'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-zinc-500 font-mono mt-2">
          {t.inStockNotice}
        </p>
      </div>

      {/* Quantity & Purchasing CTA Buttons */}
      <div className="mt-6 sm:mt-8 space-y-2.5 sm:space-y-3">
        <div className="flex gap-2.5 sm:gap-3">
          <div className="flex items-center border border-surface-container dark:border-zinc-700 bg-surface-container-low dark:bg-zinc-900 px-2 sm:px-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-primary dark:text-white px-2 py-2 sm:py-3 hover:opacity-60 text-base font-bold"
            >
              -
            </button>
            <span className="font-mono text-sm font-bold px-2 sm:px-3 text-primary dark:text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="text-primary dark:text-white px-2 py-2 sm:py-3 hover:opacity-60 text-base font-bold"
            >
              +
            </button>
          </div>

          <button
            onClick={onAddToCart}
            className="flex-1 py-3.5 sm:py-4 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-md"
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span>{t.addedToBag}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>{t.addToBag}</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={onBuyNow}
          className="w-full py-3.5 sm:py-4 bg-secondary text-white dark:bg-zinc-800 dark:text-zinc-200 font-label-bold text-xs tracking-widest uppercase hover:bg-primary dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
        >
          <span>{t.expressCheckout}</span>
          <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
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
