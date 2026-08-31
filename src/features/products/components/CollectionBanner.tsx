import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/shared';

interface CollectionBannerProps {
  category: string;
  title: string;
  subtitle?: string;
  image?: string;
}

export const CollectionBanner: React.FC<CollectionBannerProps> = ({
  category,
  title,
  subtitle,
  image,
}) => {
  const { isRTL } = useLanguage();
  const defaultFallbackImage = `${import.meta.env.BASE_URL}images/products/eiffel-cardigan-trio.jpg`;
  const bannerSrc = image && image.trim() !== '' ? image : defaultFallbackImage;

  const getBreadcrumbCategory = () => {
    const cat = category.toLowerCase();
    if (isRTL) {
      if (cat === 'men') return 'الرجال';
      if (cat === 'kids') return 'الأطفال';
      if (cat === 'accessories') return 'الإكسسوارات';
      if (cat === 'shoes' || cat === 'shoes-&-footwear') return 'الأحذية';
      if (cat === 'offers') return 'العروض';
      if (cat === 'new-arrivals') return 'أحدث الإصدارات';
      return title || category;
    } else {
      if (cat === 'men') return 'MEN';
      if (cat === 'kids') return 'KIDS';
      if (cat === 'accessories') return 'ACCESSORIES';
      if (cat === 'shoes' || cat === 'shoes-&-footwear') return 'SHOES';
      if (cat === 'offers') return 'OFFERS';
      if (cat === 'new-arrivals') return 'NEW ARRIVALS';
      return (title || category).toUpperCase();
    }
  };

  const isDuplicateSubtitle = subtitle && subtitle.toLowerCase().trim() === title.toLowerCase().trim();

  return (
    <section className="relative h-64 sm:h-80 md:h-96 w-full bg-zinc-950 flex items-end overflow-hidden border-b border-surface-container dark:border-zinc-800">
      <img
        src={bannerSrc}
        alt={title}
        onError={(e) => {
          e.currentTarget.src = defaultFallbackImage;
        }}
        className="absolute inset-0 w-full h-full object-cover object-center opacity-45 transition-opacity duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 pb-10 w-full text-white">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-400 mb-2">
          <Link to="/" className="hover:underline">EIFFEL</Link>
          <span>/</span>
          <span>{isRTL ? 'التشكيلات' : 'COLLECTIONS'}</span>
          <span>/</span>
          <span className="text-white uppercase">{getBreadcrumbCategory()}</span>
        </div>

        <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl text-white tracking-tight uppercase">
          {title}
        </h1>
        {subtitle && !isDuplicateSubtitle && (
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl font-light mt-1 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};
