import React from 'react';
import { MapPin, X } from 'lucide-react';
import { useLanguage } from '@/shared';

interface MapPickerHeaderProps {
  onClose: () => void;
}

export const MapPickerHeader: React.FC<MapPickerHeaderProps> = ({ onClose }) => {
  const { t } = useLanguage();

  return (
    <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
          <MapPin className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-editorial text-base sm:text-lg font-bold text-white tracking-wide">
            {t.mapPickerModalTitle}
          </h3>
          <p className="text-[11px] text-zinc-400">
            {t.mapPickerModalDesc}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
