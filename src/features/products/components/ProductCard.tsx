import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { useWishlist } from '@/features/wishlist';
import { useCart } from '@/features/cart';
import { useCurrency, useLanguage } from '@/shared';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { isRTL, t } = useLanguage();

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const images = (product.images && product.images.length > 0) ? product.images : ['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop'];
  const currentImage = images[isHovered && images.length > 1 ? 1 : 0] || images[0];

  return (
    <div
      className="group relative flex flex-col bg-surface dark:bg-zinc-950 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual / Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-850 shadow-sm">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={currentImage}
            alt={product.name || 'Eiffel luxury piece'}
            className="w-full h-full object-cover luxury-image-hover"
            loading="lazy"
          />
        </Link>

        {/* Badges: New, Sale, Limited */}
        <div className="absolute top-2.5 left-2.5 rtl:left-auto rtl:right-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {product.isNew && (
            <span className="bg-primary text-white dark:bg-white dark:text-black font-label-bold text-[9px] sm:text-[10px] tracking-widest px-2 py-0.5 uppercase shadow-sm">
              NEW
            </span>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="bg-amber-600 text-white font-label-bold text-[9px] sm:text-[10px] tracking-widest px-2 py-0.5 uppercase shadow-sm">
              SALE
            </span>
          )}
          {product.isLimited && (
            <span className="bg-zinc-900/90 text-zinc-200 border border-zinc-700 font-mono text-[9px] tracking-wider px-2 py-0.5 uppercase">
              LIMITED
            </span>
          )}
        </div>

        {/* Wishlist Trigger */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 rtl:right-auto rtl:left-2.5 p-2 rounded-full transition-all duration-200 z-10 ${
            inWishlist
              ? 'bg-primary text-white dark:bg-white dark:text-black shadow-md'
              : 'bg-white/80 dark:bg-black/60 text-secondary hover:text-primary dark:text-zinc-300 dark:hover:text-white backdrop-blur-sm opacity-90 sm:opacity-0 group-hover:opacity-100'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick Actions Bar */}
        <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 py-2 sm:py-2.5 bg-white text-black font-label-bold text-[10px] sm:text-xs tracking-widest uppercase hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 shadow-md"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t.quickAdd}</span>
          </button>
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="p-2 sm:p-2.5 bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm transition-colors"
              title="Quick View"
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Product Details Meta */}
      <div className="pt-3 pb-2 flex flex-col flex-1">
        <div className="flex justify-between items-baseline gap-2">
          <span className="font-mono text-[10px] sm:text-[11px] text-secondary dark:text-zinc-400 uppercase tracking-widest">
            {product.subCategory || product.category || 'MENSWEAR'}
          </span>
          {product.colors && product.colors.length > 0 && (
            <span className="font-mono text-[9px] text-secondary dark:text-zinc-500">
              {product.colors.length} {isRTL ? 'ألوان' : 'COLOURS'}
            </span>
          )}
        </div>

        <Link to={`/product/${product.id}`} className="mt-1">
          <h3 className="font-editorial text-sm sm:text-base font-bold text-primary dark:text-white group-hover:underline line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-[11px] sm:text-xs text-secondary dark:text-zinc-400 line-clamp-1 mt-0.5 font-light">
          {product.subtitle}
        </p>

        {/* Pricing */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono text-xs sm:text-sm font-bold text-primary dark:text-white">
            {formatPrice(product.price || 0)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="font-mono text-[10px] sm:text-xs text-secondary line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
