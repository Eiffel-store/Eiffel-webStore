import React, { useState } from 'react';
import { FAQ_CATEGORIES } from '@/data/faq';
import { useLanguage } from '@/shared';
import { FaqCategoriesNav } from '../components/FaqCategoriesNav';
import { FaqAccordionList } from '../components/FaqAccordionList';
import { ConciergeContactForm } from '../components/ConciergeContactForm';

export const HelpCenterPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>(FAQ_CATEGORIES[0].id);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({ 'orders-0': true, '0-0': true });

  const toggleAccordion = (key: string) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const currentCategoryData = FAQ_CATEGORIES.find(c => c.id === activeCategory) || FAQ_CATEGORIES[0];

  return (
    <div className="min-h-screen bg-background text-on-surface py-12 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono text-secondary dark:text-zinc-400 uppercase tracking-widest">
            {t.helpCenterSubtitle}
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-primary dark:text-white uppercase">
            {t.helpCenterTitle}
          </h1>
          <p className="text-xs sm:text-sm text-secondary dark:text-zinc-400 font-light">
            {t.helpCenterDesc}
          </p>
        </div>

        {/* Main Categories Navigation */}
        <FaqCategoriesNav
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* FAQ Accordions & Concierge Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <FaqAccordionList
            category={currentCategoryData}
            openAccordions={openAccordions}
            onToggleAccordion={toggleAccordion}
          />

          <ConciergeContactForm />
        </div>
      </div>
    </div>
  );
};
