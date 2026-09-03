import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/shared';
import { useStoreData } from '@/shared';
import { FacebookIcon, WhatsAppIcon } from './SocialIcons';

export const FloatingContactButtons: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { settings } = useStoreData();
  const location = useLocation();

  // Hide on checkout for 100% distraction-free completion
  if (location.pathname === '/checkout') {
    return null;
  }

  const isProductPage = location.pathname.startsWith('/product/');

  const facebookUrl = settings.facebookUrl || 'https://www.facebook.com/profile.php?id=100093268017929';
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : 'https://wa.me/';

  return (
    <div
      className={`fixed ${
        isProductPage
          ? 'bottom-[calc(5.25rem+env(safe-area-inset-bottom))] sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]'
          : 'bottom-[calc(1.5rem+env(safe-area-inset-bottom))]'
      } ${isRTL ? 'left-4 sm:left-6' : 'right-4 sm:right-6'} z-40 flex flex-col gap-2.5 items-end rtl:items-start animate-fade-in transition-all duration-300`}
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
          {t.whatsapp}
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
          {t.facebook}
        </span>
      </a>
    </div>
  );
};
