import React from 'react';
import { Phone, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { useLanguage, useStoreData, FacebookIcon, WhatsAppIcon } from '@/shared';

export const ConciergeContactForm: React.FC = () => {
  const { language, t } = useLanguage();
  const { settings } = useStoreData();
  const isAr = language === 'ar';

  // Dynamic social & contact links from store settings
  const rawWhatsapp = settings?.whatsappNumber?.replace(/[^0-9]/g, '') || '201000000000';
  const whatsappUrl = `https://wa.me/${rawWhatsapp}`;
  const facebookUrl = settings?.facebookUrl || 'https://www.facebook.com/profile.php?id=100093268017929';
  const phoneNumber = settings?.phone || '+20 100 000 0000';

  return (
    <div className="lg:col-span-5 space-y-6">
      <div className="p-6 sm:p-8 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 space-y-6">
        <div>
          <span className="text-[10px] font-mono text-secondary uppercase tracking-widest">
            {isAr ? 'خدمة العملاء الخاصة 24/7' : '24/7 PRIVATE CLIENT SERVICE'}
          </span>
          <h3 className="font-editorial text-2xl sm:text-3xl text-primary dark:text-white mt-1">
            {t.contactConciergeTitle || (isAr ? 'تواصل مع خدمة العملاء والواتساب' : 'Direct Concierge & WhatsApp')}
          </h3>
          <p className="text-xs text-secondary dark:text-zinc-400 font-light mt-1.5 leading-relaxed">
            {t.contactConciergeDesc || (isAr ? 'فريقنا جاهز للرد الفوري على استفساراتكم حول المقاسات، الطلبات، والشحن في أي وقت.' : 'Our dedicated luxury client advisors are ready to assist with sizing, styling, and order inquiries.')}
          </p>
        </div>

        {/* Quick Social Contact Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 py-3.5 px-4 bg-[#25D366] text-white font-label-bold text-xs uppercase tracking-wider hover:bg-[#20ba5a] transition-all duration-200 shadow-sm"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current" />
            <span>{t.whatsapp || 'واتساب'}</span>
          </a>

          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 py-3.5 px-4 bg-[#1877F2] text-white font-label-bold text-xs uppercase tracking-wider hover:bg-[#166fe5] transition-all duration-200 shadow-sm"
          >
            <FacebookIcon className="w-4 h-4 fill-current" />
            <span>{t.facebook || 'فيسبوك'}</span>
          </a>
        </div>

        {/* Store Highlights & Info */}
        <div className="pt-4 border-t border-surface-container dark:border-zinc-800 space-y-4">
          <div className="flex items-start gap-3 text-xs text-secondary dark:text-zinc-300">
            <Clock className="w-4 h-4 text-primary dark:text-white shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-primary dark:text-white">
                {isAr ? 'ساعات العمل والمساعدة:' : 'Support Availability:'}
              </span>
              <span>{isAr ? 'يومياً من 10:00 صباحاً حتى 11:00 مساءً' : 'Daily 10:00 AM – 11:00 PM (GMT+2)'}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs text-secondary dark:text-zinc-300">
            <ShieldCheck className="w-4 h-4 text-primary dark:text-white shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-primary dark:text-white">
                {isAr ? 'ضمان إيفل الفاخر:' : 'Authenticity & Guarantee:'}
              </span>
              <span>{isAr ? 'منتجات أصلية 100% مع خيار المعاينة قبل الاستلام' : '100% authentic garments with doorstep inspection'}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs text-secondary dark:text-zinc-300">
            <MapPin className="w-4 h-4 text-primary dark:text-white shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-primary dark:text-white">
                {isAr ? 'فروعنا في مصر:' : 'Flagship Boutiques:'}
              </span>
              <span>{isAr ? 'زفتى - شارع الجيش | نهطاي - بجوار كوبري المشاة' : 'Zefta - El Geish St | Nehtay - Pedestrian Bridge'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
