import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStoreData, useLanguage } from '@/shared';

export const CategoryGrid: React.FC = () => {
  const { categories } = useStoreData();
  const { t, isRTL } = useLanguage();

  if (!categories || categories.length === 0) {
    return null;
  }

  const getCategoryInfo = (cat: any) => {
    const id = (cat.id || '').toLowerCase();
    if (isRTL) {
      if (id === 'men') return { title: 'تشكيلة الرجال', subtitle: 'قصات معمارية انسيابية وخامات قطن الجيزة' };
      if (id === 'kids') return { title: 'أزياء الأطفال', subtitle: 'أزياء راقية ومريحة للأولاد والبنات' };
      if (id === 'accessories') return { title: 'القطع الجلدية والإكسسوارات', subtitle: 'ساعات يد ستيل، محافظ وحقائب كروس' };
      if (id === 'offers') return { title: 'العروض والتخفيضات', subtitle: 'تخفيضات موسمية وباقات أطقم متكاملة' };
      return { title: cat.name, subtitle: cat.subtitle };
    } else {
      if (id === 'men') return { title: "MEN'S COLLECTION", subtitle: 'Architectural silhouettes & premium Egyptian cotton' };
      if (id === 'kids') return { title: "KIDS COLLECTION", subtitle: 'Contemporary junior tailoring & varsity knits' };
      if (id === 'accessories') return { title: "TIMEPIECES & ACCESSORIES", subtitle: 'Steel chronographs & fine leather goods' };
      if (id === 'offers') return { title: "SPECIAL OFFERS", subtitle: 'Seasonal markdowns & complete bundled looks' };
      return { title: cat.nameEn || cat.name || id.toUpperCase(), subtitle: cat.subtitleEn || 'Curated architectural collection' };
    }
  };

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
        {categories.map((cat) => {
          const info = getCategoryInfo(cat);
          return (
            <Link
              key={cat.id}
              to={`/collections/${cat.id}`}
              className="group relative aspect-[3/4] overflow-hidden bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 shadow-sm"
            >
              <img
                src={cat.image}
                alt={info.title}
                className="w-full h-full object-cover luxury-image-hover group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300" />
              
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-6 text-white flex flex-col justify-end">
                <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-zinc-300 uppercase">
                  {cat.itemCount || (isRTL ? '12 قطعة' : '12 PIECES')}
                </span>
                <h3 className="font-editorial text-lg sm:text-2xl tracking-tight text-white mt-0.5 sm:mt-1 group-hover:translate-x-1 transition-transform">
                  {info.title}
                </h3>
                <p className="hidden sm:block text-xs text-zinc-300 mt-1 line-clamp-1 font-light">
                  {info.subtitle}
                </p>
                <div className="mt-2 sm:mt-3 flex items-center gap-1 text-[10px] sm:text-[11px] font-label-bold tracking-widest uppercase text-white group-hover:underline">
                  <span>{t.discover}</span>
                  <ArrowRight className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
