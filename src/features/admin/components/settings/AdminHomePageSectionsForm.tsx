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
  const { t } = useLanguage();

  const sections = [
    {
      key: 'showHero' as const,
      label: t.adminSectionHeroLabel,
      desc: t.adminSectionHeroDesc,
      icon: LayoutTemplate,
      iconColor: 'text-amber-400',
      value: settings.showHero !== false
    },
    {
      key: 'showCategories' as const,
      label: t.adminSectionCategoriesLabel,
      desc: t.adminSectionCategoriesDesc,
      icon: Grid,
      iconColor: 'text-blue-400',
      value: settings.showCategories !== false
    },
    {
      key: 'showPromoBanner' as const,
      label: t.adminSectionPromoLabel,
      desc: t.adminSectionPromoDesc,
      icon: Tag,
      iconColor: 'text-rose-400',
      value: settings.showPromoBanner !== false
    },
    {
      key: 'showFeaturedProducts' as const,
      label: t.adminSectionFeaturedLabel,
      desc: t.adminSectionFeaturedDesc,
      icon: ShoppingBag,
      iconColor: 'text-emerald-400',
      value: settings.showFeaturedProducts !== false
    },
    {
      key: 'showShopTheLook' as const,
      label: t.adminSectionShopLookLabel,
      desc: t.adminSectionShopLookDesc,
      icon: Sparkles,
      iconColor: 'text-purple-400',
      value: settings.showShopTheLook !== false
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header matching Loyalty VIP Form */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <LayoutGrid className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2">
            <span>{t.adminHomeSectionVisibility}</span>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] rounded font-mono font-bold">
              DYNAMIC
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {t.adminHomeSectionVisibilityDesc}
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
                    {sec.label}
                  </span>
                  <span className="text-[11px] text-zinc-400 block mt-0.5">
                    {sec.desc}
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

      {/* Hero Slider Transition Interval & AutoPlay Controls */}
      <div className="mt-5 p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <span className="text-xs font-bold text-white block">
              {t.adminHeroSliderSpeed}
            </span>
            <span className="text-[11px] text-zinc-400 block mt-0.5">
              {t.adminHeroSliderSpeedStayDesc}
            </span>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none self-start sm:self-auto">
            <span className="text-xs text-zinc-300 font-mono">
              {t.adminAutoPlay}
            </span>
            <input
              type="checkbox"
              checked={settings.heroAutoPlay !== false}
              onChange={(e) => onChange({ heroAutoPlay: e.target.checked })}
              className="accent-amber-500 w-4 h-4 cursor-pointer"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {[3, 5, 7, 10, 15].map((sec) => {
            const isSelected = (settings.heroSliderIntervalSeconds || 5) === sec;
            return (
              <button
                key={sec}
                type="button"
                onClick={() => onChange({ heroSliderIntervalSeconds: sec })}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-black font-bold shadow-md'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                {sec} {t.secondsUnit}{sec === 5 ? ` ${t.defaultTag}` : ''}
              </button>
            );
          })}

          <div className="flex items-center gap-2 ml-auto rtl:ml-0 rtl:mr-auto">
            <span className="text-xs text-zinc-400 font-mono">
              {t.customLabel}
            </span>
            <input
              type="number"
              min={2}
              max={30}
              value={settings.heroSliderIntervalSeconds || 5}
              onChange={(e) => onChange({ heroSliderIntervalSeconds: Math.max(2, Math.min(30, parseInt(e.target.value) || 5)) })}
              className="w-16 bg-zinc-950 border border-zinc-700 px-2 py-1 text-xs text-white text-center font-mono rounded focus:border-amber-500 focus:outline-none"
            />
            <span className="text-xs text-zinc-400 font-mono">
              {t.secondUnit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
