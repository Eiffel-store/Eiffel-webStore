import React from 'react';
import { SlidersHorizontal, ChevronDown, LayoutGrid, Grid3X3, Square } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating';

interface CollectionFiltersBarProps {
  subCategories: string[];
  selectedSubCategory: string;
  setSelectedSubCategory: (sub: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  gridCols: 1 | 2 | 4;
  setGridCols: (cols: 1 | 2 | 4) => void;
  hasActiveFilters: boolean;
  onOpenFilterDrawer: () => void;
}

export const CollectionFiltersBar: React.FC<CollectionFiltersBarProps> = ({
  subCategories,
  selectedSubCategory,
  setSelectedSubCategory,
  sortBy,
  setSortBy,
  gridCols,
  setGridCols,
  hasActiveFilters,
  onOpenFilterDrawer,
}) => {
  const { t } = useLanguage();

  return (
    <section className="sticky top-[64px] sm:top-[80px] z-30 bg-surface-container-lowest/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-surface-container dark:border-zinc-800 py-2.5 sm:py-3.5 px-3 sm:px-8 md:px-12 transition-all shadow-sm">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4">
        {/* Subcategory Pills - Horizontal scroll */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {subCategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubCategory(sub)}
              className={`px-3 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-label-bold tracking-wider uppercase whitespace-nowrap transition-all border shrink-0 ${
                selectedSubCategory === sub
                  ? 'bg-primary text-white dark:bg-white dark:text-black border-primary dark:border-white shadow-sm'
                  : 'border-surface-container dark:border-zinc-800 text-secondary dark:text-zinc-400 hover:border-primary bg-surface-container-low/50 dark:bg-zinc-900/50'
              }`}
            >
              {sub === 'All' ? t.viewAll : sub}
            </button>
          ))}
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-3 w-full md:w-auto pt-1 md:pt-0 border-t md:border-t-0 border-surface-container/50 dark:border-zinc-850">
          {/* Filter Toggle */}
          <button
            onClick={onOpenFilterDrawer}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 border border-surface-container dark:border-zinc-800 hover:border-primary text-[11px] sm:text-xs font-label-bold tracking-wider uppercase text-primary dark:text-white transition-colors bg-surface-container-lowest dark:bg-zinc-950"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{t.filters}</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-primary dark:bg-white animate-pulse" />
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex-1 md:flex-none">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full appearance-none bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-800 text-[11px] sm:text-xs font-label-bold tracking-wider px-2.5 sm:px-3 py-1.5 pr-7 rtl:pr-2.5 rtl:pl-7 uppercase text-primary dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="featured">{t.sortFeatured}</option>
              <option value="price-low">{t.sortPriceLow}</option>
              <option value="price-high">{t.sortPriceHigh}</option>
              <option value="rating">{t.sortTopRated}</option>
            </select>
            <ChevronDown className="w-3 h-3 text-secondary absolute right-2 rtl:right-auto rtl:left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Mobile Grid Layout Switcher (1 vs 2 cols) */}
          <div className="flex sm:hidden items-center border border-surface-container dark:border-zinc-800 bg-surface-container-lowest dark:bg-zinc-950">
            <button
              onClick={() => setGridCols(1)}
              className={`p-1.5 ${gridCols === 1 ? 'bg-surface-container-high dark:bg-zinc-800 text-primary dark:text-white' : 'text-secondary'}`}
              title="1 Column"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setGridCols(2)}
              className={`p-1.5 ${gridCols === 2 ? 'bg-surface-container-high dark:bg-zinc-800 text-primary dark:text-white' : 'text-secondary'}`}
              title="2 Columns"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Desktop Grid Layout Switcher (2 vs 4 cols) */}
          <div className="hidden sm:flex items-center border border-surface-container dark:border-zinc-800 bg-surface-container-lowest dark:bg-zinc-950">
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
  );
};
