import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/features/cart';
import { useWishlist } from '@/features/wishlist';
import { useCurrency } from '@/shared';
import { useLanguage } from '@/shared';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Noir');
  const [selectedImage, setSelectedImage] = useState(0);

  const isSaved = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, 1);
    onClose();
  };

  const handleViewDetails = () => {
    onClose();
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div className="relative bg-surface-container-lowest dark:bg-zinc-950 w-full max-w-3xl border border-surface-container dark:border-zinc-800 shadow-2xl z-10 animate-fade-in overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 p-2 bg-surface-container-lowest/80 dark:bg-zinc-900/80 text-primary dark:text-white hover:opacity-70"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left Gallery (6 cols) */}
          <div className="md:col-span-6 bg-surface-container-low dark:bg-zinc-900 relative">
            <div className="aspect-[4/5] w-full overflow-hidden">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto bg-surface-container-lowest dark:bg-zinc-950 border-t border-surface-container dark:border-zinc-800">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-12 h-14 shrink-0 overflow-hidden border ${
                      selectedImage === idx ? 'border-primary dark:border-white ring-1 ring-primary' : 'border-surface-container opacity-60'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Content (6 cols) */}
          <div className="md:col-span-6 p-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono text-secondary uppercase">
                <span>{product.subCategory}</span>
                <span>{t.madeInItaly}</span>
              </div>

              <h3 className="font-editorial text-2xl sm:text-3xl text-primary dark:text-white mt-1">
                {product.name}
              </h3>
              <p className="text-xs text-secondary dark:text-zinc-400 mt-1 font-light line-clamp-2">
                {product.subtitle}
              </p>

              <div className="flex items-baseline gap-3 my-4">
                <span className="font-mono text-xl font-bold text-primary dark:text-white">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs font-mono text-secondary line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Color Picker */}
              <div className="space-y-2 mb-4">
                <span className="text-[10px] font-label-bold text-secondary uppercase">
                  {t.colorway} <strong className="text-primary dark:text-white">{selectedColor}</strong>
                </span>
                <div className="flex gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs uppercase font-label-bold ${
                        selectedColor === c.name
                          ? 'border-primary dark:border-white bg-surface-container-high dark:bg-zinc-800'
                          : 'border-surface-container dark:border-zinc-800 text-secondary'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.hex }} />
                      <span className="text-[10px]">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Picker */}
              <div className="space-y-2 mb-6">
                <span className="text-[10px] font-label-bold text-secondary uppercase">
                  {t.selectSize}
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 text-xs font-label-bold border transition-all text-center uppercase ${
                        selectedSize === sz
                          ? 'bg-primary text-white dark:bg-white dark:text-black border-primary'
                          : 'border-surface-container dark:border-zinc-800 text-secondary hover:border-primary'
                      }`}
                    >
                      {sz.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t border-surface-container dark:border-zinc-800">
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t.addToBag}</span>
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 border border-surface-container dark:border-zinc-800 transition-colors ${
                    isSaved ? 'text-error' : 'text-primary dark:text-white'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-error' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleViewDetails}
                className="w-full py-2.5 text-xs font-label-bold tracking-wider text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors uppercase flex items-center justify-center gap-1"
              >
                <span>{t.viewAll} / FULL DETAILS</span>
                <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
