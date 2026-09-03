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
  const { t, language } = useLanguage();
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


  // Dynamic 100% Data-Driven Category Resolution
  const currentCategoryObj = useMemo(() => {
    const catSlug = category.toLowerCase().trim();

    // Special predefined query views
    if (catSlug === 'offers' || catSlug === 'sale') {
      return {
        id: 'offers',
        name: t.specialOffersDeals,
        nameEn: 'SPECIAL OFFERS & DEALS',
        subtitle: t.offersSubtitle,
        image: `${import.meta.env.BASE_URL}images/products/eiffel-cardigan-trio.jpg`,
        itemCount: '',
        subCategories: []
      };
    }

    if (catSlug === 'new-arrivals') {
      return {
        id: 'new-arrivals',
        name: t.newArrivalsTitle,
        nameEn: 'NEW ARRIVALS',
        subtitle: t.newArrivalsSubtitle,
        image: `${import.meta.env.BASE_URL}images/products/eiffel-cardigan-trio.jpg`,
        itemCount: '',
        subCategories: []
      };
    }

    // 1. Direct or Smart Fuzzy Match from Database Categories
    const found = categories.find(c => {
      const cId = (c.id || '').toLowerCase().trim();
      const cName = (c.name || '').toLowerCase().trim();
      const cNameEn = (c.nameEn || '').toLowerCase().trim();

      // Exact match with ID or names
      if (cId === catSlug || cName === catSlug || cNameEn === catSlug) return true;

      // URL Slug match (e.g. 'shoes-&-footwear' or 'shoes')
      if (cId.includes(catSlug) || catSlug.includes(cId)) return true;
      if (cNameEn.includes(catSlug) || catSlug.includes(cNameEn)) return true;

      // Common category keyword synonyms
      if (catSlug === 'shoes' && (cName.includes('حذاء') || cName.includes('أحذية') || cName.includes('احذية') || cNameEn.includes('shoe') || cId.includes('shoe'))) return true;
      if (catSlug === 'men' && (cName.includes('رجال') || cName.includes('رجالي') || cNameEn.includes('men') || cId.includes('men'))) return true;
      if (catSlug === 'kids' && (cName.includes('أطفال') || cName.includes('اطفال') || cNameEn.includes('kid') || cId.includes('kid'))) return true;
      if (catSlug === 'accessories' && (cName.includes('إكسسوار') || cName.includes('اكسسوار') || cNameEn.includes('access') || cId.includes('access'))) return true;

      return false;
    });

    if (found) {
      return found;
    }

    // 2. Universal Dynamic Fallback: Formats any custom slug into a clean title
    const formattedTitle = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return {
      id: category,
      name: formattedTitle,
      nameEn: formattedTitle.toUpperCase(),
      subtitle: '',
      image: `${import.meta.env.BASE_URL}images/products/eiffel-cardigan-trio.jpg`,
      itemCount: '',
      subCategories: []
    };
  }, [categories, category, language]);

  const getCategoryTitle = () => {
    if (language === 'ar') {
      return currentCategoryObj.name || category;
    }
    return currentCategoryObj.nameEn || currentCategoryObj.name || category.toUpperCase();
  };

  const getCategorySubtitle = () => {
    return currentCategoryObj.subtitle || (currentCategoryObj as any).subtitleEn || '';
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

    // Lookup the category definition object for the product
    const prodCategoryDef = categories.find(c =>
      c.id?.toLowerCase() === prodCat ||
      c.name?.toLowerCase() === prodCat ||
      c.nameEn?.toLowerCase() === prodCat
    );

    // Section-specific smart matching
    if (target === 'shoes' || target === 'footwear' || target.includes('shoe')) {
      if (prodCat === 'shoes' || prodCat.includes('حذاء') || prodCat.includes('أحذية') || prodCat.includes('احذية') || prodCat.includes('shoe') || prodCat.includes('sneaker') || prodCat.includes('boot') || prodCat.includes('loafer')) return true;
      if (prodCategoryDef && (
        prodCategoryDef.id?.toLowerCase().includes('shoe') ||
        prodCategoryDef.name?.includes('حذاء') ||
        prodCategoryDef.name?.includes('أحذية') ||
        prodCategoryDef.nameEn?.toLowerCase().includes('shoe')
      )) {
        return true;
      }
      return false;
    }

    if (target === 'men') {
      // If product category explicitly matches 'men' or related aliases
      if (prodCat === 'men' || prodCat === 'mens' || prodCat === 'men-clothing') return true;
      if (prodCat.includes('رجال') || prodCat.includes('men')) return true;

      // If product category definition is Men
      if (prodCategoryDef && (
        prodCategoryDef.id?.toLowerCase().includes('men') ||
        prodCategoryDef.name?.includes('رجال') ||
        prodCategoryDef.nameEn?.toLowerCase().includes('men')
      )) {
        return true;
      }

      // If product does not belong to kids, shoes, or accessories, treat as part of men/general catalog
      const isKids = prodCat === 'kids' || prodCategoryDef?.name?.includes('أطفال') || prodCategoryDef?.name?.includes('اطفال') || prodCategoryDef?.nameEn?.toLowerCase().includes('kid');
      const isAccessories = prodCat === 'accessories' || prodCategoryDef?.name?.includes('إكسسوار') || prodCategoryDef?.name?.includes('اكسسوار') || prodCategoryDef?.nameEn?.toLowerCase().includes('accessor');
      const isShoes = prodCat.includes('shoe') || prodCat.includes('حذاء') || prodCat.includes('أحذية') || prodCategoryDef?.nameEn?.toLowerCase().includes('shoe');

      return !isKids && !isAccessories && !isShoes;
    }

    if (target === 'kids') {
      if (prodCat === 'kids' || prodCat.includes('طفل') || prodCat.includes('أطفال') || prodCat.includes('اطفال') || prodCat.includes('kid')) return true;
      if (prodCategoryDef && (
        prodCategoryDef.id?.toLowerCase().includes('kid') ||
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
        prodCategoryDef.id?.toLowerCase().includes('access') ||
        prodCategoryDef.name?.includes('إكسسوار') ||
        prodCategoryDef.name?.includes('اكسسوار') ||
        prodCategoryDef.nameEn?.toLowerCase().includes('access')
      )) {
        return true;
      }
      return false;
    }

    // Generic Custom Category ID/Name match
    return Boolean(
      prodCat === target ||
      (currentCategoryObj && (
        p.category === currentCategoryObj.id ||
        prodCat === currentCategoryObj.id?.toLowerCase() ||
        prodCat === currentCategoryObj.name?.toLowerCase() ||
        prodCat === currentCategoryObj.nameEn?.toLowerCase()
      )) ||
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

  if (isProductsLoading && products.length === 0) {
    return <CollectionsPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* 1. Category Hero Banner */}
      <CollectionBanner
        category={category}
        title={getCategoryTitle()}
        subtitle={getCategorySubtitle()}
        image={currentCategoryObj.image}
      />

      {/* 2. FILTER & SORT BAR (Starts from the exact same vertical guide line) */}
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

      {/* 3. PRODUCT CATALOG GRID (Starts from the exact same vertical guide line) */}
      <section className="py-8 sm:py-12 px-4 sm:px-8 md:px-12 max-w-[1440px] mx-auto w-full">
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

        {/* Loading State vs Empty State vs Product Cards Grid */}
        {isProductsLoading ? (
          <ProductGridSkeleton count={8} cols={4} />
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            title={hasActiveFilters
              ? t.noPiecesFound
              : t.noProductsInCategoryNamed.replace('{category}', getCategoryTitle())}
            description={hasActiveFilters
              ? t.noPiecesFoundDesc
              : t.newPiecesComingSoon}
            actionText={hasActiveFilters ? t.resetFilters : (category !== 'men' ? t.exploreMenCollection : t.backToHome)}
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
              {paginatedProducts.map((product, index) => (
                <ProductCard
                  key={`${product.id}-${index}`}
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
