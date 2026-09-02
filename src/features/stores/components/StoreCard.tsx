import React from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';
import { useLanguage } from '@/shared';
import { StoreLocation } from '@/types';

interface StoreCardProps {
  store: StoreLocation;
  isSelected: boolean;
  onSelect: () => void;
  onBookAppointment?: () => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({
  store,
  isSelected,
  onSelect,
}) => {
  const { t, language } = useLanguage();

  const isArabic = language === 'ar';
  const displayName = isArabic ? store.name : (store.nameEn || store.name);
  const displayCity = isArabic ? store.city : (store.cityEn || store.city);
  const displayAddress = isArabic ? store.address : (store.addressEn || store.address);
  const displayHours = isArabic ? store.hours : (store.hoursEn || store.hours);

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
          {displayCity}
        </span>
        <span className="text-[10px] font-label-bold uppercase px-2 py-0.5 bg-surface-container dark:bg-zinc-800 text-secondary dark:text-zinc-300">
          {store.type}
        </span>
      </div>

      <h4 className="font-editorial text-lg text-primary dark:text-white">
        {displayName}
      </h4>

      <div className="mt-3 space-y-1.5 text-xs text-secondary dark:text-zinc-400 font-light">
        <p className="flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary dark:text-white" />
          <span>{displayAddress}</span>
        </p>
        <p className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 shrink-0 text-primary dark:text-white" />
          <span>{displayHours}</span>
        </p>
        {store.phone && (
          <p className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 shrink-0 text-primary dark:text-white" />
            <span>{store.phone}</span>
          </p>
        )}
        {store.mapLink && (
          <p className="pt-1">
            <a
              href={store.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] text-amber-500 hover:underline inline-flex items-center gap-1 font-mono"
            >
              <MapPin className="w-3 h-3" />
              <span>{t.viewOnGoogleMaps} &rarr;</span>
            </a>
          </p>
        )}
      </div>
    </div>
  );
};
