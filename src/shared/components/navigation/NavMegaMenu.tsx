import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Tag, Layers, ChevronRight, Star } from 'lucide-react';
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
  const { isRTL, language, t } = useLanguage();
  const { categories, products } = useStoreData();

  if (!isOpen) return null;

  // Get active subcategories for each category
  const getCategorySubcategories = (cat: CategoryItem): string[] => {
    if (cat.subCategories && cat.subCategories.length > 0) {
      return cat.subCategories;
    }
    // Extract unique subcategories from products assigned to this category
    const subs = products
      .filter((p) => p.category === cat.id || (cat.id === 'men' && p.category !== 'kids'))
      .map((p) => p.subCategory)
      .filter((sub): sub is string => Boolean(sub && sub.trim()));
    return Array.from(new Set(subs)).slice(0, 5);
  };

  // Pick a featured category or latest banner image
  const featuredCategory = categories[0] || {
    id: 'men',
    name: 'تشكيلة الرجال',
    nameEn: "MEN'S COLLECTION",
    image: `${import.meta.env.BASE_URL}images/products/eiffel-cardigan-trio.jpg`,
    subtitle: 'قصات معمارية انسيابية وخامات قطن الجيزة الفاخر',
    subtitleEn: 'Architectural Silhouettes & Egyptian Cotton'
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute top-full left-0 right-0 w-full bg-white/98 dark:bg-zinc-950/98 backdrop-blur-2xl border-b border-surface-container dark:border-zinc-800 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 py-8">
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* 1. Dynamic Categories & Subcategories (Cols 1-8) */}
          <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const catTitle = language === 'ar' ? (cat.name || cat.nameEn) : (cat.nameEn || cat.name);
              const subCats = getCategorySubcategories(cat);

              return (
                <div key={cat.id} className="space-y-3">
                  {/* Category Header Link */}
                  <Link
                    to={`/collections/${cat.id}`}
                    onClick={onClose}
                    className="group inline-flex items-center gap-2 text-xs font-bold font-editorial uppercase tracking-wider text-primary dark:text-white hover:text-amber-500 dark:hover:text-amber-400 transition-colors pb-1.5 border-b border-surface-container-high dark:border-zinc-800 w-full"
                  >
                    <span>{catTitle}</span>
                    <ChevronRight className={`w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`} />
                  </Link>

                  {/* Subcategories List */}
                  <ul className="space-y-1.5 text-xs font-mono">
                    <li>
                      <Link
                        to={`/collections/${cat.id}`}
                        onClick={onClose}
                        className="text-secondary dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors flex items-center justify-between py-0.5"
                      >
                        <span>{isRTL ? 'عرض كل القطع' : 'View All Pieces'}</span>
                        <span className="text-[10px] text-zinc-500">→</span>
                      </Link>
                    </li>
                    {subCats.map((sub) => (
                      <li key={sub}>
                        <Link
                          to={`/collections/${cat.id}?search=${encodeURIComponent(sub)}`}
                          onClick={onClose}
                          className="text-secondary/80 dark:text-zinc-400/90 hover:text-primary dark:hover:text-white transition-colors block py-0.5"
                        >
                          {sub}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {/* Quick Collections Section */}
            <div className="space-y-3">
              <div className="text-xs font-bold font-editorial uppercase tracking-wider text-primary dark:text-white pb-1.5 border-b border-surface-container-high dark:border-zinc-800">
                {isRTL ? 'تنسيقات ومجموعات' : 'CURATED HIGHLIGHTS'}
              </div>
              <ul className="space-y-2 text-xs font-mono">
                <li>
                  <Link
                    to="/collections/new-arrivals"
                    onClick={onClose}
                    className="flex items-center gap-2 text-secondary dark:text-zinc-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isRTL ? 'أحدث الإصدارات' : 'New Arrivals'}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collections/offers"
                    onClick={onClose}
                    className="flex items-center gap-2 text-secondary dark:text-zinc-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                  >
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isRTL ? 'العروض والتخفيضات' : 'Special Offers'}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collections/men?sortBy=rating"
                    onClick={onClose}
                    className="flex items-center gap-2 text-secondary dark:text-zinc-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isRTL ? 'الأكثر طلباً ومبيعاً' : 'Best Sellers'}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* 2. Featured Visual Editorial Banner (Cols 9-12) */}
          <div className="col-span-12 lg:col-span-4 pl-0 rtl:pl-0 rtl:pr-0 lg:rtl:pr-6 lg:ltr:pl-6 lg:border-l rtl:lg:border-r rtl:lg:border-l-0 border-surface-container dark:border-zinc-800/80">
            <Link
              to={`/collections/${featuredCategory.id}`}
              onClick={onClose}
              className="group relative block aspect-[16/10] overflow-hidden rounded-lg bg-zinc-900 border border-surface-container dark:border-zinc-800 shadow-md"
            >
              <CachedImage
                src={featuredCategory.image}
                alt={featuredCategory.name}
                width={500}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

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
  );
};
