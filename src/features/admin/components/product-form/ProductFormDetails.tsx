import React from 'react';
import { Sparkles, Layers, Scissors, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/shared';
import {
  FABRIC_COMPOSITION_PRESETS,
  FIT_SILHOUETTE_PRESETS,
  FEATURE_HIGHLIGHT_PRESETS,
  CARE_INSTRUCTION_PRESETS,
  DESCRIPTION_TEMPLATES
} from '../../constants';

interface ProductFormDetailsProps {
  description: string;
  composition: string;
  fit: string;
  details: string[];
  care: string[];
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
  onChange
}) => {
  const { t } = useLanguage();

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

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-6 shadow-xl rounded-sm">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>{t.adminDetailsAndCareSection}</span>
        </h2>
        <span className="text-[10px] font-mono text-zinc-500 uppercase">
          {t.adminQuickPresets}
        </span>
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
            {DESCRIPTION_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => onChange({ description: tmpl.text })}
                title={t.adminClickToApplyTemplate}
                className="px-2 py-0.5 bg-zinc-900 hover:bg-amber-500/20 text-zinc-300 hover:text-amber-300 border border-zinc-700 hover:border-amber-500/40 text-[10px] rounded transition-all cursor-pointer"
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
          placeholder="Architectural garment description..."
          className="w-full bg-zinc-900 border border-zinc-700 p-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 rounded-sm transition-colors"
        />
      </div>

      {/* 2. Composition & Fit Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Fabric & Material Composition */}
        <div className="space-y-2">
          <label className="block text-xs text-zinc-300 font-bold">
            {t.adminFabricComposition}
          </label>
          <input
            type="text"
            value={composition}
            onChange={(e) => onChange({ composition: e.target.value })}
            placeholder="100% Egyptian Cotton (280 GSM)"
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 rounded-sm transition-colors"
          />

          {/* Quick Composition Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {FABRIC_COMPOSITION_PRESETS.map((text, idx) => {
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

        {/* Fit & Silhouette */}
        <div className="space-y-2">
          <label className="block text-xs text-zinc-300 font-bold flex items-center gap-1.5">
            <Scissors className="w-3.5 h-3.5 text-zinc-400" />
            <span>{t.adminCutAndFit}</span>
          </label>
          <input
            type="text"
            value={fit}
            onChange={(e) => onChange({ fit: e.target.value })}
            placeholder="Relaxed Drop-Shoulder Boxy Fit"
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 rounded-sm transition-colors"
          />

          {/* Quick Fit Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {FIT_SILHOUETTE_PRESETS.map((text, idx) => {
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
            placeholder={`100% Heavyweight Cotton\nMade in Egypt\nPrecision Stitching`}
            className="w-full bg-zinc-900 border border-zinc-700 p-3 text-xs text-white font-mono placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 rounded-sm"
          />

          {/* Quick Feature Highlight Multi-Select Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {FEATURE_HIGHLIGHT_PRESETS.map((text, idx) => {
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

        {/* Care & Washing Instructions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-zinc-300 font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.adminCareInstructions}</span>
            </label>
            <span className="text-[10px] font-mono text-zinc-500">
              {care.length} {t.adminPiecesCount || 'items'}
            </span>
          </div>

          <textarea
            rows={4}
            value={care.join('\n')}
            onChange={(e) => onChange({ care: e.target.value.split('\n').filter(Boolean) })}
            placeholder={`Machine wash cold\nDo not bleach\nIron inside-out`}
            className="w-full bg-zinc-900 border border-zinc-700 p-3 text-xs text-white font-mono placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 rounded-sm"
          />

          {/* Quick Care Multi-Select Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {CARE_INSTRUCTION_PRESETS.map((text, idx) => {
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
