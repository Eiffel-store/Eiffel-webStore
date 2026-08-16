import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../../data/products';
import { useLanguage } from '../../context/LanguageContext';

export const CategoryGrid: React.FC = () => {
  const { t, isRTL } = useLanguage();

  return (
    <section className="py-12 sm:py-20 px-3 sm:px-8 md:px-12 max-w-[1440px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 pb-3 sm:pb-4 border-b border-surface-container dark:border-zinc-800">
        <div>
          <span className="text-[10px] sm:text-xs font-label-bold text-secondary dark:text-zinc-400 uppercase tracking-widest">
            {t.categoriesSubtitle}
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl text-primary dark:text-white mt-1">
            {t.categoriesTitle}
          </h2>
        </div>
        <Link
          to="/collections/men"
          className="mt-3 sm:mt-0 font-label-bold text-xs tracking-widest text-primary dark:text-white hover:underline flex items-center gap-1 uppercase"
        >
          <span>{t.viewAll}</span>
          <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            to={cat.href}
            className="group relative aspect-[3/4] overflow-hidden bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 shadow-sm"
          >
            <img
              src={cat.image}
              alt={cat.title}
              className="w-full h-full object-cover luxury-image-hover group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300" />
            
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-6 text-white flex flex-col justify-end">
              <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-zinc-300 uppercase">
                {cat.count} {t.categoriesPieces}
              </span>
              <h3 className="font-editorial text-lg sm:text-3xl tracking-tight text-white mt-0.5 sm:mt-1 group-hover:translate-x-1 transition-transform">
                {isRTL && cat.id === 'men' ? 'تشكيلة الرجال' : isRTL && cat.id === 'kids' ? 'أزياء الأطفال' : isRTL && cat.id === 'accessories' ? 'القطع الجلدية' : isRTL ? 'مجموعة 04' : cat.title}
              </h3>
              <p className="hidden sm:block text-xs text-zinc-300 mt-1 line-clamp-1 font-light">
                {cat.subtitle}
              </p>
              <div className="mt-2 sm:mt-3 flex items-center gap-1 text-[10px] sm:text-[11px] font-label-bold tracking-widest uppercase text-white group-hover:underline">
                <span>{t.discover}</span>
                <ArrowRight className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
