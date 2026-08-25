import React from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '@/shared';

interface MapPickerFooterProps {
  onClose: () => void;
  onConfirm: () => void;
  disabled?: boolean;
}

export const MapPickerFooter: React.FC<MapPickerFooterProps> = ({
  onClose,
  onConfirm,
  disabled = false,
}) => {
  const { t } = useLanguage();

  return (
    <div className="p-4 border-t border-zinc-800 bg-zinc-900/70 flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-xs font-bold rounded transition-colors cursor-pointer"
      >
        {t.cancel}
      </button>

      <button
        type="button"
        onClick={onConfirm}
        disabled={disabled}
        className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 font-label-bold text-xs uppercase tracking-wider rounded flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
      >
        <Check className="w-4 h-4" />
        <span>{t.mapConfirmLocation}</span>
      </button>
    </div>
  );
};
