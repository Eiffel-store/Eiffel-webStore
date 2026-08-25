import React from 'react';
import { MapPin, Crosshair, Loader2 } from 'lucide-react';
import { useLanguage } from '@/shared';
import { POPULAR_EGYPT_AREAS } from '@/services/locationService';

interface MapQuickAreasTabProps {
  onSelectPreset: (preset: typeof POPULAR_EGYPT_AREAS[0]) => void;
  onDetectGps: () => void;
  isDetectingGps: boolean;
}

export const MapQuickAreasTab: React.FC<MapQuickAreasTabProps> = ({
  onSelectPreset,
  onDetectGps,
  isDetectingGps,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-zinc-400 font-bold">
          {t.mapQuickRegions}:
        </span>
        <button
          type="button"
          onClick={onDetectGps}
          disabled={isDetectingGps}
          className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
        >
          {isDetectingGps ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Crosshair className="w-3 h-3" />
          )}
          <span>{t.detectGps}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
        {POPULAR_EGYPT_AREAS.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPreset(preset)}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-400/50 rounded text-left text-xs transition-colors flex items-center gap-1.5 cursor-pointer group"
          >
            <MapPin className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="text-zinc-200 truncate text-[11px] font-medium">
              {preset.nameAr}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
