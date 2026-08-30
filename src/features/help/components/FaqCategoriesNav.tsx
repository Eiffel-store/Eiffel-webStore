import React from 'react';
import { FAQ_CATEGORIES, FAQCategory } from '@/data/faq';
import { useLanguage } from '@/shared';

interface FaqCategoriesNavProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export const FaqCategoriesNav: React.FC<FaqCategoriesNavProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';

  const getCategoryTitle = (cat: FAQCategory) => {
    if (cat.id === 'orders') return t.faqOrdersDelivery;
    if (cat.id === 'returns') return t.faqReturnsExchange;
    if (cat.id === 'sizing') return t.faqSizingGuide;
    if (cat.id === 'craft' || cat.id === 'craftsmanship') return t.faqCraftsmanshipFabrics;
    return isAr ? (cat.titleAr || cat.title) : (cat.titleEn || cat.title);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {FAQ_CATEGORIES.map((cat: FAQCategory) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className={`p-6 border text-left rtl:text-right transition-all ${
            activeCategory === cat.id
              ? 'border-primary dark:border-white bg-surface-container-low dark:bg-zinc-900 shadow-md'
              : 'border-surface-container dark:border-zinc-800 bg-surface-container-lowest dark:bg-zinc-950 hover:border-secondary'
          }`}
        >
          <h3 className="font-editorial text-xl text-primary dark:text-white">
            {getCategoryTitle(cat)}
          </h3>
          <p className="text-[11px] font-mono text-secondary dark:text-zinc-400 mt-1">
            {cat.questions.length} {t.topicsAnswered}
          </p>
        </button>
      ))}
    </div>
  );
};
