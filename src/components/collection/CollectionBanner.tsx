import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface CollectionBannerProps {
  category: string;
  title: string;
  subtitle: string;
  image: string;
}

export const CollectionBanner: React.FC<CollectionBannerProps> = ({
  category,
  title,
  subtitle,
  image,
}) => {
  const { t } = useLanguage();

  return (
    <section className="relative h-64 sm:h-80 md:h-96 w-full bg-zinc-950 flex items-end overflow-hidden border-b border-surface-container dark:border-zinc-800">
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover object-center opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 pb-10 w-full text-white">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-400 mb-2">
          <Link to="/" className="hover:underline">EIFFEL</Link>
          <span>/</span>
          <span>{t.footerCollections}</span>
          <span>/</span>
          <span className="text-white uppercase">{category}</span>
        </div>

        <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl text-white tracking-tight uppercase">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-xl font-light mt-1">
          {subtitle}
        </p>
      </div>
    </section>
  );
};
