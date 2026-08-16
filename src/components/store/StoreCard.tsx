import React from 'react';
import { MapPin, Clock, Phone, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { StoreLocation } from '../../types';

interface StoreCardProps {
  store: StoreLocation;
  isSelected: boolean;
  onSelect: () => void;
  onBookAppointment: () => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({
  store,
  isSelected,
  onSelect,
  onBookAppointment,
}) => {
  const { t } = useLanguage();

  return (
    <div
      onClick={onSelect}
      className={`p-6 border cursor-pointer transition-all ${
        isSelected
          ? 'border-primary dark:border-white bg-surface-container-low dark:bg-zinc-900 shadow-md'
          : 'border-surface-container dark:border-zinc-800 bg-surface-container-lowest dark:bg-zinc-950 hover:border-secondary'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="font-editorial text-2xl text-primary dark:text-white">
          {store.city.toUpperCase()}
        </span>
        <span className="text-[10px] font-label-bold uppercase px-2 py-0.5 bg-surface-container dark:bg-zinc-800 text-secondary dark:text-zinc-300">
          {store.type}
        </span>
      </div>

      <h4 className="font-editorial text-lg text-primary dark:text-white">
        {store.name}
      </h4>

      <div className="mt-3 space-y-1.5 text-xs text-secondary dark:text-zinc-400 font-light">
        <p className="flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary dark:text-white" />
          <span>{store.address}</span>
        </p>
        <p className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 shrink-0 text-primary dark:text-white" />
          <span>{store.hours}</span>
        </p>
        <p className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 shrink-0 text-primary dark:text-white" />
          <span>{store.phone}</span>
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-surface-container/60 dark:border-zinc-800 flex items-center justify-between gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookAppointment();
          }}
          className="py-2 px-4 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-[11px] tracking-wider uppercase hover:bg-neutral-800 transition-colors"
        >
          {t.bookAppointment}
        </button>

        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-xs font-label-bold text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white flex items-center gap-1 uppercase"
        >
          <span>{t.getDirections}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
