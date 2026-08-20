import React from 'react';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/shared';
import { StoreLocation } from '@/types';

interface StoreMapCanvasProps {
  stores: StoreLocation[];
  selectedStore: StoreLocation;
  onSelectStore: (store: StoreLocation) => void;
  onScheduleFitting: () => void;
}

export const StoreMapCanvas: React.FC<StoreMapCanvasProps> = ({
  stores,
  selectedStore,
  onSelectStore,
  onScheduleFitting,
}) => {
  const { t, isRTL } = useLanguage();
  const activeStores = stores.filter((s) => s.active !== false);

  const activeName = isRTL ? selectedStore.name : (selectedStore.nameEn || selectedStore.name);
  const activeAddress = isRTL ? selectedStore.address : (selectedStore.addressEn || selectedStore.address);

  return (
    <div className="lg:col-span-7 flex flex-col gap-4">
      <div className="relative aspect-[16/10] sm:aspect-[16/11] w-full bg-zinc-950 border border-surface-container dark:border-zinc-800 overflow-hidden shadow-2xl">
        {/* World Grid Texture */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Architectural Map Background Image */}
        <img
          src={selectedStore.image}
          alt={selectedStore.name}
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

        {/* Map Interactive Pins for all stores */}
        {activeStores.map((st) => {
          const isSelected = selectedStore.id === st.id;
          const pinCity = isRTL ? st.city : (st.cityEn || st.city);
          const pinX = st.coordinates?.x ?? 50;
          const pinY = st.coordinates?.y ?? 50;

          return (
            <button
              key={st.id}
              onClick={() => onSelectStore(st)}
              style={{ top: `${pinY}%`, left: `${pinX}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
            >
              <div className="relative">
                {isSelected && (
                  <span className="absolute -inset-2 rounded-full bg-white/30 animate-ping" />
                )}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-xl transition-all ${
                    isSelected
                      ? 'bg-white text-black scale-125 ring-4 ring-white/40'
                      : 'bg-zinc-800 text-white border border-zinc-600 hover:scale-110'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* City Marker Label */}
              <span className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/90 text-white font-mono text-[10px] tracking-wider uppercase whitespace-nowrap border border-zinc-800">
                {pinCity}
              </span>
            </button>
          );
        })}

        {/* Selected Store Active Overlay Card */}
        <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/85 backdrop-blur-md border border-zinc-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
              {t.activeSelection} {selectedStore.type}
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl text-white">
              {activeName}
            </h3>
            <p className="text-xs text-zinc-300 font-light mt-0.5">
              {activeAddress}
            </p>
          </div>

          <button
            onClick={onScheduleFitting}
            className="py-3 px-6 bg-white text-black font-label-bold text-xs tracking-widest uppercase hover:bg-zinc-200 transition-colors whitespace-nowrap"
          >
            {t.scheduleFitting}
          </button>
        </div>
      </div>
    </div>
  );
};
