import React from 'react';
import { FAQ_CATEGORIES, FAQCategory } from '../../data/faq';
import { useLanguage } from '../../context/LanguageContext';

interface FaqCategoriesNavProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export const FaqCategoriesNav: React.FC<FaqCategoriesNavProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const { t, isRTL } = useLanguage();

  const getCategoryTitle = (cat: FAQCategory) => {
    if (isRTL) {
      if (cat.id === 'orders') return 'الطلبات والتوصيل الدولي';
      if (cat.id === 'returns') return 'الإرجاع والاستبدال';
      if (cat.id === 'sizing') return 'المقاسات ودليل الجسم';
      return 'الخياطة والأقمشة النادرة';
    }
    return cat.title;
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
