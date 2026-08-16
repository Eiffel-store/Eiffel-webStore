import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '@/shared';
import { PaymentMethod } from '@/types';

interface AccountPaymentsTabProps {
  paymentMethods: PaymentMethod[];
  onOpenAddModal: () => void;
  onDelete: (id: string) => void;
}

export const AccountPaymentsTab: React.FC<AccountPaymentsTabProps> = ({
  paymentMethods,
  onOpenAddModal,
  onDelete,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="font-editorial text-2xl text-primary dark:text-white">
          {t.savedCardsTitle}
        </h3>
        <button
          onClick={onOpenAddModal}
          className="py-2 px-4 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-wider uppercase flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.addNewCard}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paymentMethods.map((pm) => (
          <div
            key={pm.id}
            className="p-6 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-editorial text-lg text-primary dark:text-white uppercase">{pm.type}</span>
                {pm.isDefault && (
                  <span className="text-[10px] font-label-bold px-2 py-0.5 bg-primary text-white dark:bg-white dark:text-black uppercase">
                    {t.defaultBadge}
                  </span>
                )}
              </div>
              <p className="font-mono text-base font-bold text-primary dark:text-white tracking-widest">
                {pm.cardNumber}
              </p>
              <div className="flex justify-between text-xs text-secondary font-mono">
                <span>{pm.cardholderName}</span>
                <span>{pm.expiry}</span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-surface-container dark:border-zinc-800 flex justify-end">
              <button
                onClick={() => onDelete(pm.id)}
                className="text-xs font-label-bold text-error hover:underline uppercase flex items-center gap-1"
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
