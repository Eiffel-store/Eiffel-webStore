import React, { useState } from 'react';
import { Heart, Share2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Product } from '../../types';

interface ProductGalleryProps {
  product: Product;
  selectedImage: number;
  setSelectedImage: (idx: number) => void;
  isSaved: boolean;
  onToggleWishlist: () => void;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  product,
  selectedImage,
  setSelectedImage,
  isSaved,
  onToggleWishlist,
}) => {
  const { t } = useLanguage();
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="lg:col-span-7 flex flex-col gap-4">
      {/* Main Stage Image */}
      <div className="relative aspect-[4/5] w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 overflow-hidden group">
        <img
          src={product.images[selectedImage] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center cursor-zoom-in group-hover:scale-105 transition-transform duration-700"
        />

        {/* Tag Overlays */}
        <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest px-3 py-1 uppercase">
              {t.newBadge}
            </span>
          )}
          {product.tag && (
            <span className="bg-surface-container-lowest/90 dark:bg-zinc-900/90 text-primary dark:text-white font-label-bold text-[10px] tracking-wider px-2.5 py-1 uppercase border border-surface-container dark:border-zinc-700">
              {product.tag}
            </span>
          )}
        </div>

        {/* Share & Wishlist quick actions on image */}
        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 flex flex-col gap-2">
          <button
            onClick={onToggleWishlist}
            className={`p-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-surface-container dark:border-zinc-700 hover:scale-105 transition-all ${
              isSaved ? 'text-error' : 'text-primary dark:text-white'
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-error' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-surface-container dark:border-zinc-700 hover:scale-105 text-primary dark:text-white transition-all relative"
            title="Share link"
          >
            <Share2 className="w-5 h-5" />
            {copiedLink && (
              <span className="absolute right-full rtl:right-auto rtl:left-full mr-2 rtl:mr-0 rtl:ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black text-white text-[10px] font-mono whitespace-nowrap">
                COPIED
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Thumbnail Strip */}
      {product.images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {product.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`aspect-[4/5] overflow-hidden border transition-all ${
                selectedImage === idx
                  ? 'border-primary dark:border-white ring-2 ring-primary dark:ring-white'
                  : 'border-surface-container dark:border-zinc-800 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
