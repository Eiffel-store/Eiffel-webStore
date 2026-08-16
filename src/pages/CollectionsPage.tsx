import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { CollectionBanner } from '../components/collection/CollectionBanner';
import { CollectionFiltersBar, SortOption } from '../components/collection/CollectionFiltersBar';
import { ActiveFilters } from '../components/collection/ActiveFilters';
import { FilterDrawer } from '../components/collection/FilterDrawer';
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
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [gridCols, setGridCols] = useState<1 | 2 | 4>(2);
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
      <CollectionBanner
        category={category}
        title={getCategoryTitle()}
        subtitle={currentCategoryObj.subtitle}
        image={currentCategoryObj.image}
      />

      {/* 2. FILTER & SORT BAR */}
      <CollectionFiltersBar
        subCategories={subCategories}
        selectedSubCategory={selectedSubCategory}
        setSelectedSubCategory={setSelectedSubCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        gridCols={gridCols}
        setGridCols={setGridCols}
        hasActiveFilters={hasActiveFilters}
        onOpenFilterDrawer={() => setFilterDrawerOpen(true)}
      />

      {/* 3. PRODUCT CATALOG GRID */}
      <section className="py-8 sm:py-12 px-3 sm:px-8 md:px-12 max-w-[1440px] mx-auto w-full">
        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <ActiveFilters
            searchKeyword={searchKeyword}
            selectedSubCategory={selectedSubCategory}
            setSelectedSubCategory={setSelectedSubCategory}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            onClearFilters={clearFilters}
          />
        )}

        {/* Results Counter */}
        <div className="flex justify-between items-center text-[11px] sm:text-xs font-mono text-secondary dark:text-zinc-400 mb-4 sm:mb-6 px-1">
          <span>{t.showingSilhouettes} ({filteredProducts.length})</span>
          <span>{t.curatedCollection}</span>
        </div>

        {/* Empty State vs Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center px-4">
            <h3 className="font-editorial text-2xl sm:text-3xl text-primary dark:text-white mb-2">
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
            className={`grid gap-3 sm:gap-6 ${
              gridCols === 1
                ? 'grid-cols-1 max-w-md mx-auto sm:max-w-none sm:grid-cols-2 lg:grid-cols-4'
                : gridCols === 2
                ? 'grid-cols-2 lg:grid-cols-4'
                : 'grid-cols-2 lg:grid-cols-4'
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

      {/* Filter Drawer Modal */}
      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        subCategories={subCategories}
        selectedSubCategory={selectedSubCategory}
        setSelectedSubCategory={setSelectedSubCategory}
        allSizes={allSizes}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        allColors={allColors}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        totalFilteredCount={filteredProducts.length}
        onClearFilters={clearFilters}
      />

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
