import React, { useState } from 'react';
import { Languages, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/shared';

export const NavLanguageDropdown: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-[11px] sm:text-xs font-label-bold text-primary dark:text-white py-1 px-2 border border-surface-container dark:border-zinc-800 hover:border-primary dark:hover:border-white transition-colors uppercase cursor-pointer"
        title="Switch Language / تغيير اللغة"
      >
        <Languages className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        <span>{language === 'en' ? 'EN' : 'العربية'}</span>
        <ChevronDown className="w-2.5 h-2.5 text-secondary" />
      </button>

      {isOpen && (
        <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-32 bg-white dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 shadow-xl py-1 z-50 animate-fade-in">
          <button
            onClick={() => {
              setLanguage('en');
              setIsOpen(false);
            }}
            className={`w-full text-left rtl:text-right px-3 py-2 text-xs font-mono flex items-center justify-between transition-colors cursor-pointer ${
              language === 'en'
                ? 'bg-surface-container-low dark:bg-zinc-800 text-primary dark:text-white font-bold'
                : 'text-secondary dark:text-zinc-400 hover:bg-surface-container-low dark:hover:bg-zinc-800'
            }`}
          >
            <span>English</span>
            <span className="text-[10px] text-secondary">EN</span>
          </button>
          <button
            onClick={() => {
              setLanguage('ar');
              setIsOpen(false);
            }}
            className={`w-full text-left rtl:text-right px-3 py-2 text-xs font-mono flex items-center justify-between transition-colors cursor-pointer ${
              language === 'ar'
                ? 'bg-surface-container-low dark:bg-zinc-800 text-primary dark:text-white font-bold'
                : 'text-secondary dark:text-zinc-400 hover:bg-surface-container-low dark:hover:bg-zinc-800'
            }`}
          >
            <span>العربية</span>
            <span className="text-[10px] text-secondary">AR</span>
          </button>
        </div>
      )}
    </div>
  );
};
