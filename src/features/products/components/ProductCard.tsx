import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { useWishlist } from '@/features/wishlist';
import { useCart } from '@/features/cart';
import { useCurrency, useLanguage, resolveColorImage, CachedImage, getColorBackgroundStyle } from '@/shared';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeColorImage, setActiveColorImage] = useState<string | null>(null);
  const [activeColorName, setActiveColorName] = useState<string | null>(null);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const {  t } = useLanguage();

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const images = (product.images && product.images.length > 0) ? product.images : ['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop'];
  
  // Find currently active or default color object
  const activeColorObj = activeColorName
    ? product.colors?.find(c => c.name && c.name.toLowerCase() === activeColorName.toLowerCase())
    : (product.colors && product.colors.length > 0 ? product.colors[0] : undefined);

  // Front and Back views for luxury card hover
  const frontView = activeColorImage || activeColorObj?.image || images[0];
  const backView = activeColorObj?.backImage || (images.length > 1 ? images[1] : frontView);

  // Choose displayed image: hover shows back view, otherwise front view
  const currentImage = isHovered ? backView : frontView;

  return (
    <div
      className="group relative flex flex-col bg-surface dark:bg-zinc-950 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveColorImage(null);
        setActiveColorName(null);
      }}
    >
      {/* Visual / Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-850 shadow-sm">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <CachedImage
            src={currentImage}
            alt={product.name || 'Eiffel luxury piece'}
            width={600}
            className="w-full h-full object-cover luxury-image-hover transition-all duration-300"
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
          {(product.stock !== undefined ? product.stock : (product.inStock ? 20 : 0)) <= 0 ? (
            <span className="bg-rose-600 text-white font-label-bold text-[9px] sm:text-[10px] tracking-widest px-2 py-0.5 uppercase shadow-sm">
              {t.outOfStockBadge}
            </span>
          ) : (product.stock !== undefined ? product.stock : 20) <= 5 ? (
            <span className="bg-amber-500 text-black font-label-bold text-[9px] sm:text-[10px] tracking-widest px-2 py-0.5 uppercase shadow-sm animate-pulse">
              {t.onlyCountLeftBadge.replace('{count}', String(product.stock))}
            </span>
          ) : null}
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
            onClick={() => addToCart(product, undefined, activeColorName || undefined)}
            disabled={(product.stock !== undefined ? product.stock : (product.inStock ? 20 : 0)) <= 0}
            className="flex-1 py-2 sm:py-2.5 bg-white text-black font-label-bold text-[10px] sm:text-xs tracking-widest uppercase hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{(product.stock !== undefined ? product.stock : (product.inStock ? 20 : 0)) <= 0 ? t.soldOut : t.quickAdd}</span>
          </button>
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="p-2 sm:p-2.5 bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm transition-colors cursor-pointer"
              title="Quick View"
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Product Details Meta */}
      <div className="pt-3 pb-2 flex flex-col flex-1">
        <div className="flex justify-between items-center gap-2">
          <span className="font-mono text-[10px] sm:text-[11px] text-secondary dark:text-zinc-400 uppercase tracking-widest">
            {product.subCategory || product.category || 'MENSWEAR'}
          </span>

          {/* Interactive Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 5).map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  onMouseEnter={() => {
                    const img = resolveColorImage(product, c.name);
                    setActiveColorImage(img);
                    setActiveColorName(c.name);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    const img = resolveColorImage(product, c.name);
                    setActiveColorImage(img);
                    setActiveColorName(c.name);
                  }}
                  title={c.name}
                  className={`w-3.5 h-3.5 rounded-full border transition-transform hover:scale-125 cursor-pointer ${
                    activeColorName === c.name ? 'ring-2 ring-amber-400 scale-110 border-white' : 'border-zinc-700'
                  }`}
                  style={getColorBackgroundStyle(c)}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-[9px] font-mono text-zinc-500">
                  +{product.colors.length - 5}
                </span>
              )}
            </div>
          )}
        </div>

        <Link to={`/product/${product.id}`} className="mt-1 block">
          <h3 className="font-editorial text-sm sm:text-base font-bold text-primary dark:text-white group-hover:underline line-clamp-1">
            {product.name}
          </h3>
        </Link>
        {product.subtitle && (
          <p className="text-[11px] sm:text-xs text-secondary dark:text-zinc-400 line-clamp-1 mt-0.5 font-light">
            {product.subtitle}
          </p>
        )}

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
