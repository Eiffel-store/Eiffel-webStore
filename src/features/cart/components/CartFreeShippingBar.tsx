import React from 'react';
import { Truck } from 'lucide-react';
import { useCurrency } from '@/shared';
import { useLanguage } from '@/shared';

interface CartFreeShippingBarProps {
  freeShippingRemaining: number;
  freeShippingProgress: number;
}

export const CartFreeShippingBar: React.FC<CartFreeShippingBarProps> = ({
  freeShippingRemaining,
  freeShippingProgress,
}) => {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  return (
    <div className="p-4 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800">
      <div className="flex justify-between items-center text-xs mb-2">
        <span className="flex items-center gap-2 font-label-bold text-primary dark:text-white uppercase tracking-wider">
          <Truck className="w-4 h-4" />
          {freeShippingRemaining === 0 ? (
            <span className="text-green-600 dark:text-green-400 font-bold">
              {t.freeShippingUnlocked}
            </span>
          ) : (
            <span>
              {t.addForFreeShipping}: <strong className="font-mono">{formatPrice(freeShippingRemaining)}</strong>
            </span>
          )}
        </span>
        <span className="font-mono text-xs text-secondary">{freeShippingProgress}%</span>
      </div>
      <div className="w-full h-1.5 bg-surface-container dark:bg-zinc-800">
        <div
          className="h-full bg-primary dark:bg-white transition-all duration-500"
          style={{ width: `${freeShippingProgress}%` }}
        />
      </div>
    </div>
  );
};
