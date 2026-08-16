import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FAQCategory, FAQItem } from '../../data/faq';
import { useLanguage } from '../../context/LanguageContext';

interface FaqAccordionListProps {
  category: FAQCategory;
  openAccordions: Record<string, boolean>;
  onToggleAccordion: (key: string) => void;
}

export const FaqAccordionList: React.FC<FaqAccordionListProps> = ({
  category,
  openAccordions,
  onToggleAccordion,
}) => {
  const { isRTL } = useLanguage();

  const getCategoryTitle = () => {
    if (isRTL) {
      if (category.id === 'orders') return 'الطلبات والتوصيل الدولي';
      if (category.id === 'returns') return 'الإرجاع والاستبدال';
      if (category.id === 'sizing') return 'المقاسات ودليل الجسم';
      return 'الخياطة والأقمشة النادرة';
    }
    return category.title;
  };

  return (
    <div className="lg:col-span-7 space-y-4">
      <h2 className="font-editorial text-2xl text-primary dark:text-white tracking-wider pb-3 border-b border-surface-container dark:border-zinc-800">
        {getCategoryTitle()}
      </h2>

      <div className="divide-y divide-surface-container dark:divide-zinc-800 border-b border-surface-container dark:border-zinc-800">
        {category.questions.map((item: FAQItem, idx: number) => {
          const key = `${category.id}-${idx}`;
          const isOpen = !!openAccordions[key];
          return (
            <div key={idx} className="py-4">
              <button
                onClick={() => onToggleAccordion(key)}
                className="w-full flex justify-between items-center text-left rtl:text-right gap-4 group"
              >
                <span className="font-editorial text-xl text-primary dark:text-white group-hover:underline">
                  {item.q}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 shrink-0 text-primary dark:text-white" />
                ) : (
                  <ChevronDown className="w-4 h-4 shrink-0 text-secondary" />
                )}
              </button>
              {isOpen && (
                <p className="text-xs text-secondary dark:text-zinc-300 font-light leading-relaxed pt-3 animate-fade-in">
                  {item.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
