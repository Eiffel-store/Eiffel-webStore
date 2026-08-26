import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { Heart } from 'lucide-react';
import { CachedImage } from '@/shared';

export interface ProductGalleryProps {
  product?: Product;
  images?: string[];
  productName?: string;
  activeColorImage?: string;
  selectedImage?: number;
  setSelectedImage?: (idx: number) => void;
  isSaved?: boolean;
  onToggleWishlist?: () => void;
}

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop';

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  product,
  images = [],
  productName,
  activeColorImage,
  selectedImage: controlledSelected,
  setSelectedImage: setControlledSelected,
  isSaved = false,
  onToggleWishlist
}) => {
  const [internalSelected, setInternalSelected] = useState(0);

  const activeIndex = controlledSelected !== undefined ? controlledSelected : internalSelected;
  const setActiveIndex = setControlledSelected || setInternalSelected;

  const rawImages = (product?.images && product.images.length > 0) ? product.images : (images.length > 0 ? images : [FALLBACK_IMG]);
  
  // If activeColorImage is provided and not in images list, prepend it
  const allImages = [...rawImages];
  if (activeColorImage && activeColorImage.trim() !== '' && !allImages.includes(activeColorImage)) {
    allImages.unshift(activeColorImage);
  }

  const safeImages = allImages.filter(img => img && img.trim() !== '');
  const finalImages = safeImages.length > 0 ? safeImages : [FALLBACK_IMG];

  // Whenever activeColorImage changes, switch the active image to that color's image
  useEffect(() => {
    if (activeColorImage && activeColorImage.trim() !== '') {
      const idx = finalImages.indexOf(activeColorImage);
      if (idx !== -1) {
        setActiveIndex(idx);
      }
    }
  }, [activeColorImage]);

  const displayName = productName || product?.name || 'Product';

  return (
    <div className="lg:col-span-7 flex flex-col gap-4">
      {/* Main Large Image */}
      <div className="relative aspect-[3/4] w-full bg-zinc-950 overflow-hidden shadow-xl border border-surface-container dark:border-zinc-850 group">
        <CachedImage
          src={finalImages[activeIndex] || finalImages[0]}
          alt={displayName}
          priority
          width={1000}
          className="w-full h-full object-cover luxury-image-hover transition-all duration-300"
        />


        {onToggleWishlist && (
          <button
            onClick={onToggleWishlist}
            className={`absolute top-4 right-4 rtl:right-auto rtl:left-4 p-3 rounded-full transition-all ${
              isSaved
                ? 'bg-primary text-white dark:bg-white dark:text-black shadow-lg'
                : 'bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {finalImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3">
          {finalImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-[3/4] overflow-hidden bg-zinc-900 border transition-all cursor-pointer ${
                activeIndex === idx
                  ? 'border-primary dark:border-white ring-2 ring-primary dark:ring-white'
                  : 'border-zinc-800 opacity-60 hover:opacity-100'
              }`}
            >
              <CachedImage
                src={img}
                alt={`${displayName} Thumbnail ${idx + 1}`}
                width={200}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
