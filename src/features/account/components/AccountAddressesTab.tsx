import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="font-editorial text-2xl text-primary dark:text-white">
          {t.savedAddressesTitle}
        </h3>
        <button
          onClick={onOpenAddModal}
          className="py-2 px-4 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-wider uppercase flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.addNewAddress}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="p-6 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-secondary">{addr.id}</span>
                {addr.isDefault && (
                  <span className="text-[10px] font-label-bold px-2 py-0.5 bg-primary text-white dark:bg-white dark:text-black uppercase">
                    {t.defaultBadge}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-primary dark:text-white">{addr.firstName} {addr.lastName}</p>
              <p className="text-xs text-secondary dark:text-zinc-400">{addr.street}</p>
              <p className="text-xs text-secondary dark:text-zinc-400">{addr.city}, {addr.postalCode} - {addr.country}</p>
            </div>

            <div className="pt-6 mt-6 border-t border-surface-container dark:border-zinc-800 flex justify-between items-center text-xs font-label-bold">
              {!addr.isDefault && (
                <button
                  onClick={() => onSetDefault(addr.id)}
                  className="text-secondary hover:text-primary dark:hover:text-white uppercase"
                >
                  {t.setDefault}
                </button>
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
    </div>
  );
};
