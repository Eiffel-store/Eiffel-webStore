import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/shared';
import { Product } from '@/types';

interface ProductAccordionProps {
  product: Product;
  activeAccordion: string | null;
  toggleAccordion: (name: string) => void;
}

export const ProductAccordion: React.FC<ProductAccordionProps> = ({
  product,
  activeAccordion,
  toggleAccordion,
}) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="divide-y divide-surface-container dark:divide-zinc-800 border-y border-surface-container dark:border-zinc-800">
      {/* 1. Structural Details */}
      <div>
        <button
          onClick={() => toggleAccordion('details')}
          className="w-full py-4 flex justify-between items-center text-xs font-label-bold text-primary dark:text-white uppercase tracking-wider text-left rtl:text-right"
        >
          <span>{t.specsCraftsmanship}</span>
          {activeAccordion === 'details' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {activeAccordion === 'details' && (
          <div className="pb-4 text-xs text-secondary dark:text-zinc-300 leading-relaxed font-light animate-fade-in">
            <p className="mb-3">{product.description}</p>
            <ul className="list-disc list-inside space-y-1.5 font-normal">
              {product.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 2. Fabric & Composition */}
      <div>
        <button
          onClick={() => toggleAccordion('fabric')}
          className="w-full py-4 flex justify-between items-center text-xs font-label-bold text-primary dark:text-white uppercase tracking-wider text-left rtl:text-right"
        >
          <span>{t.specsFabric}</span>
          {activeAccordion === 'fabric' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {activeAccordion === 'fabric' && (
          <div className="pb-4 text-xs text-secondary dark:text-zinc-300 leading-relaxed font-light animate-fade-in space-y-2">
            <p><strong>{t.composition}</strong> {product.composition}</p>
            <p><strong>{t.dyeingProcess}</strong> {isRTL ? 'صباغة تفاعلية منخفضة التأثير البيئي مع تثبيت بالمياه الباردة في ميلانو.' : 'Low-impact reactive dye with cold water fixation in Milan.'}</p>
            <div>
              <strong>{t.garmentCare}</strong>
              <ul className="list-disc list-inside space-y-1 mt-1">
                {product.care.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 3. Sizing & Fit */}
      <div>
        <button
          onClick={() => toggleAccordion('fit')}
          className="w-full py-4 flex justify-between items-center text-xs font-label-bold text-primary dark:text-white uppercase tracking-wider text-left rtl:text-right"
        >
          <span>{t.specsFit}</span>
          {activeAccordion === 'fit' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {activeAccordion === 'fit' && (
          <div className="pb-4 text-xs text-secondary dark:text-zinc-300 leading-relaxed font-light animate-fade-in">
            <p>{product.fit}</p>
            <p className="mt-2 text-primary dark:text-white font-mono">
              {t.modelDimensions}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
