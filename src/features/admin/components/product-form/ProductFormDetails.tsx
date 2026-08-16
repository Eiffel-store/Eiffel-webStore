import React from 'react';
import { useLanguage } from '@/shared';

interface ProductFormDetailsProps {
  description: string;
  composition: string;
  fit: string;
  details: string[];
  care: string[];
  onChange: (updates: {
    description?: string;
    composition?: string;
    fit?: string;
    details?: string[];
    care?: string[];
  }) => void;
}

export const ProductFormDetails: React.FC<ProductFormDetailsProps> = ({
  description,
  composition,
  fit,
  details,
  care,
  onChange
}) => {
  const { isRTL } = useLanguage();

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-5 shadow-xl">
      <h2 className="text-sm font-label-bold uppercase tracking-wider text-white pb-2 border-b border-zinc-800">
        {isRTL ? '4. الوصف والمواصفات وخامة التصنيع' : '4. Specifications & Material Details'}
      </h2>

      {/* Description */}
      <div>
        <label className="block text-xs text-zinc-300 font-bold mb-1.5">
          {isRTL ? 'الوصف المفصل' : 'Full Description'}
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder={isRTL ? 'اكتب وصفاً مفصلاً للقطعة...' : 'Write an architectural description of the garment...'}
          className="w-full bg-zinc-900 border border-zinc-700 p-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Composition */}
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {isRTL ? 'نوع القماش والخامة (Composition)' : 'Fabric Composition'}
          </label>
          <input
            type="text"
            value={composition}
            onChange={(e) => onChange({ composition: e.target.value })}
            placeholder={isRTL ? 'مثال: 100% Egyptian Cotton (280 GSM)' : 'e.g. 100% Egyptian Cotton (280 GSM)'}
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors"
          />
        </div>

        {/* Fit */}
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {isRTL ? 'قصة القطعة (Fit)' : 'Cut / Fit'}
          </label>
          <input
            type="text"
            value={fit}
            onChange={(e) => onChange({ fit: e.target.value })}
            placeholder={isRTL ? 'مثال: Relaxed Drop-Shoulder Boxy Fit' : 'e.g. Relaxed Drop-Shoulder Boxy Fit'}
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Bullet Details */}
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {isRTL ? 'نقاط مميزات القطعة (مفصولة بأسطر جديدة)' : 'Key Highlights (one per line)'}
          </label>
          <textarea
            rows={3}
            value={details.join('\n')}
            onChange={(e) => onChange({ details: e.target.value.split('\n').filter(Boolean) })}
            placeholder={`100% Heavyweight Cotton\nMade in Egypt\nPrecision Stitching`}
            className="w-full bg-zinc-900 border border-zinc-700 p-3 text-xs text-white font-mono placeholder:text-zinc-500 focus:outline-none focus:border-white"
          />
        </div>

        {/* Care Instructions */}
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {isRTL ? 'تعليمات العناية والغسيل (مفصولة بأسطر)' : 'Care Instructions (one per line)'}
          </label>
          <textarea
            rows={3}
            value={care.join('\n')}
            onChange={(e) => onChange({ care: e.target.value.split('\n').filter(Boolean) })}
            placeholder={`Machine wash cold\nDo not bleach\nIron inside-out`}
            className="w-full bg-zinc-900 border border-zinc-700 p-3 text-xs text-white font-mono placeholder:text-zinc-500 focus:outline-none focus:border-white"
          />
        </div>
      </div>
    </div>
  );
};
