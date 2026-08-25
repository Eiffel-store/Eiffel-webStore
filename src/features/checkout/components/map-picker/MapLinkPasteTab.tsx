import React from 'react';
import { Link2 } from 'lucide-react';
import { useLanguage } from '@/shared';

interface MapLinkPasteTabProps {
  pastedUrl: string;
  onPastedUrlChange: (url: string) => void;
  onParsePastedUrl: () => void;
}

export const MapLinkPasteTab: React.FC<MapLinkPasteTabProps> = ({
  pastedUrl,
  onPastedUrlChange,
  onParsePastedUrl,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <label className="block text-[11px] text-zinc-400 font-bold">
        {t.mapPasteLinkPrompt}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={pastedUrl}
          onChange={(e) => onPastedUrlChange(e.target.value)}
          placeholder="e.g. https://maps.google.com/?q=30.7126,31.2464"
          className="flex-1 bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white placeholder:text-zinc-500 rounded focus:outline-none focus:border-amber-400 font-mono"
        />
        <button
          type="button"
          onClick={onParsePastedUrl}
          disabled={!pastedUrl.trim()}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>{t.apply}</span>
        </button>
      </div>
    </div>
  );
};
