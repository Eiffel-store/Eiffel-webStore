import React from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '@/shared';

interface AdminProductFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  stockFilter: string;
  onStockChange: (st: string) => void;
}

export const AdminProductFilterBar: React.FC<AdminProductFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  stockFilter,
  onStockChange
}) => {
  const { isRTL } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-zinc-950 p-4 border border-zinc-800">
      {/* Search */}
      <div className="sm:col-span-6 relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={isRTL ? 'بحث باسم المنتج أو الكود...' : 'Search by product name or code...'}
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
          <option value="all">{isRTL ? 'جميع الأقسام' : 'All Categories'}</option>
          <option value="men">{isRTL ? 'رجالي (Men)' : 'Men'}</option>
          <option value="kids">{isRTL ? 'أطفال (Kids)' : 'Kids'}</option>
          <option value="accessories">{isRTL ? 'إكسسوارات وساعات' : 'Accessories'}</option>
          <option value="offers">{isRTL ? 'العروض والتخفيضات' : 'Special Offers'}</option>
        </select>
      </div>

      {/* Stock Filter */}
      <div className="sm:col-span-3">
        <select
          value={stockFilter}
          onChange={(e) => onStockChange(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors"
        >
          <option value="all">{isRTL ? 'حالة المخزون (الكل)' : 'All Stock Status'}</option>
          <option value="in-stock">{isRTL ? 'متوفر بالمخزون' : 'In Stock Only'}</option>
          <option value="out-of-stock">{isRTL ? 'نفد من المخزون' : 'Out of Stock'}</option>
        </select>
      </div>
    </div>
  );
};
