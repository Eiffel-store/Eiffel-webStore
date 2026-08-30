import React, { useState, useMemo, useEffect, Suspense, lazy } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { CollectionBanner } from '../components/CollectionBanner';
import { CollectionFiltersBar, SortOption } from '../components/CollectionFiltersBar';
import { ActiveFilters } from '../components/ActiveFilters';
import { FilterDrawer } from '../components/FilterDrawer';
import { Product } from '@/types';
import { useLanguage, useStoreData, CollectionsPageSkeleton, ProductGridSkeleton, EmptyState, Pagination } from '@/shared';

// Lazy-Loaded Quick View Modal
const QuickViewModal = lazy(() => import('../components/QuickViewModal').then(m => ({ default: m.QuickViewModal })));


export const CollectionsPage: React.FC = () => {
  const { category = 'men' } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search') || '';
  const { t, isRTL } = useLanguage();
  const { products, categories, isProductsLoading } = useStoreData();

  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [gridCols, setGridCols] = useState<1 | 2 | 4>(2);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  if (isProductsLoading && products.length === 0) {
    return <CollectionsPageSkeleton />;
  }


  // Category Metadata Object
  const currentCategoryObj = useMemo(() => {
    const catLower = category.toLowerCase().trim();

    // 1. Exact ID match
    let found = categories.find(c => c.id?.toLowerCase() === catLower);

    // 2. Specialized keyword matching for primary collections
    if (!found && catLower === 'men') {
      found = categories.find(c =>
        c.id?.toLowerCase() === 'men' ||
        c.name?.includes('رجال') ||
        c.name?.toLowerCase().includes('men') ||
        c.nameEn?.toLowerCase().includes('men')
      );
    } else if (!found && catLower === 'kids') {
      found = categories.find(c =>
        c.id?.toLowerCase() === 'kids' ||
        c.name?.includes('أطفال') ||
        c.name?.includes('اطفال') ||
        c.nameEn?.toLowerCase().includes('kid')
      );
    } else if (!found && catLower === 'accessories') {
      found = categories.find(c =>
        c.id?.toLowerCase() === 'accessories' ||
        c.name?.includes('إكسسوار') ||
        c.name?.includes('اكسسوار') ||
        c.nameEn?.toLowerCase().includes('accessor')
      );
    }

    // 3. Match by name or nameEn
    if (!found) {
      found = categories.find(c =>
        c.name?.toLowerCase() === catLower ||
        c.nameEn?.toLowerCase() === catLower
      );
    }

    return found || {
      id: category,
      name: category === 'men' ? 'تشكيلة الرجال' : category === 'kids' ? 'أزياء الأطفال' : category === 'accessories' ? 'القطع الجلدية والإكسسوارات' : category.toUpperCase(),
      nameEn: category === 'men' ? "MEN'S COLLECTION" : category === 'kids' ? "KIDS COLLECTION" : category === 'accessories' ? "TIMEPIECES & ACCESSORIES" : category.toUpperCase(),
      subtitle: 'قصات معمارية انسيابية وخامات قطن الجيزة الفاخر',
      subtitleEn: 'Architectural Silhouettes & Precision Tailoring',
      image: `${import.meta.env.BASE_URL}images/products/eiffel-cardigan-trio.jpg`,
      itemCount: '',
      subCategories: []
    };
  }, [categories, category]);

  const getCategoryTitle = () => {
    const cat = category.toLowerCase();
    if (isRTL) {
      if (cat === 'offers') return 'العروض والتخفيضات الحصرية';
      if (cat === 'men') return currentCategoryObj.name || 'تشكيلة الرجال';
      if (cat === 'kids') return currentCategoryObj.name || 'أزياء الأطفال';
      if (cat === 'accessories') return currentCategoryObj.name || 'القطع الجلدية والإكسسوارات';
      if (cat === 'new-arrivals') return 'أحدث الإصدارات';
      return currentCategoryObj.name;
    } else {
      if (cat === 'offers') return 'SPECIAL OFFERS & ARCHIVE';
      if (cat === 'men') return currentCategoryObj.nameEn || "MEN'S COLLECTION";
      if (cat === 'kids') return currentCategoryObj.nameEn || "KIDS COLLECTION";
      if (cat === 'accessories') return currentCategoryObj.nameEn || "TIMEPIECES & ACCESSORIES";
      if (cat === 'new-arrivals') return "NEW ARRIVALS";
      return currentCategoryObj.nameEn || currentCategoryObj.name;
    }
  };

  const getCategorySubtitle = () => {
    const cat = category.toLowerCase();
    if (isRTL) {
      if (cat === 'offers') return 'تخفيضات موسمية وباقات أطقم متكاملة بأسعار مميزة للشحن داخل مصر';
      if (cat === 'men') return currentCategoryObj.subtitle || 'قصات معمارية انسيابية وخامات قطن الجيزة الفاخر للرجال';
      if (cat === 'kids') return currentCategoryObj.subtitle || 'أزياء راقية ومريحة للأولاد والبنات بجودة وخامات تدوم طويلاً';
      if (cat === 'accessories') return currentCategoryObj.subtitle || 'ساعات يد ستيل، محافظ، حقائب كروس، وأساور جلدية فاخرة';
      if (cat === 'new-arrivals') return 'أحدث تشكيلات الموسم متوفرة للشحن الفوري لكافة المحافظات';
      return currentCategoryObj.subtitle;
    } else {
      if (cat === 'offers') return 'Seasonal markdowns, bundled sets & archive selections across Egypt';
      if (cat === 'men') return (currentCategoryObj as any).subtitleEn || 'Architectural silhouettes, relaxed fits & premium Egyptian cotton';
      if (cat === 'kids') return (currentCategoryObj as any).subtitleEn || 'Contemporary junior tailoring, varsity knits & premium summer sets';
      if (cat === 'accessories') return (currentCategoryObj as any).subtitleEn || 'Steel chronographs, fine leather goods & handcrafted wristwear';
      if (cat === 'new-arrivals') return 'Latest seasonal releases ready for express nationwide delivery';
      return (currentCategoryObj as any).subtitleEn || 'Architectural Silhouettes & Precision Engineering';
    }
  };

  // Helper to determine if a product belongs to the requested category
  const doesProductMatchCategory = (p: Product, targetCategory: string): boolean => {
    const target = targetCategory.toLowerCase().trim();
    const prodCat = (p.category || '').toLowerCase().trim();

    if (target === 'offers' || target === 'sale') {
      return Boolean((p.originalPrice && p.originalPrice > p.price) || prodCat === 'offers' || prodCat === 'sale');
    }

    if (target === 'new-arrivals') {
      return Boolean(p.isNew || prodCat === 'new-arrivals');
    }

    // Direct match with category ID or target string
    if (prodCat === target) {
      return true;
    }

    // Match with currentCategoryObj properties
    if (currentCategoryObj && (
      p.category === currentCategoryObj.id ||
      prodCat === currentCategoryObj.id?.toLowerCase() ||
      prodCat === currentCategoryObj.name?.toLowerCase() ||
      prodCat === currentCategoryObj.nameEn?.toLowerCase()
    )) {
      return true;
    }

    // Lookup the category definition object for the product
    const prodCategoryDef = categories.find(c =>
      c.id?.toLowerCase() === prodCat ||
      c.name?.toLowerCase() === prodCat ||
      c.nameEn?.toLowerCase() === prodCat
    );

    // Section-specific smart matching
    if (target === 'men') {
      // If product category explicitly matches 'men' or related aliases
      if (prodCat === 'men' || prodCat === 'mens' || prodCat === 'men-clothing') return true;
      if (prodCat.includes('رجال') || prodCat.includes('men')) return true;

      // If product category definition is Men
      if (prodCategoryDef && (
        prodCategoryDef.id?.toLowerCase() === 'men' ||
        prodCategoryDef.name?.includes('رجال') ||
        prodCategoryDef.nameEn?.toLowerCase().includes('men')
      )) {
        return true;
      }

      // If product does not belong to kids or accessories, treat as part of men/general catalog
      const isKids = prodCat === 'kids' || prodCategoryDef?.name?.includes('أطفال') || prodCategoryDef?.name?.includes('اطفال') || prodCategoryDef?.nameEn?.toLowerCase().includes('kid');
      const isAccessories = prodCat === 'accessories' || prodCategoryDef?.name?.includes('إكسسوار') || prodCategoryDef?.name?.includes('اكسسوار') || prodCategoryDef?.nameEn?.toLowerCase().includes('accessor');

      // If not kids, it belongs in Men's / General clothing collection
      return !isKids && !isAccessories;
    }

    if (target === 'kids') {
      if (prodCat === 'kids' || prodCat.includes('طفل') || prodCat.includes('أطفال') || prodCat.includes('اطفال') || prodCat.includes('kid')) return true;
      if (prodCategoryDef && (
        prodCategoryDef.id?.toLowerCase() === 'kids' ||
        prodCategoryDef.name?.includes('أطفال') ||
        prodCategoryDef.name?.includes('اطفال') ||
        prodCategoryDef.nameEn?.toLowerCase().includes('kid')
      )) {
        return true;
      }
      return false;
    }

    if (target === 'accessories') {
      if (prodCat === 'accessories' || prodCat.includes('إكسسوار') || prodCat.includes('اكسسوار') || prodCat.includes('ساعات') || prodCat.includes('حقائب') || prodCat.includes('access')) return true;
      if (prodCategoryDef && (
        prodCategoryDef.id?.toLowerCase() === 'accessories' ||
        prodCategoryDef.name?.includes('إكسسوار') ||
        prodCategoryDef.name?.includes('اكسسوار') ||
        prodCategoryDef.nameEn?.toLowerCase().includes('accessor')
      )) {
        return true;
      }
      return false;
    }

    // Generic Custom Category ID/Name match
    return Boolean(
      prodCat === target ||
      (prodCategoryDef && (
        prodCategoryDef.id?.toLowerCase() === target ||
        prodCategoryDef.name?.toLowerCase() === target ||
        prodCategoryDef.nameEn?.toLowerCase() === target
      ))
    );
  };

  // Filter options available
  const subCategories = useMemo(() => {
    const subs = products
      .filter(p => doesProductMatchCategory(p, category))
      .map(p => p.subCategory)
      .filter((sub): sub is string => Boolean(sub && sub.trim()));
    return ['All', ...Array.from(new Set(subs))];
  }, [category, products, currentCategoryObj, categories]);

  const allSizes = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '46 (S)', '48 (M)', '50 (L)', '4-5Y', '6-7Y'];
  const allColors = ['All', 'Onyx Noir', 'Chalk White', 'Concrete Gray', 'Carbon Black', 'Ash Grey'];

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let list = products.filter(p => {
      // Category Match
      if (!doesProductMatchCategory(p, category)) {
        return false;
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
      if (selectedSubCategory !== 'All') {
        const subCatMatch = p.subCategory?.toLowerCase().trim() === selectedSubCategory.toLowerCase().trim();
        if (!subCatMatch) {
          return false;
        }
      }

      // Size
      if (selectedSize !== 'All' && (!p.sizes || !p.sizes.includes(selectedSize))) {
        return false;
      }

      // Color
      if (selectedColor !== 'All' && (!p.colors || !p.colors.some(c => c && c.name && c.name.toLowerCase().includes(selectedColor.toLowerCase())))) {
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
  }, [category, products, searchKeyword, selectedSubCategory, selectedSize, selectedColor, sortBy, currentCategoryObj, categories]);

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category, searchKeyword, selectedSubCategory, selectedSize, selectedColor, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

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
        {!isProductsLoading && (
          <div className="flex justify-between items-center text-[11px] sm:text-xs font-mono text-secondary dark:text-zinc-400 mb-4 sm:mb-6 px-1">
            <span>{t.showingSilhouettes} ({filteredProducts.length})</span>
            <span>{t.curatedCollection}</span>
          </div>
        )}

        {/* Loading State vs Empty State vs Product Cards Grid */}
        {isProductsLoading ? (
          <ProductGridSkeleton count={8} cols={4} />
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            title={hasActiveFilters
              ? t.noPiecesFound
              : (isRTL ? `لا توجد منتجات مضافة في قسم ${getCategoryTitle()} حالياً` : `No products currently available in ${getCategoryTitle()}`)}
            description={hasActiveFilters
              ? t.noPiecesFoundDesc
              : (isRTL ? 'يتم تحضير وإضافة أحدث تشكيلات وإصدارات هذا القسم في المشغل قريباً. تفضل باستكشاف تشكيلة الرجال أو العروض المتاحة.' : 'New pieces are being crafted. Explore our active collections.')}
            actionText={hasActiveFilters ? t.resetFilters : (category !== 'men' ? (isRTL ? 'استكشف تشكيلة الرجال' : "Explore Men's Collection") : (isRTL ? 'العودة للرئيسية' : 'Back to Home'))}
            onAction={hasActiveFilters ? clearFilters : undefined}
            actionLink={!hasActiveFilters ? (category !== 'men' ? '/collections/men' : '/') : undefined}
          />
        ) : (
          <>
            <div
              className={`grid gap-3 sm:gap-6 ${
                gridCols === 1
                  ? 'grid-cols-1 max-w-md mx-auto sm:max-w-none sm:grid-cols-2 lg:grid-cols-4'
                  : gridCols === 2
                  ? 'grid-cols-2 lg:grid-cols-4'
                  : 'grid-cols-2 lg:grid-cols-4'
              }`}
            >
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {filteredProducts.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredProducts.length}
                pageSize={pageSize}
                onPageChange={(p) => {
                  setCurrentPage(p);
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }}
                onPageSizeChange={(s) => {
                  setPageSize(s);
                  setCurrentPage(1);
                }}
                pageSizeOptions={[8, 12, 24, 48]}
                className="mt-10"
              />
            )}
          </>
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
        <Suspense fallback={null}>
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        </Suspense>
      )}
    </div>
  );
};
