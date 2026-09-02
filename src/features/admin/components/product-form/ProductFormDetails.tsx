import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  Scissors,
  CheckCircle2,
  ShieldAlert,
  Shirt,
  Footprints,
  Briefcase,
  Watch
} from 'lucide-react';
import { useLanguage } from '@/shared';
import {
  CATEGORY_PRESET_BUNDLES,
  PresetCategory
} from '../../constants';

interface ProductFormDetailsProps {
  description: string;
  composition: string;
  fit: string;
  details: string[];
  care: string[];
  category?: string;
  subCategory?: string;
  onChange: (updates: {
    description?: string;
    composition?: string;
    fit?: string;
    details?: string[];
    care?: string[];
  }) => void;
}

export const ProductFormDetails: React.FC<ProductFormDetailsProps> = ({
  description,
  composition,
  fit,
  details,
  care,
  category,
  subCategory,
  onChange
}) => {
  const { t } = useLanguage();

  // Helper to guess default category preset based on product subcategory/category
  const detectPresetCategory = (): PresetCategory => {
    const combined = `${category || ''} ${subCategory || ''}`.toLowerCase();
    if (combined.includes('shoe') || combined.includes('sneaker') || combined.includes('حذاء') || combined.includes('كوتشي') || combined.includes('سنيكرز') || combined.includes('سلايدز') || combined.includes('بوت')) {
      return 'shoes';
    }
    if (combined.includes('bag') || combined.includes('backpack') || combined.includes('شنط') || combined.includes('حقائب') || combined.includes('دفل') || combined.includes('كروس')) {
      return 'bags';
    }
    if (combined.includes('accessor') || combined.includes('cap') || combined.includes('hat') || combined.includes('belt') || combined.includes('wallet') || combined.includes('sunglass') || combined.includes('حزام') || combined.includes('كاب') || combined.includes('محفظة') || combined.includes('نظار')) {
      return 'accessories';
    }
    return 'clothing';
  };

  const [activeCategory, setActiveCategory] = useState<PresetCategory>(detectPresetCategory());

  useEffect(() => {
    const detected = detectPresetCategory();
    if (detected !== 'clothing') {
      setActiveCategory(detected);
    }
  }, [category, subCategory]);

  const bundle = CATEGORY_PRESET_BUNDLES[activeCategory] || CATEGORY_PRESET_BUNDLES.clothing;

  // Helper to toggle a line in string array
  const toggleArrayItem = (currentList: string[], itemText: string, fieldName: 'details' | 'care') => {
    const trimmed = itemText.trim();
    const exists = currentList.some(i => i.trim().toLowerCase() === trimmed.toLowerCase());
    
    let updated: string[];
    if (exists) {
      updated = currentList.filter(i => i.trim().toLowerCase() !== trimmed.toLowerCase());
    } else {
      updated = [...currentList, trimmed];
    }
    onChange({ [fieldName]: updated });
  };

  const isItemActive = (currentList: string[], itemText: string) => {
    const trimmed = itemText.trim().toLowerCase();
    return currentList.some(i => i.trim().toLowerCase() === trimmed);
  };

  const categoryTabs: Array<{ id: PresetCategory; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'clothing', label: t.tabClothingPreset, icon: Shirt },
    { id: 'shoes', label: t.tabShoesPreset, icon: Footprints },
    { id: 'bags', label: t.tabBagsPreset, icon: Briefcase },
    { id: 'accessories', label: t.tabAccessoriesPreset, icon: Watch }
  ];

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-6 shadow-xl rounded-sm">
      {/* Header & Category Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>{t.adminDetailsAndCareSection}</span>
          </h2>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            {t.adminProductTypePresetsDesc}
          </p>
        </div>

        {/* Category Preset Switcher Pills */}
        <div className="flex items-center gap-1.5 flex-wrap bg-zinc-900/80 p-1 border border-zinc-800 rounded-lg">
          {categoryTabs.map((tab) => {
            const isSelected = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-black font-bold shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Detailed Description with Quick Templates */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="block text-xs text-zinc-300 font-bold">
            {t.adminFullDescription}
          </label>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{t.adminQuickTemplates}:</span>
            </span>
            {bundle.templates.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => onChange({ description: tmpl.text })}
                title={t.adminClickToApplyTemplate}
                className="px-2.5 py-0.5 bg-zinc-900 hover:bg-amber-500/20 text-zinc-300 hover:text-amber-300 border border-zinc-700 hover:border-amber-500/40 text-[11px] rounded transition-all cursor-pointer"
              >
                {tmpl.name}
              </button>
            ))}
          </div>
        </div>

        <textarea
          rows={3}
          value={description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder={t.adminProductDescPlaceholder}
          className="w-full bg-zinc-900 border border-zinc-700 p-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 rounded-sm transition-colors"
        />
      </div>

      {/* 2. Composition & Fit Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Fabric & Material Composition */}
        <div className="space-y-2">
          <label className="block text-xs text-zinc-300 font-bold">
            {activeCategory === 'shoes'
              ? t.materialShoeSole
              : activeCategory === 'bags'
              ? t.materialBagLining
              : activeCategory === 'accessories'
              ? t.materialAccessory
              : t.adminFabricComposition}
          </label>
          <input
            type="text"
            value={composition}
            onChange={(e) => onChange({ composition: e.target.value })}
            placeholder={
              activeCategory === 'shoes'
                ? t.materialShoePlaceholder
                : activeCategory === 'bags'
                ? t.materialBagPlaceholder
                : activeCategory === 'accessories'
                ? t.materialAccessoryPlaceholder
                : t.materialDefaultPlaceholder
            }
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 rounded-sm transition-colors"
          />

          {/* Quick Composition Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {bundle.fabrics.map((text, idx) => {
              const isSelected = composition.trim().toLowerCase() === text.trim().toLowerCase();
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange({ composition: text })}
                  className={`px-2 py-0.5 text-[10px] rounded border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-black border-amber-500 font-bold shadow-sm'
                      : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-600'
                  }`}
                >
                  {text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fit & Silhouette / Model */}
        <div className="space-y-2">
          <label className="block text-xs text-zinc-300 font-bold flex items-center gap-1.5">
            <Scissors className="w-3.5 h-3.5 text-zinc-400" />
            <span>
              {activeCategory === 'shoes'
                ? t.modelShoe
                : activeCategory === 'bags'
                ? t.modelBag
                : activeCategory === 'accessories'
                ? t.modelFit
                : t.adminCutAndFit}
            </span>
          </label>
          <input
            type="text"
            value={fit}
            onChange={(e) => onChange({ fit: e.target.value })}
            placeholder={
              activeCategory === 'shoes'
                ? t.modelShoePlaceholder
                : activeCategory === 'bags'
                ? t.modelBagPlaceholder
                : activeCategory === 'accessories'
                ? t.modelAccessoryPlaceholder
                : t.modelDefaultPlaceholder
            }
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 rounded-sm transition-colors"
          />

          {/* Quick Fit Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {bundle.fits.map((text, idx) => {
              const isSelected = fit.trim().toLowerCase() === text.trim().toLowerCase();
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange({ fit: text })}
                  className={`px-2 py-0.5 text-[10px] rounded border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-black border-amber-500 font-bold shadow-sm'
                      : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-600'
                  }`}
                >
                  {text}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Bullet Details & Care Instructions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
        {/* Bullet Details & Highlights */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-zinc-300 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.adminKeyHighlights}</span>
            </label>
            <span className="text-[10px] font-mono text-zinc-500">
              {details.length} {t.adminPiecesCount || 'items'}
            </span>
          </div>

          <textarea
            rows={4}
            value={details.join('\n')}
            onChange={(e) => onChange({ details: e.target.value.split('\n').filter(Boolean) })}
            placeholder={
              activeCategory === 'shoes'
                ? t.specsShoeDefault
                : activeCategory === 'bags'
                ? t.specsBagDefault
                : t.specsClothingDefault
            }
            className="w-full bg-zinc-900 border border-zinc-700 p-3 text-xs text-white font-mono placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 rounded-sm"
          />

          {/* Quick Feature Highlight Multi-Select Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {bundle.features.map((text, idx) => {
              const active = isItemActive(details, text);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleArrayItem(details, text, 'details')}
                  title={t.adminClickToAddBullet}
                  className={`px-2 py-0.5 text-[10px] rounded border transition-all flex items-center gap-1 cursor-pointer ${
                    active
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                      : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-600'
                  }`}
                >
                  <span>{active ? '✓' : '+'}</span>
                  <span>{text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Care & Maintenance Instructions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-zinc-300 font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {activeCategory === 'shoes' || activeCategory === 'bags'
                  ? t.careCleaning
                  : t.adminCareInstructions}
              </span>
            </label>
            <span className="text-[10px] font-mono text-zinc-500">
              {care.length} {t.adminPiecesCount || 'items'}
            </span>
          </div>

          <textarea
            rows={4}
            value={care.join('\n')}
            onChange={(e) => onChange({ care: e.target.value.split('\n').filter(Boolean) })}
            placeholder={
              activeCategory === 'shoes'
                ? t.careNonClothingDefault
                : t.careClothingDefault
            }
            className="w-full bg-zinc-900 border border-zinc-700 p-3 text-xs text-white font-mono placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 rounded-sm"
          />

          {/* Quick Care Multi-Select Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {bundle.care.map((text, idx) => {
              const active = isItemActive(care, text);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleArrayItem(care, text, 'care')}
                  title={t.adminClickToAddBullet}
                  className={`px-2 py-0.5 text-[10px] rounded border transition-all flex items-center gap-1 cursor-pointer ${
                    active
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                      : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-600'
                  }`}
                >
                  <span>{active ? '✓' : '+'}</span>
                  <span>{text}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
