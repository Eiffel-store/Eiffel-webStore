import React from 'react';
import { Product } from '@/types';
import { useLanguage, useStoreData } from '@/shared';

interface ProductFormBasicInfoProps {
  formData: Omit<Product, 'id'>;
  onChange: (updates: Partial<Omit<Product, 'id'>>) => void;
}

export const ProductFormBasicInfo: React.FC<ProductFormBasicInfoProps> = ({
  formData,
  onChange
}) => {
  const { isRTL } = useLanguage();
  const { categories } = useStoreData();

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-5 shadow-xl">
      <h2 className="text-sm font-label-bold uppercase tracking-wider text-white pb-2 border-b border-zinc-800">
        {isRTL ? '1. البيانات الأساسية والتسعير' : '1. Basic Information & Pricing'}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {isRTL ? 'اسم المنتج *' : 'Product Name *'}
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder={isRTL ? 'مثال: Oversized Heavyweight Tee' : 'e.g. Oversized Heavyweight Tee'}
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {isRTL ? 'العنوان الفرعي / الوصف القصير' : 'Subtitle / Tagline'}
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => onChange({ subtitle: e.target.value })}
            placeholder={isRTL ? 'مثال: Brutalist Raw Seam Construction' : 'e.g. Brutalist Raw Seam Construction'}
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Price */}
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {isRTL ? 'السعر الحالي (EGP) *' : 'Current Price (EGP) *'}
          </label>
          <input
            type="number"
            required
            min={1}
            value={formData.price}
            onChange={(e) => onChange({ price: parseFloat(e.target.value) || 0 })}
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-white transition-colors"
          />
        </div>

        {/* Original Price / Sale */}
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {isRTL ? 'السعر قبل الخصم (إن وجد)' : 'Original Price (Sale)'}
          </label>
          <input
            type="number"
            min={1}
            value={formData.originalPrice || ''}
            onChange={(e) => onChange({ originalPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
            placeholder={isRTL ? 'يترك فارغاً إذا لا يوجد خصم' : 'Leave empty if regular price'}
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-white transition-colors"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {isRTL ? 'القسم الرئيسي *' : 'Main Category *'}
          </label>
          <select
            value={formData.category}
            onChange={(e) => onChange({ category: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors"
          >
            <option value="men">{isRTL ? 'رجال (Men)' : 'Men'}</option>
            <option value="kids">{isRTL ? 'أطفال (Kids)' : 'Kids'}</option>
            <option value="accessories">{isRTL ? 'إكسسوارات (Accessories)' : 'Accessories'}</option>
            {categories.filter(c => !['men', 'kids', 'accessories', 'offers'].includes(c.id)).map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Sub Category */}
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {isRTL ? 'القسم الفرعي' : 'Sub-Category'}
          </label>
          <input
            type="text"
            value={formData.subCategory}
            onChange={(e) => onChange({ subCategory: e.target.value })}
            placeholder={isRTL ? 'مثال: T-Shirts, Hoodies, Pants' : 'e.g. T-Shirts, Hoodies, Pants'}
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors"
          />
        </div>
      </div>

      {/* Stock & Badges */}
      <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-300 font-bold">
            {isRTL ? 'الكمية المتوفرة في المخزون (Stock Units):' : 'Stock Quantity:'}
          </label>
          <input
            type="number"
            min={0}
            value={formData.stock !== undefined ? formData.stock : 20}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10) || 0;
              onChange({ stock: val, inStock: val > 0 });
            }}
            className="w-20 bg-zinc-900 border border-zinc-700 px-2 py-1 text-xs text-white font-mono rounded focus:outline-none focus:border-amber-400"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.inStock !== false}
            onChange={(e) => onChange({ inStock: e.target.checked })}
            className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-white focus:ring-0"
          />
          <span className="text-xs text-zinc-300">{isRTL ? 'متوفر بالمخزون (In Stock)' : 'In Stock'}</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isNew || false}
            onChange={(e) => onChange({ isNew: e.target.checked })}
            className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-white focus:ring-0"
          />
          <span className="text-xs text-zinc-300">{isRTL ? 'جديد (New Arrival)' : 'New Arrival'}</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isBestSeller || false}
            onChange={(e) => onChange({ isBestSeller: e.target.checked })}
            className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-white focus:ring-0"
          />
          <span className="text-xs text-zinc-300">{isRTL ? 'الأكثر مبيعاً (Best Seller)' : 'Best Seller'}</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isLimited || false}
            onChange={(e) => onChange({ isLimited: e.target.checked })}
            className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-white focus:ring-0"
          />
          <span className="text-xs text-zinc-300">{isRTL ? 'إصدار محدود (Limited Edition)' : 'Limited Edition'}</span>
        </label>
      </div>
    </div>
  );
};
