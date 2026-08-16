import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FacebookIcon, WhatsAppIcon } from './SocialIcons';

export const FloatingContactButtons: React.FC = () => {
  const { isRTL } = useLanguage();

  // Facebook link provided by user
  const facebookUrl = 'https://www.facebook.com/profile.php?id=100093268017929';
  
  // WhatsApp link (User can replace number e.g. https://wa.me/201000000000)
  const whatsappUrl = 'https://wa.me/';

  return (
    <div
      className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-40 flex flex-col gap-2.5 items-end rtl:items-start animate-fade-in`}
    >
      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 px-3.5 py-2.5 bg-[#25D366] text-white rounded-full shadow-xl hover:bg-[#20ba5a] hover:scale-105 transition-all duration-300"
        title="Contact via WhatsApp / تواصل معنا عبر واتساب"
        aria-label="WhatsApp"
      >
        <WhatsAppIcon className="w-5 h-5 fill-current" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-mono font-bold whitespace-nowrap">
          {isRTL ? 'واتساب' : 'WhatsApp'}
        </span>
      </a>

      {/* Facebook Button */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 px-3.5 py-2.5 bg-[#1877F2] text-white rounded-full shadow-xl hover:bg-[#166fe5] hover:scale-105 transition-all duration-300"
        title="Follow on Facebook / تابعنا على فيسبوك"
        aria-label="Facebook"
      >
        <FacebookIcon className="w-5 h-5 fill-current" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-mono font-bold whitespace-nowrap">
          {isRTL ? 'فيسبوك' : 'Facebook'}
        </span>
      </a>
    </div>
  );
};
