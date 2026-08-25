import React from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '@/shared';
import { CategoryItem } from '@/types';

interface AdminProductFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  stockFilter: string;
  onStockChange: (st: string) => void;
  categories: CategoryItem[];
}

export const AdminProductFilterBar: React.FC<AdminProductFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  stockFilter,
  onStockChange,
  categories
}) => {
  const { language, t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-zinc-950 p-4 border border-zinc-800">
      {/* Search */}
      <div className="sm:col-span-6 relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.adminSearchProductsPlaceholder}
          className="w-full bg-zinc-900 border border-zinc-700 pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white transition-colors"
        />
      </div>

      {/* Category Select */}
      <div className="sm:col-span-3">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors"
        >
          <option value="all">{t.adminAllCategories}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {language === 'ar' ? (cat.name || cat.nameEn) : (cat.nameEn || cat.name)}
            </option>
          ))}
        </select>
      </div>

      {/* Stock Filter */}
      <div className="sm:col-span-3">
        <select
          value={stockFilter}
          onChange={(e) => onStockChange(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors"
        >
          <option value="all">{t.adminProductTableStatus} ({t.all})</option>
          <option value="in-stock">{t.adminFilterInStock}</option>
          <option value="out-of-stock">{t.adminFilterOutOfStock}</option>
        </select>
      </div>
    </div>
  );
};
