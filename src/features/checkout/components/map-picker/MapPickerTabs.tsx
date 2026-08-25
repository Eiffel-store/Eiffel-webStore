import React from 'react';
import { useLanguage } from '@/shared';

export type MapPickerTabMode = 'quick' | 'search' | 'link';

interface MapPickerTabsProps {
  activeMode: MapPickerTabMode;
  onModeChange: (mode: MapPickerTabMode) => void;
}

export const MapPickerTabs: React.FC<MapPickerTabsProps> = ({
  activeMode,
  onModeChange,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs">
      <button
        type="button"
        onClick={() => onModeChange('quick')}
        className={`flex-1 py-1.5 px-2.5 rounded font-bold transition-colors cursor-pointer ${
          activeMode === 'quick' ? 'bg-white text-black shadow' : 'text-zinc-400 hover:text-white'
        }`}
      >
        {t.mapQuickRegions}
      </button>
      <button
        type="button"
        onClick={() => onModeChange('search')}
        className={`flex-1 py-1.5 px-2.5 rounded font-bold transition-colors cursor-pointer ${
          activeMode === 'search' ? 'bg-white text-black shadow' : 'text-zinc-400 hover:text-white'
        }`}
      >
        {t.mapSearchStreet}
      </button>
      <button
        type="button"
        onClick={() => onModeChange('link')}
        className={`flex-1 py-1.5 px-2.5 rounded font-bold transition-colors cursor-pointer ${
          activeMode === 'link' ? 'bg-white text-black shadow' : 'text-zinc-400 hover:text-white'
        }`}
      >
        {t.mapGoogleMapsLink}
      </button>
    </div>
  );
};
