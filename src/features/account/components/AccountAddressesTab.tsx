import React from 'react';
import { Plus, Trash2, MapPin, ExternalLink, Home, Briefcase, Tag } from 'lucide-react';
import { useLanguage } from '@/shared';
import { Address } from '@/types';

interface AccountAddressesTabProps {
  addresses: Address[];
  onOpenAddModal: () => void;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AccountAddressesTab: React.FC<AccountAddressesTabProps> = ({
  addresses,
  onOpenAddModal,
  onSetDefault,
  onDelete,
}) => {
  const { t } = useLanguage();

  const getAddressIcon = (type?: string) => {
    switch (type) {
      case 'Work':
        return <Briefcase className="w-3.5 h-3.5 text-zinc-400" />;
      case 'Other':
        return <Tag className="w-3.5 h-3.5 text-zinc-400" />;
      case 'Home':
      default:
        return <Home className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="font-editorial text-2xl text-primary dark:text-white">
          {t.savedAddressesTitle}
        </h3>
        <button
          onClick={onOpenAddModal}
          className="py-2 px-4 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.addNewAddress}</span>
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="p-12 text-center bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800">
          <MapPin className="w-8 h-8 text-secondary dark:text-zinc-500 mx-auto mb-3 opacity-60" />
          <p className="text-xs text-secondary dark:text-zinc-400">
            {t.noSavedAddresses}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-6 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 flex flex-col justify-between shadow-sm relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    {getAddressIcon(addr.type)}
                    <span className="text-[11px] font-bold uppercase tracking-wider text-secondary dark:text-zinc-400">
                      {addr.type === 'Home'
                        ? t.homeType
                        : addr.type === 'Work'
                        ? t.workType
                        : t.otherType}
                    </span>
                  </div>
                  {addr.isDefault && (
                    <span className="text-[10px] font-label-bold px-2 py-0.5 bg-primary text-white dark:bg-white dark:text-black uppercase">
                      {t.defaultBadge}
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-sm font-bold text-primary dark:text-white">
                    {addr.firstName} {addr.lastName}
                  </p>
                  <p className="text-xs text-secondary dark:text-zinc-400 font-mono mt-0.5">
                    {addr.phone}
                  </p>
                </div>

                <div className="text-xs text-secondary dark:text-zinc-300 space-y-0.5">
                  <p className="font-medium">{addr.street}</p>
                  {addr.apartment && (
                    <p className="text-zinc-400 text-[11px]">{addr.apartment}</p>
                  )}
                  <p className="text-zinc-400 text-[11px]">
                    {addr.city}{addr.postalCode ? ` - ${addr.postalCode}` : ''} ({addr.country})
                  </p>
                </div>

                {/* Map Attached Badge */}
                {addr.mapUrl && (
                  <div className="pt-2">
                    <a
                      href={addr.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:text-amber-400 text-[11px] font-bold rounded transition-colors"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>{t.pinnedOnMap}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-6 border-t border-surface-container dark:border-zinc-800 flex justify-between items-center text-xs font-label-bold">
                {!addr.isDefault ? (
                  <button
                    onClick={() => onSetDefault(addr.id)}
                    className="text-secondary hover:text-primary dark:hover:text-white uppercase transition-colors"
                  >
                    {t.setDefault}
                  </button>
                ) : (
                  <span className="text-[11px] text-emerald-500 font-mono">✓ {t.defaultBadgeText}</span>
                )}
                <button
                  onClick={() => onDelete(addr.id)}
                  className="text-error hover:underline uppercase flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{t.delete}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
