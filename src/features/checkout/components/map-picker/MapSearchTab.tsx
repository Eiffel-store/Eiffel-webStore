import React from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { useLanguage } from '@/shared';

interface SearchResultItem {
  displayName: string;
  latitude: number;
  longitude: number;
  governorate?: string;
}

interface MapSearchTabProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  isSearching: boolean;
  searchResults: SearchResultItem[];
  onSelectSearchResult: (result: SearchResultItem) => void;
}

export const MapSearchTab: React.FC<MapSearchTabProps> = ({
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  isSearching,
  searchResults,
  onSelectSearchResult,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <form onSubmit={onSearchSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder={t.mapSearchPlaceholder}
            className="w-full bg-zinc-900 border border-zinc-700 pl-8 pr-3 rtl:pl-3 rtl:pr-8 py-2 text-xs text-white placeholder:text-zinc-500 rounded focus:outline-none focus:border-amber-400"
            autoFocus
          />
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 rtl:left-auto rtl:right-2.5 top-3 pointer-events-none" />
        </div>
        <button
          type="submit"
          disabled={isSearching || !searchQuery.trim()}
          className="px-4 py-2 bg-white text-black hover:bg-zinc-200 text-xs rounded font-bold transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : t.search}
        </button>
      </form>

      {searchResults.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg divide-y divide-zinc-800 max-h-36 overflow-y-auto">
          {searchResults.map((r, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectSearchResult(r)}
              className="w-full text-left rtl:text-right p-2 text-xs text-zinc-300 hover:bg-zinc-800 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{r.displayName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
