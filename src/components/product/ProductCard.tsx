import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Plus } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const { t, isRTL } = useLanguage();
  const [selectedColor] = useState(product.colors[0]?.name || 'Noir');
  const [isHovered, setIsHovered] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);

  const isSaved = isInWishlist(product.id);
  const currentImage = product.images[isHovered && product.images.length > 1 ? 1 : 0] || product.images[0];

  const handleQuickAdd = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, size, selectedColor, 1);
    setShowSizePicker(false);
  };

  return (
    <div
      className="group relative flex flex-col bg-surface-container-lowest dark:bg-inverse-surface border border-surface-container dark:border-zinc-800 transition-all duration-300 shadow-sm hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowSizePicker(false);
      }}
    >
      {/* Image Container with 4:5 Aspect Ratio */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-container-low dark:bg-zinc-900">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-cover object-center luxury-image-hover"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 rtl:left-auto rtl:right-2.5 flex flex-col gap-1 z-10">
          {product.isNew && (
            <span className="bg-primary text-white dark:bg-white dark:text-black font-label-bold text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest px-2 sm:px-2.5 py-0.5 sm:py-1 uppercase shadow-sm">
              {t.newBadge}
            </span>
          )}
          {product.tag && (
            <span className="bg-surface-container-lowest/90 dark:bg-zinc-800/90 text-primary dark:text-white font-label-bold text-[8px] sm:text-[9px] tracking-wider px-1.5 sm:px-2 py-0.5 uppercase border border-surface-container dark:border-zinc-700">
              {product.tag}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 rtl:right-auto rtl:left-2.5 z-10 w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-surface-container dark:border-zinc-700 transition-all duration-200 hover:scale-105 shadow-sm ${
            isSaved ? 'text-error' : 'text-primary dark:text-white hover:text-black'
          }`}
          aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSaved ? 'fill-error' : ''}`} />
        </button>

        {/* Quick View Trigger on Hover (Desktop) */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="hidden sm:flex absolute bottom-3 left-3 rtl:left-auto rtl:right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 w-9 h-9 items-center justify-center bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-surface-container dark:border-zinc-700 hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-black shadow-md"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}

        {/* Mobile Quick Add Floating Button (Bottom Right) */}
        <div className="sm:hidden absolute bottom-2 right-2 rtl:right-auto rtl:left-2 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (product.sizes.length === 1) {
                addToCart(product, product.sizes[0], selectedColor, 1);
              } else {
                setShowSizePicker(!showSizePicker);
              }
            }}
            className="w-8 h-8 rounded-full bg-primary text-white dark:bg-white dark:text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            aria-label="Quick Add"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop Quick Add To Bag overlay & Mobile Size Picker overlay */}
        <div className={`absolute inset-x-0 bottom-0 p-2 sm:p-3 z-20 transition-all duration-300 ${
          showSizePicker 
            ? 'translate-y-0 opacity-100' 
            : 'transform translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100'
        }`}>
          {!showSizePicker ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (product.sizes.length === 1) {
                  addToCart(product, product.sizes[0], selectedColor, 1);
                } else {
                  setShowSizePicker(true);
                }
              }}
              className="hidden sm:flex w-full py-3 px-4 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase items-center justify-center gap-2 shadow-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t.quickAdd}</span>
            </button>
          ) : (
            <div className="bg-white dark:bg-zinc-950 p-2 border border-surface-container dark:border-zinc-700 shadow-2xl animate-fade-in">
              <div className="flex justify-between items-center mb-1.5 px-1">
                <span className="text-[9px] sm:text-[10px] font-label-bold tracking-widest text-secondary dark:text-zinc-400 uppercase">
                  {t.selectSize}
                </span>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowSizePicker(false);
                  }}
                  className="text-[10px] text-secondary hover:text-primary dark:hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={(e) => handleQuickAdd(e, sz)}
                    className="py-1.5 text-[11px] sm:text-xs font-label-bold border border-surface-container dark:border-zinc-800 hover:border-primary hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-black transition-all text-center uppercase"
                  >
                    {sz.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-1.5 sm:gap-2">
        <div>
          <div className="text-[9px] sm:text-[11px] font-label-bold text-secondary dark:text-zinc-400 uppercase tracking-wider sm:tracking-widest truncate">
            {product.subCategory}
          </div>
          <Link to={`/product/${product.id}`} className="block group-hover:underline mt-0.5">
            <h3 className="font-editorial text-base sm:text-xl tracking-tight text-primary dark:text-inverse-on-surface line-clamp-1 leading-tight">
              {product.name}
            </h3>
          </Link>
          <p className="text-[11px] sm:text-xs text-secondary dark:text-zinc-400 line-clamp-1 mt-0.5 font-light">
            {product.subtitle}
          </p>
        </div>

        {/* Colors & Price */}
        <div className="flex items-center justify-between pt-2 border-t border-surface-container/60 dark:border-zinc-800/80">
          <div className="flex items-center gap-1 sm:gap-1.5">
            {product.colors.map((c) => (
              <span
                key={c.name}
                title={c.name}
                style={{ backgroundColor: c.hex }}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-black/20 dark:border-white/20 ${
                  selectedColor === c.name ? 'ring-1 ring-offset-1 ring-primary dark:ring-white' : ''
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-secondary line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-xs sm:text-sm font-bold text-primary dark:text-white">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
