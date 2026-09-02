import React from 'react';
import { MapPin, Edit2, Trash2, Phone, Clock } from 'lucide-react';
import { StoreLocation } from '@/types';
import { useLanguage } from '@/shared';

interface AdminBranchCardProps {
  store: StoreLocation;
  onEdit: (store: StoreLocation) => void;
  onDelete: (id: string) => void;
}

export const AdminBranchCard: React.FC<AdminBranchCardProps> = ({
  store,
  onEdit,
  onDelete
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-zinc-950 border border-zinc-800 overflow-hidden shadow-xl flex flex-col justify-between group hover:border-zinc-700 transition-colors">
      <div className="relative aspect-[16/9] overflow-hidden bg-zinc-900">
        <img
          src={store.image}
          alt={store.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
            store.active !== false
              ? 'bg-emerald-500/90 text-white'
              : 'bg-zinc-800/90 text-zinc-400 border border-zinc-700'
          }`}>
            {store.active !== false ? t.adminActiveStatus : t.adminInactiveStatus}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase font-bold">
            {store.city}
          </span>
          <span className="text-[10px] text-zinc-300 bg-black/60 px-2 py-0.5">
            {store.type}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div>
            <h3 className="font-editorial text-lg font-bold text-white tracking-wide">
              {store.name}
            </h3>
            {store.nameEn && (
              <p className="text-xs text-amber-400 font-mono">
                {store.nameEn}
              </p>
            )}
          </div>

          <p className="text-xs text-zinc-300 flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
            <span>{store.address}</span>
          </p>

          <div className="text-xs text-zinc-400 flex items-center gap-2 font-mono">
            <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span>{store.hours}</span>
          </div>

          <div className="text-xs text-zinc-400 flex items-center gap-2 font-mono">
            <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{store.phone}</span>
          </div>

          {store.mapLink && (
            <div className="pt-1">
              <a
                href={store.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 font-mono"
              >
                <MapPin className="w-3 h-3" />
                <span>{t.openInGoogleMaps} &rarr;</span>
              </a>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(store)}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>{t.adminEditBranch}</span>
          </button>
          <button
            onClick={() => onDelete(store.id)}
            className="p-1.5 bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-400 border border-zinc-700 text-xs transition-colors cursor-pointer"
            title={t.delete}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
