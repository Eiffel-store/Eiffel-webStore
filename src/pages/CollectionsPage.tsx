import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, Grid3X3, LayoutGrid, ChevronDown, Check, X } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const CollectionsPage: React.FC = () => {
  const { category = 'men' } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search') || '';
  const { t, isRTL } = useLanguage();

  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [gridCols, setGridCols] = useState<2 | 4>(4);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Category Metadata
  const currentCategoryObj = CATEGORIES.find(c => c.id === category) || {
    id: category,
    title: category.toUpperCase() + ' COLLECTION',
    subtitle: 'Brutalist Silhouettes & Precision Engineering',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCErD6tC4cxMIzFUUd37x4CYmKq52RgCrx4tv4AyEYiC9QIDgB499aw331BQtje-lLQUBw6jyjGDvGGtWeuT-hyT_mIVqVHhI8GiGeBUbZk1kLUc82ZatLT8bnAhQYMLj2M0jRAeM2JTI_HLjwbFO524e7x9BdufnA48VH87wA00MYsevKPI_kl0QZxzuuQlMXFj075TZfeXtph153k5xOAg2KuaAKnY5be_pYcBKwWOVmOhDcpLbz_ww'
  };

  const getCategoryTitle = () => {
    if (isRTL) {
      if (category === 'men') return 'تشكيلة الرجال';
      if (category === 'kids') return 'أزياء الأطفال';
      if (category === 'accessories') return 'القطع الجلدية والإكسسوارات';
      if (category === 'new-arrivals') return 'مجموعة 04 / أحدث الإصدارات';
    }
    return currentCategoryObj.title;
  };

  // Filter options available
  const subCategories = useMemo(() => {
    const subs = PRODUCTS
      .filter(p => category === 'new-arrivals' || p.category === category || (category === 'men' && p.category !== 'kids'))
      .map(p => p.subCategory);
    return ['All', ...Array.from(new Set(subs))];
  }, [category]);

  const allSizes = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '46 (S)', '48 (M)', '50 (L)', '4-5Y', '6-7Y'];
  const allColors = ['All', 'Onyx Noir', 'Chalk White', 'Concrete Gray', 'Carbon Black', 'Ash Grey'];

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let list = PRODUCTS.filter(p => {
      // Category Match
      if (category === 'new-arrivals') {
        if (!p.isNew && p.category !== 'men') return false;
      } else if (category === 'men') {
        if (p.category !== 'men' && p.category !== 'accessories') return false;
      } else if (category === 'kids') {
        if (p.category !== 'kids') return false;
      } else if (category === 'accessories') {
        if (p.category !== 'accessories') return false;
      }

      // Keyword search if present
      if (searchKeyword) {
        const query = searchKeyword.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(query) ||
          p.subtitle.toLowerCase().includes(query) ||
          p.subCategory.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // SubCategory
      if (selectedSubCategory !== 'All' && p.subCategory !== selectedSubCategory) {
        return false;
      }

      // Size
      if (selectedSize !== 'All' && !p.sizes.some(s => s.includes(selectedSize))) {
        return false;
      }

      // Color
      if (selectedColor !== 'All' && !p.colors.some(c => c.name.includes(selectedColor))) {
        return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [category, searchKeyword, selectedSubCategory, selectedSize, selectedColor, sortBy]);

  const clearFilters = () => {
    setSelectedSubCategory('All');
    setSelectedSize('All');
    setSelectedColor('All');
    setSortBy('featured');
    if (searchKeyword) setSearchParams({});
  };

  const hasActiveFilters = selectedSubCategory !== 'All' || selectedSize !== 'All' || selectedColor !== 'All' || searchKeyword !== '';

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* 1. COLLECTION EDITORIAL BANNER */}
      <section className="relative h-64 sm:h-80 md:h-96 w-full bg-zinc-950 flex items-end overflow-hidden border-b border-surface-container dark:border-zinc-800">
        <img
          src={currentCategoryObj.image}
          alt={currentCategoryObj.title}
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
            {getCategoryTitle()}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl font-light mt-1">
            {currentCategoryObj.subtitle}
          </p>
        </div>
      </section>

      {/* 2. FILTER & SORT BAR */}
      <section className="sticky top-[80px] z-30 bg-surface-container-lowest/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-surface-container dark:border-zinc-800 py-3.5 px-4 sm:px-8 md:px-12 transition-all">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Subcategory Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-2xl">
            {subCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubCategory(sub)}
                className={`px-3.5 py-1.5 text-xs font-label-bold tracking-wider uppercase whitespace-nowrap transition-all border ${
                  selectedSubCategory === sub
                    ? 'bg-primary text-white dark:bg-white dark:text-black border-primary dark:border-white'
                    : 'border-surface-container dark:border-zinc-800 text-secondary dark:text-zinc-400 hover:border-primary'
                }`}
              >
                {sub === 'All' ? t.viewAll : sub}
              </button>
            ))}
          </div>

          {/* Right Controls: Filter Drawer Toggle, Sort, Grid Switch */}
          <div className="flex items-center gap-3">
            {/* Filter Toggle */}
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 border border-surface-container dark:border-zinc-800 hover:border-primary text-xs font-label-bold tracking-wider uppercase text-primary dark:text-white transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{t.filters}</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-primary dark:bg-white" />
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-transparent border border-surface-container dark:border-zinc-800 text-xs font-label-bold tracking-wider px-3 py-1.5 pr-8 rtl:pr-3 rtl:pl-8 uppercase text-primary dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="featured">{t.sortFeatured}</option>
                <option value="price-low">{t.sortPriceLow}</option>
                <option value="price-high">{t.sortPriceHigh}</option>
                <option value="rating">{t.sortTopRated}</option>
              </select>
              <ChevronDown className="w-3 h-3 text-secondary absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Grid Layout Switcher */}
            <div className="hidden sm:flex items-center border border-surface-container dark:border-zinc-800">
              <button
                onClick={() => setGridCols(2)}
                className={`p-1.5 ${gridCols === 2 ? 'bg-surface-container-high dark:bg-zinc-800 text-primary dark:text-white' : 'text-secondary'}`}
                title="2 Columns"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1.5 ${gridCols === 4 ? 'bg-surface-container-high dark:bg-zinc-800 text-primary dark:text-white' : 'text-secondary'}`}
                title="4 Columns"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT CATALOG GRID */}
      <section className="py-12 px-4 sm:px-8 md:px-12 max-w-[1440px] mx-auto w-full">
        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-8 p-3 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 text-xs">
            <span className="font-label-bold text-secondary dark:text-zinc-400 uppercase mr-2 rtl:mr-0 rtl:ml-2">{t.filters}:</span>
            {searchKeyword && (
              <span className="px-2.5 py-1 bg-surface-container-lowest dark:bg-zinc-800 border border-surface-container dark:border-zinc-700 text-primary dark:text-white flex items-center gap-1 font-mono">
                Keyword: "{searchKeyword}"
              </span>
            )}
            {selectedSubCategory !== 'All' && (
              <span className="px-2.5 py-1 bg-surface-container-lowest dark:bg-zinc-800 border border-surface-container dark:border-zinc-700 text-primary dark:text-white flex items-center gap-1">
                {selectedSubCategory}
                <button onClick={() => setSelectedSubCategory('All')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedSize !== 'All' && (
              <span className="px-2.5 py-1 bg-surface-container-lowest dark:bg-zinc-800 border border-surface-container dark:border-zinc-700 text-primary dark:text-white flex items-center gap-1">
                {t.size}: {selectedSize}
                <button onClick={() => setSelectedSize('All')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedColor !== 'All' && (
              <span className="px-2.5 py-1 bg-surface-container-lowest dark:bg-zinc-800 border border-surface-container dark:border-zinc-700 text-primary dark:text-white flex items-center gap-1">
                {selectedColor}
                <button onClick={() => setSelectedColor('All')}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-xs font-label-bold text-error hover:underline ml-auto rtl:ml-0 rtl:mr-auto uppercase"
            >
              {t.clearAll}
            </button>
          </div>
        )}

        {/* Results Counter */}
        <div className="flex justify-between items-center text-xs font-mono text-secondary dark:text-zinc-400 mb-6">
          <span>{t.showingSilhouettes} ({filteredProducts.length})</span>
          <span>{t.curatedCollection}</span>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center">
            <h3 className="font-editorial text-3xl text-primary dark:text-white mb-2">
              {t.noPiecesFound}
            </h3>
            <p className="text-xs text-secondary dark:text-zinc-400 max-w-sm mx-auto mb-6 font-light">
              {t.noPiecesFoundDesc}
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase"
            >
              {t.resetFilters}
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              gridCols === 2
                ? 'grid-cols-1 md:grid-cols-2 gap-8'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            }`}
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* FILTER DRAWER MODAL */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setFilterDrawerOpen(false)}
          />
          <div className={`fixed inset-y-0 ${isRTL ? 'left-0' : 'right-0'} max-w-full flex ${isRTL ? 'pr-10' : 'pl-10'}`}>
            <div className="w-screen max-w-sm bg-surface-container-lowest dark:bg-zinc-950 p-6 flex flex-col justify-between shadow-2xl border-l rtl:border-l-0 rtl:border-r border-surface-container dark:border-zinc-800 animate-slide-right">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-surface-container dark:border-zinc-800">
                  <h3 className="font-editorial text-2xl text-primary dark:text-white tracking-wider">
                    {t.refineCollection}
                  </h3>
                  <button onClick={() => setFilterDrawerOpen(false)}>
                    <X className="w-6 h-6 text-primary dark:text-white" />
                  </button>
                </div>

                {/* Subcategory */}
                <div className="py-6 border-b border-surface-container dark:border-zinc-800">
                  <span className="text-xs font-label-bold text-secondary dark:text-zinc-400 uppercase tracking-wider block mb-3">
                    {t.subCategory}
                  </span>
                  <div className="space-y-2">
                    {subCategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubCategory(sub)}
                        className={`w-full text-left rtl:text-right py-1 text-xs font-label-bold uppercase flex justify-between items-center transition-colors ${
                          selectedSubCategory === sub
                            ? 'text-primary dark:text-white font-bold'
                            : 'text-secondary dark:text-zinc-400 hover:text-primary'
                        }`}
                      >
                        <span>{sub === 'All' ? t.viewAll : sub}</span>
                        {selectedSubCategory === sub && <Check className="w-3.5 h-3.5 text-primary dark:text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Filter */}
                <div className="py-6 border-b border-surface-container dark:border-zinc-800">
                  <span className="text-xs font-label-bold text-secondary dark:text-zinc-400 uppercase tracking-wider block mb-3">
                    {t.size}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {allSizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-2 text-xs font-label-bold border transition-all text-center uppercase ${
                          selectedSize === sz
                            ? 'bg-primary text-white dark:bg-white dark:text-black border-primary'
                            : 'border-surface-container dark:border-zinc-800 text-secondary dark:text-zinc-400 hover:border-primary'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Filter */}
                <div className="py-6">
                  <span className="text-xs font-label-bold text-secondary dark:text-zinc-400 uppercase tracking-wider block mb-3">
                    {t.colorPalette}
                  </span>
                  <div className="space-y-2">
                    {allColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-full text-left rtl:text-right py-1 text-xs font-label-bold uppercase flex justify-between items-center transition-colors ${
                          selectedColor === color
                            ? 'text-primary dark:text-white font-bold'
                            : 'text-secondary dark:text-zinc-400 hover:text-primary'
                        }`}
                      >
                        <span>{color}</span>
                        {selectedColor === color && <Check className="w-3.5 h-3.5 text-primary dark:text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-surface-container dark:border-zinc-800 flex gap-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3 border border-surface-container dark:border-zinc-800 text-xs font-label-bold tracking-widest uppercase hover:bg-surface-container-high"
                >
                  {t.resetFilters}
                </button>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="flex-1 py-3 bg-primary text-white dark:bg-white dark:text-black text-xs font-label-bold tracking-widest uppercase hover:bg-neutral-800"
                >
                  {t.applyFilters} ({filteredProducts.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
