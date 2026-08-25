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
  const { t } = useLanguage();

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-5 shadow-xl">
      <h2 className="text-sm font-label-bold uppercase tracking-wider text-white pb-2 border-b border-zinc-800">
        {t.adminDetailsAndCareSection}
      </h2>

      {/* Description */}
      <div>
        <label className="block text-xs text-zinc-300 font-bold mb-1.5">
          {t.adminFullDescription}
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Architectural garment description..."
          className="w-full bg-zinc-900 border border-zinc-700 p-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Composition */}
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {t.adminFabricComposition}
          </label>
          <input
            type="text"
            value={composition}
            onChange={(e) => onChange({ composition: e.target.value })}
            placeholder="100% Egyptian Cotton (280 GSM)"
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors"
          />
        </div>

        {/* Fit */}
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {t.adminCutAndFit}
          </label>
          <input
            type="text"
            value={fit}
            onChange={(e) => onChange({ fit: e.target.value })}
            placeholder="Relaxed Drop-Shoulder Boxy Fit"
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Bullet Details */}
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {t.adminKeyHighlights}
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
            {t.adminCareInstructions}
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
