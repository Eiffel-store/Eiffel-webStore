import React, { useState } from 'react';
import { Product } from '@/types';
import { useLanguage, useStoreData } from '@/shared';
import { Edit3 } from 'lucide-react';

interface ProductFormBasicInfoProps {
  formData: Omit<Product, 'id'>;
  onChange: (updates: Partial<Omit<Product, 'id'>>) => void;
}

const POPULAR_SUBCATEGORIES: Record<string, Array<{ value: string; labelEn: string; labelAr: string }>> = {
  men: [
    { value: 'T-Shirts', labelEn: 'T-Shirts (تيشيرتات)', labelAr: 'تيشيرتات (T-Shirts)' },
    { value: 'Oversized T-Shirts', labelEn: 'Oversized T-Shirts (تيشيرتات أوفر سايز)', labelAr: 'تيشيرتات أوفر سايز (Oversized)' },
    { value: 'Polos', labelEn: 'Polos (بولو)', labelAr: 'بولو (Polos)' },
    { value: 'Hoodies & Sweatshirts', labelEn: 'Hoodies & Sweatshirts (هوديز وسويت شيرت)', labelAr: 'هوديز وسويت شيرت (Hoodies)' },
    { value: 'Shirts & Overshirts', labelEn: 'Shirts & Overshirts (قمصان وأوفر شيرت)', labelAr: 'قمصان وأوفر شيرت (Overshirts)' },
    { value: 'Cardigans & Knitwear', labelEn: 'Cardigans & Knitwear (كارديجان وتريكو)', labelAr: 'كارديجان وتريكو (Knitwear)' },
    { value: 'Jackets & Outerwear', labelEn: 'Jackets & Outerwear (جواكت ومعاطف)', labelAr: 'جواكت ومعاطف (Jackets)' },
    { value: 'Pants & Trousers', labelEn: 'Pants & Trousers (بناطيل قماش وشينو)', labelAr: 'بناطيل قماش وشينو (Trousers)' },
    { value: 'Jeans', labelEn: 'Jeans (جينز)', labelAr: 'جينز (Jeans)' },
    { value: 'Joggers & Sweatpants', labelEn: 'Joggers & Sweatpants (سويت بانتس وجوجرز)', labelAr: 'سويت بانتس وجوجرز (Sweatpants)' },
    { value: 'Shorts', labelEn: 'Shorts (شورتات)', labelAr: 'شورتات (Shorts)' },
    { value: 'Co-ords & Sets', labelEn: 'Co-ords & Sets (أطقم متكاملة)', labelAr: 'أطقم متكاملة (Sets)' },
    { value: 'Suits & Blazers', labelEn: 'Suits & Blazers (بدل وبليزر)', labelAr: 'بدل وبليزر (Blazers)' }
  ],
  kids: [
    { value: 'Kids T-Shirts', labelEn: 'Kids T-Shirts (تيشيرتات أطفال)', labelAr: 'تيشيرتات أطفال (T-Shirts)' },
    { value: 'Kids Hoodies', labelEn: 'Kids Hoodies (هوديز وسويت شيرت أطفال)', labelAr: 'هوديز أطفال (Hoodies)' },
    { value: 'Kids Pants', labelEn: 'Kids Pants (بناطيل أطفال)', labelAr: 'بناطيل أطفال (Pants)' },
    { value: 'Kids Sets', labelEn: 'Kids Sets (أطقم أطفال)', labelAr: 'أطقم أطفال (Sets)' },
    { value: 'Kids Jackets', labelEn: 'Kids Jackets (جواكت أطفال)', labelAr: 'جواكت أطفال (Jackets)' }
  ],
  accessories: [
    { value: 'Caps & Hats', labelEn: 'Caps & Hats (كابات وقبعات)', labelAr: 'كابات وقبعات (Caps)' },
    { value: 'Bags & Backpacks', labelEn: 'Bags & Backpacks (شنط وحقائب)', labelAr: 'شنط وحقائب (Bags)' },
    { value: 'Belts & Leather Goods', labelEn: 'Belts & Leather Goods (أحزمة ومصنوعات جلدية)', labelAr: 'أحزمة وجلديات (Belts)' },
    { value: 'Socks', labelEn: 'Socks (شرابات فاخرة)', labelAr: 'شرابات فاخرة (Socks)' },
    { value: 'Sunglasses', labelEn: 'Sunglasses (نظارات شمسية)', labelAr: 'نظارات شمسية (Eyewear)' },
    { value: 'Fragrances', labelEn: 'Fragrances (عطور وبيرفيوم)', labelAr: 'عطور وبيرفيوم (Fragrances)' },
    { value: 'Wallets & Cardholders', labelEn: 'Wallets (محافظ وحوامل بطاقات)', labelAr: 'محافظ وحوامل بطاقات (Wallets)' }
  ]
};

