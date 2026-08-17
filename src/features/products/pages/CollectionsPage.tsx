import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { CollectionBanner } from '../components/CollectionBanner';
import { CollectionFiltersBar, SortOption } from '../components/CollectionFiltersBar';
import { ActiveFilters } from '../components/ActiveFilters';
import { FilterDrawer } from '../components/FilterDrawer';
import { Product } from '@/types';
import { useLanguage } from '@/shared';
import { useStoreData } from '@/shared';

export const CollectionsPage: React.FC = () => {
  const { category = 'men' } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search') || '';
  const { t, isRTL } = useLanguage();
  const { products, categories } = useStoreData();

  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [gridCols, setGridCols] = useState<1 | 2 | 4>(2);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Category Metadata Object
  const currentCategoryObj = categories.find(c => c.id === category) || {
    id: category,
    name: category === 'men' ? 'تشكيلة الرجال' : category === 'kids' ? 'أزياء الأطفال' : category === 'accessories' ? 'القطع الجلدية والإكسسوارات' : category.toUpperCase(),
    nameEn: category === 'men' ? "MEN'S COLLECTION" : category === 'kids' ? "KIDS COLLECTION" : category === 'accessories' ? "TIMEPIECES & ACCESSORIES" : category.toUpperCase(),
    subtitle: 'قصات معمارية انسيابية وخامات قطن الجيزة الفاخر',
    subtitleEn: 'Architectural Silhouettes & Precision Tailoring',
    image: `${import.meta.env.BASE_URL}images/products/eiffel-cardigan-trio.jpg`,
    itemCount: '12 PIECES',
    subCategories: []
  };

  const getCategoryTitle = () => {
    const cat = category.toLowerCase();
    if (isRTL) {
      if (cat === 'offers') return 'العروض والتخفيضات الحصرية';
      if (cat === 'men') return 'تشكيلة الرجال';
      if (cat === 'kids') return 'أزياء الأطفال';
      if (cat === 'accessories') return 'القطع الجلدية والإكسسوارات';
      if (cat === 'new-arrivals') return 'أحدث الإصدارات';
      return currentCategoryObj.name;
    } else {
      if (cat === 'offers') return 'SPECIAL OFFERS & ARCHIVE';
      if (cat === 'men') return "MEN'S COLLECTION";
      if (cat === 'kids') return "KIDS COLLECTION";
      if (cat === 'accessories') return "TIMEPIECES & ACCESSORIES";
      if (cat === 'new-arrivals') return "NEW ARRIVALS";
      return currentCategoryObj.nameEn || currentCategoryObj.name;
    }
  };

  const getCategorySubtitle = () => {
    const cat = category.toLowerCase();
    if (isRTL) {
      if (cat === 'offers') return 'تخفيضات موسمية وباقات أطقم متكاملة بأسعار مميزة للشحن داخل مصر';
      if (cat === 'men') return 'قصات معمارية انسيابية وخامات قطن الجيزة الفاخر للرجال';
      if (cat === 'kids') return 'أزياء راقية ومريحة للأولاد والبنات بجودة وخامات تدوم طويلاً';
      if (cat === 'accessories') return 'ساعات يد ستيل، محافظ، حقائب كروس، وأساور جلدية فاخرة';
      if (cat === 'new-arrivals') return 'أحدث تشكيلات الموسم متوفرة للشحن الفوري لكافة المحافظات';
      return currentCategoryObj.subtitle;
    } else {
      if (cat === 'offers') return 'Seasonal markdowns, bundled sets & archive selections across Egypt';
      if (cat === 'men') return 'Architectural silhouettes, relaxed fits & premium Egyptian cotton';
      if (cat === 'kids') return 'Contemporary junior tailoring, varsity knits & premium summer sets';
      if (cat === 'accessories') return 'Steel chronographs, fine leather goods & handcrafted wristwear';
      if (cat === 'new-arrivals') return 'Latest seasonal releases ready for express nationwide delivery';
      return (currentCategoryObj as any).subtitleEn || 'Architectural Silhouettes & Precision Engineering';
    }
  };

  // Filter options available
  const subCategories = useMemo(() => {
    const subs = products
      .filter(p => category === 'offers' || category === 'new-arrivals' || p.category === category || (category === 'men' && p.category !== 'kids'))
      .map(p => p.subCategory);
    return ['All', ...Array.from(new Set(subs))];
  }, [category, products]);

  const allSizes = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '46 (S)', '48 (M)', '50 (L)', '4-5Y', '6-7Y'];
  const allColors = ['All', 'Onyx Noir', 'Chalk White', 'Concrete Gray', 'Carbon Black', 'Ash Grey'];

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let list = products.filter(p => {
      // Category Match
      if (category === 'offers') {
        if (p.originalPrice) return true;
        return p.isBestSeller || p.isNew;
      } else if (category === 'new-arrivals') {
        if (!p.isNew && p.category !== 'men') return false;
      } else if (category === 'men') {
        if (p.category !== 'men' && p.category !== 'accessories') return false;
      } else if (category === 'kids') {
        if (p.category !== 'kids') return false;
      } else if (category === 'accessories') {
        if (p.category !== 'accessories') return false;
      }

      // Keyword search if present
      if (searchKeyword.trim() !== '') {
        const kw = searchKeyword.toLowerCase();
        const matchesKw =
          (p.name && p.name.toLowerCase().includes(kw)) ||
          (p.subtitle && p.subtitle.toLowerCase().includes(kw)) ||
          (p.description && p.description.toLowerCase().includes(kw));
        if (!matchesKw) return false;
      }

      // SubCategory
      if (selectedSubCategory !== 'All' && p.subCategory !== selectedSubCategory) {
        return false;
      }

      // Size
      if (selectedSize !== 'All' && (!p.sizes || !p.sizes.includes(selectedSize))) {
        return false;
      }

      // Color
      if (selectedColor !== 'All' && (!p.colors || !p.colors.some(c => c.name.toLowerCase().includes(selectedColor.toLowerCase())))) {
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
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [category, products, searchKeyword, selectedSubCategory, selectedSize, selectedColor, sortBy]);

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
      {/* 1. Category Hero Banner */}
      <CollectionBanner
        category={category}
        title={getCategoryTitle()}
        subtitle={getCategorySubtitle()}
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
