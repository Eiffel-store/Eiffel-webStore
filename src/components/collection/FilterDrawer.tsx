import React from 'react';
import { X, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  subCategories: string[];
  selectedSubCategory: string;
  setSelectedSubCategory: (sub: string) => void;
  allSizes: string[];
  selectedSize: string;
  setSelectedSize: (sz: string) => void;
  allColors: string[];
  selectedColor: string;
  setSelectedColor: (c: string) => void;
  totalFilteredCount: number;
  onClearFilters: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  subCategories,
  selectedSubCategory,
  setSelectedSubCategory,
  allSizes,
  selectedSize,
  setSelectedSize,
  allColors,
  selectedColor,
  setSelectedColor,
  totalFilteredCount,
  onClearFilters,
}) => {
  const { t, isRTL } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`fixed inset-y-0 ${isRTL ? 'left-0' : 'right-0'} max-w-full flex pl-0 sm:pl-10 rtl:pr-0 rtl:sm:pr-10`}>
        <div className="w-screen max-w-full sm:max-w-sm bg-surface-container-lowest dark:bg-zinc-950 p-5 sm:p-6 flex flex-col justify-between shadow-2xl border-l rtl:border-l-0 rtl:border-r border-surface-container dark:border-zinc-800 animate-slide-right overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-surface-container dark:border-zinc-800">
              <h3 className="font-editorial text-2xl text-primary dark:text-white tracking-wider">
                {t.refineCollection}
              </h3>
              <button onClick={onClose} className="p-1 text-primary dark:text-white hover:opacity-70">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Subcategory */}
            <div className="py-5 border-b border-surface-container dark:border-zinc-800">
              <span className="text-xs font-label-bold text-secondary dark:text-zinc-400 uppercase tracking-wider block mb-3">
                {t.subCategory}
              </span>
              <div className="space-y-1.5">
                {subCategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubCategory(sub)}
                    className={`w-full text-left rtl:text-right py-1.5 px-2 text-xs font-label-bold uppercase flex justify-between items-center transition-colors rounded ${
                      selectedSubCategory === sub
                        ? 'bg-surface-container-high dark:bg-zinc-800 text-primary dark:text-white font-bold'
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
            <div className="py-5 border-b border-surface-container dark:border-zinc-800">
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
            <div className="py-5">
              <span className="text-xs font-label-bold text-secondary dark:text-zinc-400 uppercase tracking-wider block mb-3">
                {t.colorPalette}
              </span>
              <div className="space-y-1.5">
                {allColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-full text-left rtl:text-right py-1.5 px-2 text-xs font-label-bold uppercase flex justify-between items-center transition-colors rounded ${
                      selectedColor === color
                        ? 'bg-surface-container-high dark:bg-zinc-800 text-primary dark:text-white font-bold'
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
          <div className="pt-4 border-t border-surface-container dark:border-zinc-800 flex gap-3 sticky bottom-0 bg-surface-container-lowest dark:bg-zinc-950 pb-2">
            <button
              onClick={onClearFilters}
              className="flex-1 py-3 border border-surface-container dark:border-zinc-800 text-xs font-label-bold tracking-widest uppercase hover:bg-surface-container-high"
            >
              {t.resetFilters}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-primary text-white dark:bg-white dark:text-black text-xs font-label-bold tracking-widest uppercase hover:bg-neutral-800 shadow-md"
            >
              {t.applyFilters} ({totalFilteredCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
