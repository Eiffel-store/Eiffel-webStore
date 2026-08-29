import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Tag, Star, ChevronRight } from 'lucide-react';
import { useLanguage, useStoreData, CachedImage } from '@/shared';
import { CategoryItem } from '@/types';

interface NavMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const NavMegaMenu: React.FC<NavMegaMenuProps> = ({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { isRTL, language } = useLanguage();
  const { categories, products } = useStoreData();

  if (!isOpen) return null;

  // Extract active subcategories for each category
  const getCategorySubcategories = (cat: CategoryItem): string[] => {
    if (cat.subCategories && cat.subCategories.length > 0) {
      return cat.subCategories;
    }
    const subs = products
      .filter((p) => p.category === cat.id || (cat.id === 'men' && p.category !== 'kids'))
      .map((p) => p.subCategory)
      .filter((sub): sub is string => Boolean(sub && sub.trim()));
    return Array.from(new Set(subs)).slice(0, 6);
  };

  const featuredCategory = categories[0] || {
    id: 'men',
    name: 'تشكيلة الرجال',
    nameEn: "MEN'S COLLECTION",
    image: `${import.meta.env.BASE_URL}images/products/eiffel-cardigan-trio.jpg`,
    subtitle: 'قصات معمارية انسيابية وخامات قطن الجيزة الفاخر',
    subtitleEn: 'Architectural Silhouettes & Egyptian Cotton'
  };

  return (
    <>
      {/* 1. Dimming Backdrop */}
      <div
        className="fixed inset-0 top-[68px] sm:top-[80px] bg-black/60 backdrop-blur-xs z-40 transition-opacity duration-300 pointer-events-auto"
        onClick={onClose}
      />

      {/* 2. Floating Luxury Mega Menu Card with distinct margin and rounded borders */}
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="absolute top-[calc(100%+8px)] left-0 right-0 w-full max-w-[1400px] mx-auto px-3 sm:px-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
      >
        <div className="bg-white dark:bg-[#0e0e11] border border-zinc-200 dark:border-zinc-800/90 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.6)] p-6 sm:p-8">
          <div className="grid grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Categories & Subcategories (Cols 1-8) */}
            <div className="col-span-12 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
              {categories.map((cat) => {
                const catTitle = language === 'ar' ? (cat.name || cat.nameEn) : (cat.nameEn || cat.name);
                const subCats = getCategorySubcategories(cat);

                return (
                  <div key={cat.id} className="space-y-3 bg-zinc-50 dark:bg-zinc-900/40 p-3.5 rounded-xl border border-zinc-150 dark:border-zinc-800/60">
                    {/* Category Title Header */}
                    <Link
                      to={`/collections/${cat.id}`}
                      onClick={onClose}
                      className="group inline-flex items-center justify-between gap-1.5 text-xs font-bold font-editorial uppercase tracking-wider text-zinc-900 dark:text-white hover:text-amber-500 dark:hover:text-amber-400 transition-colors pb-1.5 border-b border-zinc-200 dark:border-zinc-800 w-full"
                    >
                      <span className="truncate">{catTitle}</span>
                      <ChevronRight className={`w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`} />
                    </Link>

                    {/* Subcategories */}
                    <ul className="space-y-1.5 text-xs font-mono">
                      <li>
                        <Link
                          to={`/collections/${cat.id}`}
                          onClick={onClose}
                          className="text-zinc-500 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors flex items-center justify-between py-0.5 font-bold"
                        >
                          <span>{isRTL ? 'عرض كل القطع' : 'View All Pieces'}</span>
                          <span className="text-[10px]">→</span>
                        </Link>
                      </li>
                      {subCats.map((sub) => (
                        <li key={sub}>
                          <Link
                            to={`/collections/${cat.id}?search=${encodeURIComponent(sub)}`}
                            onClick={onClose}
                            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors block py-0.5 truncate"
                          >
                            {sub}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}

              {/* Curated Highlights */}
              <div className="space-y-3 bg-zinc-50 dark:bg-zinc-900/40 p-3.5 rounded-xl border border-zinc-150 dark:border-zinc-800/60">
                <div className="text-xs font-bold font-editorial uppercase tracking-wider text-zinc-900 dark:text-white pb-1.5 border-b border-zinc-200 dark:border-zinc-800">
                  {isRTL ? 'تنسيقات ومجموعات' : 'CURATED HIGHLIGHTS'}
                </div>
                <ul className="space-y-2 text-xs font-mono">
                  <li>
                    <Link
                      to="/collections/new-arrivals"
                      onClick={onClose}
                      className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors py-0.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{isRTL ? 'أحدث الإصدارات' : 'New Arrivals'}</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/collections/offers"
                      onClick={onClose}
                      className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors py-0.5"
                    >
                      <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{isRTL ? 'العروض والتخفيضات' : 'Special Offers'}</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/collections/men?sortBy=rating"
                      onClick={onClose}
                      className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors py-0.5"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{isRTL ? 'الأكثر طلباً ومبيعاً' : 'Best Sellers'}</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Featured Visual Card (Cols 9-12) */}
            <div className="col-span-12 lg:col-span-4 pl-0 rtl:pl-0 rtl:pr-0 lg:rtl:pr-6 lg:ltr:pl-6 lg:border-l rtl:lg:border-r rtl:lg:border-l-0 border-zinc-200 dark:border-zinc-800/80">
              <Link
                to={`/collections/${featuredCategory.id}`}
                onClick={onClose}
                className="group relative block aspect-[16/10] overflow-hidden rounded-xl bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md"
              >
                <CachedImage
                  src={featuredCategory.image}
                  alt={featuredCategory.name}
                  width={500}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-4 text-white space-y-1">
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold tracking-widest text-amber-300 uppercase bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>EIFFEL ATELIER 2026</span>
                  </span>
                  <h4 className="font-editorial text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                    {language === 'ar' ? (featuredCategory.name || featuredCategory.nameEn) : (featuredCategory.nameEn || featuredCategory.name)}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-zinc-300 group-hover:text-white pt-1">
                    <span>{isRTL ? 'استكشف التشكيلة' : 'Explore Collection'}</span>
                    <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
