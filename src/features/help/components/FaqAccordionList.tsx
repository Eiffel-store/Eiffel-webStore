import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FAQCategory, FAQItem } from '@/data/faq';
import { useLanguage } from '@/shared';

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
  const { language, t } = useLanguage();
  const isAr = language === 'ar';

  const getCategoryTitle = () => {
    if (category.id === 'orders') return t.faqOrdersDelivery;
    if (category.id === 'returns') return t.faqReturnsExchange;
    if (category.id === 'sizing') return t.faqSizingGuide;
    if (category.id === 'craft' || category.id === 'craftsmanship') return t.faqCraftsmanshipFabrics;
    return isAr ? (category.titleAr || category.title) : (category.titleEn || category.title);
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
          const questionText = isAr ? (item.qAr || item.q) : (item.qEn || item.q);
          const answerText = isAr ? (item.aAr || item.a) : (item.aEn || item.a);

          return (
            <div key={idx} className="py-4">
              <button
                onClick={() => onToggleAccordion(key)}
                className="w-full flex justify-between items-center text-left rtl:text-right gap-4 group"
              >
                <span className="font-editorial text-lg sm:text-xl text-primary dark:text-white group-hover:underline">
                  {questionText}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 shrink-0 text-primary dark:text-white" />
                ) : (
                  <ChevronDown className="w-4 h-4 shrink-0 text-secondary" />
                )}
              </button>
              {isOpen && (
                <p className="text-xs sm:text-sm text-secondary dark:text-zinc-300 font-light leading-relaxed pt-3 animate-fade-in">
                  {answerText}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
