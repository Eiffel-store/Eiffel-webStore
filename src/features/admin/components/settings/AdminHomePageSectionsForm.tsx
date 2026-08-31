import React from 'react';
import { LayoutGrid, LayoutTemplate, Grid, Tag, ShoppingBag, Sparkles } from 'lucide-react';
import { StoreSettings } from '@/types';
import { useLanguage } from '@/shared';

interface AdminHomePageSectionsFormProps {
  settings: StoreSettings;
  onChange: (updates: Partial<StoreSettings>) => void;
}

export const AdminHomePageSectionsForm: React.FC<AdminHomePageSectionsFormProps> = ({
  settings,
  onChange
}) => {
  const { isRTL } = useLanguage();

  const sections = [
    {
      key: 'showHero' as const,
      labelAr: 'قسم البانر الرئيسي (Hero Banner & Slider)',
      labelEn: 'Hero Banner & Slider Section',
      descAr: 'عرض سلايدر البانرات الترويجية المتحركة في أعلى الصفحة الرئيسية.',
      descEn: 'Display top animated hero slider and main brand headlines.',
      icon: LayoutTemplate,
      iconColor: 'text-amber-400',
      value: settings.showHero !== false
    },
    {
      key: 'showCategories' as const,
      labelAr: 'شبكة الكتالوج والتصنيفات (Category Archive Grid)',
      labelEn: 'Category Archive Grid',
      descAr: 'عرض بطاقات الأقسام المباشرة (رجال، أطفال، إكسسوارات...).',
      descEn: 'Display visual category cards for quick collection browsing.',
      icon: Grid,
      iconColor: 'text-blue-400',
      value: settings.showCategories !== false
    },
    {
      key: 'showPromoBanner' as const,
      labelAr: 'البانر التحريري الأوسط (Middle Editorial Promo Split)',
      labelEn: 'Middle Editorial Promo Split',
      descAr: 'عرض البانر الترويجي التحريري العريض لعروض الموسم.',
      descEn: 'Display split promotional banner for highlighted campaigns.',
      icon: Tag,
      iconColor: 'text-rose-400',
      value: settings.showPromoBanner !== false
    },
    {
      key: 'showFeaturedProducts' as const,
      labelAr: 'قسم المنتجات المميزة والجديدة (Featured & New Arrivals)',
      labelEn: 'Featured & New Arrivals Section',
      descAr: 'عرض أحدث المنتجات المضافة في شبكة تسوق تفاعلية.',
      descEn: 'Display newly added items in an interactive product grid.',
      icon: ShoppingBag,
      iconColor: 'text-emerald-400',
      value: settings.showFeaturedProducts !== false
    },
    {
      key: 'showShopTheLook' as const,
      labelAr: 'قسم تسوق الإطلالة (Shop The Look Interactive Hotspots)',
      labelEn: 'Shop The Look Interactive Hotspots',
      descAr: 'عرض نقاط التسوق التفاعلية لشراء كامل الطقم مباشرة.',
      descEn: 'Display full outfit lookbook with clickable product hotspots.',
      icon: Sparkles,
      iconColor: 'text-purple-400',
      value: settings.showShopTheLook !== false
    }
  ];

  return (
    <div className="space-y-4 pt-6 border-t border-zinc-800">
      {/* Header matching Loyalty VIP Form */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <LayoutGrid className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2">
            <span>{isRTL ? '4. التحكم في ظهور أقسام الصفحة الرئيسية' : '4. HOME PAGE SECTION VISIBILITY'}</span>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] rounded font-mono font-bold">
              DYNAMIC
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {isRTL
              ? 'تحكم بسهولة في إظهار أو إخفاء أي قسم من الصفحة الرئيسية للمتجر بنقرة واحدة.'
              : 'Easily toggle visibility of any home page section with a single click.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 pt-1">
        {sections.map((sec) => {
          const isEnabled = sec.value;
          const IconComponent = sec.icon;

          return (
            <div
              key={sec.key}
              className="p-3.5 bg-zinc-900/40 border border-zinc-800 rounded-lg flex items-center justify-between transition-colors hover:border-zinc-700/80"
            >
              <div className="flex items-center gap-3">
                <IconComponent className={`w-4 h-4 shrink-0 ${sec.iconColor}`} />
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isRTL ? sec.labelAr : sec.labelEn}
                  </span>
                  <span className="text-[11px] text-zinc-400 block mt-0.5">
                    {isRTL ? sec.descAr : sec.descEn}
                  </span>
                </div>
              </div>

              {/* Smooth Amber Toggle Switch matching Loyalty VIP Form */}
              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4 rtl:ml-0 rtl:mr-4">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) => onChange({ [sec.key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
