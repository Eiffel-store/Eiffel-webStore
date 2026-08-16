import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ProductColor } from '@/types';
import { useLanguage } from '@/shared';

interface ProductFormVariantsProps {
  colors: ProductColor[];
  sizes: string[];
  onColorsChange: (colors: ProductColor[]) => void;
  onSizesChange: (sizes: string[]) => void;
}

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL', '39', '40', '41', '42', '43', '44', '45', 'One Size'];

export const ProductFormVariants: React.FC<ProductFormVariantsProps> = ({
  colors,
  sizes,
  onColorsChange,
  onSizesChange
}) => {
  const { isRTL } = useLanguage();
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    onColorsChange([...colors, { name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName('');
    setNewColorHex('#000000');
  };

  const handleRemoveColor = (index: number) => {
    const updated = colors.filter((_, i) => i !== index);
    onColorsChange(updated.length === 0 ? [{ name: 'Default', hex: '#000000' }] : updated);
  };

  const handleToggleSize = (size: string) => {
    if (sizes.includes(size)) {
      onSizesChange(sizes.filter(s => s !== size));
    } else {
      onSizesChange([...sizes, size]);
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-6 shadow-xl">
      <h2 className="text-sm font-label-bold uppercase tracking-wider text-white pb-2 border-b border-zinc-800">
        {isRTL ? '3. خيارات الألوان والمقاسات' : '3. Colors & Sizing Options'}
      </h2>

      {/* Colors Manager */}
      <div className="space-y-3">
        <label className="block text-xs text-zinc-300 font-bold">
          {isRTL ? 'الألوان المتاحة (Color Palette)' : 'Available Colors'}
        </label>

        {/* Existing color pills */}
        <div className="flex flex-wrap gap-2">
          {colors.map((c, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-xs"
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-zinc-600 shadow-sm"
                style={{ backgroundColor: c.hex }}
              />
              <span className="text-zinc-200">{c.name}</span>
              <span className="text-[10px] text-zinc-500 font-mono">({c.hex})</span>
              <button
                type="button"
                onClick={() => handleRemoveColor(idx)}
                className="text-zinc-500 hover:text-red-400 ml-1 rtl:ml-0 rtl:mr-1"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Color Form */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <input
            type="color"
            value={newColorHex}
            onChange={(e) => setNewColorHex(e.target.value)}
            className="w-8 h-8 bg-zinc-900 border border-zinc-700 rounded cursor-pointer p-0.5"
            title="Pick color"
          />
          <input
            type="text"
            value={newColorName}
            onChange={(e) => setNewColorName(e.target.value)}
            placeholder={isRTL ? 'اسم اللون (مثال: أسود فحمي)' : 'Color Name (e.g. Noir, Slate)'}
            className="bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white"
          />
          <button
            type="button"
            onClick={handleAddColor}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium border border-zinc-700 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isRTL ? 'إضافة لون' : 'Add Color'}</span>
          </button>
        </div>
      </div>

      {/* Sizes Matrix */}
      <div className="space-y-3 pt-3 border-t border-zinc-800/80">
        <label className="block text-xs text-zinc-300 font-bold">
          {isRTL ? 'المقاسات المتوفرة (اختر المقاسات المتاحة للقطعة)' : 'Available Sizes'}
        </label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_SIZES.map((size) => {
            const isSelected = sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => handleToggleSize(size)}
                className={`px-3 py-2 text-xs font-mono font-bold transition-all border ${
                  isSelected
                    ? 'bg-white text-black border-white shadow-md'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
