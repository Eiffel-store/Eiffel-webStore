import React from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useLanguage } from '@/shared';

interface MapAddressDetailsFormProps {
  customGov: string;
  onCustomGovChange: (gov: string) => void;
  customStreet: string;
  onCustomStreetChange: (street: string) => void;
  isResolvingAddress: boolean;
}

export const MapAddressDetailsForm: React.FC<MapAddressDetailsFormProps> = ({
  customGov,
  onCustomGovChange,
  customStreet,
  onCustomStreetChange,
  isResolvingAddress,
}) => {
  const { t } = useLanguage();

  return (
    <div className="p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase text-zinc-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t.mapConfirmedDetails}</span>
        </span>
        {isResolvingAddress && (
          <span className="text-[10px] text-amber-400 flex items-center gap-1 font-mono">
            <Loader2 className="w-3 h-3 animate-spin" /> {t.loading}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
        <div>
          <label className="block text-[10px] text-zinc-400 font-bold mb-1">
            {t.mapSelectedGovernorate}
          </label>
          <input
            type="text"
            value={customGov}
            onChange={(e) => onCustomGovChange(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700 px-2.5 py-1.5 text-xs text-white rounded focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="block text-[10px] text-zinc-400 font-bold mb-1">
            {t.mapStreetDetailsLabel}
          </label>
          <input
            type="text"
            value={customStreet}
            onChange={(e) => onCustomStreetChange(e.target.value)}
            placeholder={t.streetDetailedPlaceholder}
            className="w-full bg-zinc-950 border border-zinc-700 px-2.5 py-1.5 text-xs text-white rounded focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>
    </div>
  );
};