export const ProductFormBasicInfo: React.FC<ProductFormBasicInfoProps> = ({
  formData,
  onChange
}) => {
  const { isRTL } = useLanguage();
  const { categories } = useStoreData();
  const [isCustomSubCategory, setIsCustomSubCategory] = useState(false);

  // Get options for current category, or fallback to men's options
  const currentCategoryOptions = POPULAR_SUBCATEGORIES[formData.category] || POPULAR_SUBCATEGORIES['men'];

  // Subcategories from database for selected category
  const dynamicSubCategories = categories.find(c => c.id === formData.category)?.subCategories || [];

  const handleSubCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setIsCustomSubCategory(true);
      onChange({ subCategory: '' });
    } else {
      setIsCustomSubCategory(false);
      onChange({ subCategory: val });
    }
  };

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
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
          >
            <option value="men">{isRTL ? 'رجال (Men)' : 'Men'}</option>
            <option value="kids">{isRTL ? 'أطفال (Kids)' : 'Kids'}</option>
            <option value="accessories">{isRTL ? 'إكسسوارات (Accessories)' : 'Accessories'}</option>
            {categories.filter(c => !['men', 'kids', 'accessories', 'offers'].includes(c.id)).map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Sub Category Dropdown */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs text-zinc-300 font-bold">
              {isRTL ? 'القسم الفرعي (Sub-Category)' : 'Sub-Category'}
            </label>
            <button
              type="button"
              onClick={() => setIsCustomSubCategory(!isCustomSubCategory)}
              className="text-[11px] text-amber-400 hover:text-amber-300 underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>{isCustomSubCategory ? (isRTL ? 'اختيار من القائمة' : 'Select from list') : (isRTL ? 'كتابة قسم يدوي' : 'Custom input')}</span>
            </button>
          </div>

          {isCustomSubCategory ? (
            <input
              type="text"
              value={formData.subCategory || ''}
              onChange={(e) => onChange({ subCategory: e.target.value })}
              placeholder={isRTL ? 'اكتب القسم الفرعي هنا...' : 'Type custom sub-category...'}
              className="w-full bg-zinc-900 border border-amber-500 px-3.5 py-2 text-xs text-white focus:outline-none transition-colors"
              autoFocus
            />
          ) : (
            <select
              value={formData.subCategory || ''}
              onChange={handleSubCategorySelect}
              className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
            >
              <option value="">{isRTL ? '-- اختر القسم الفرعي --' : '-- Select Sub-Category --'}</option>
              
              {/* Dynamic Categories from DB if any */}
              {dynamicSubCategories.length > 0 && (
                <optgroup label={isRTL ? 'الأقسام المسجلة في قاعدة البيانات' : 'Categories from Database'}>
                  {dynamicSubCategories.map((sub, idx) => (
                    <option key={`db-${idx}`} value={sub}>
                      {sub}
                    </option>
                  ))}
                </optgroup>
              )}

              {/* Popular Category Specific Presets */}
              <optgroup label={isRTL ? `الأكثر شيوعاً لقسم (${formData.category})` : `Popular for (${formData.category})`}>
                {currentCategoryOptions.map((sub) => (
                  <option key={sub.value} value={sub.value}>
                    {isRTL ? sub.labelAr : sub.labelEn}
                  </option>
                ))}
              </optgroup>

              {/* Other Common Apparel Options if not in current list */}
              <optgroup label={isRTL ? 'أقسام إضافية شائعة' : 'Other Common Apparel'}>
                {Object.entries(POPULAR_SUBCATEGORIES)
                  .filter(([catKey]) => catKey !== formData.category)
                  .flatMap(([, items]) => items)
                  .filter((item, idx, arr) => arr.findIndex(i => i.value === item.value) === idx)
                  .map((sub) => (
                    <option key={`other-${sub.value}`} value={sub.value}>
                      {isRTL ? sub.labelAr : sub.labelEn}
                    </option>
                  ))}
              </optgroup>

              <option value="__custom__">
                {isRTL ? '✏️ + كتابة قسم فرعي يدوي مخصص...' : '✏️ + Enter custom sub-category...'}
              </option>
            </select>
          )}
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
            value={formData.stock !== undefined ? formData.stock : 0}
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
