import React from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ActiveFiltersProps {
  searchKeyword: string;
  selectedSubCategory: string;
  setSelectedSubCategory: (sub: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  onClearFilters: () => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  searchKeyword,
  selectedSubCategory,
  setSelectedSubCategory,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  onClearFilters,
}) => {
  const { t } = useLanguage();

  return (
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
        onClick={onClearFilters}
        className="text-xs font-label-bold text-error hover:underline ml-auto rtl:ml-0 rtl:mr-auto uppercase"
      >
        {t.clearAll}
      </button>
    </div>
  );
};
