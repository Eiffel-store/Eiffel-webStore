import React from 'react';
import { Gift } from 'lucide-react';
import { useCurrency } from '@/shared';
import { useLanguage } from '@/shared';

interface CartGiftWrapProps {
  giftWrap: boolean;
  setGiftWrap: (val: boolean) => void;
  orderNote: string;
  setOrderNote: (val: string) => void;
}

export const CartGiftWrap: React.FC<CartGiftWrapProps> = ({
  giftWrap,
  setGiftWrap,
  orderNote,
  setOrderNote,
}) => {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  return (
    <div className="p-6 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 space-y-4">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={giftWrap}
          onChange={(e) => setGiftWrap(e.target.checked)}
          className="w-4 h-4 rounded-none text-primary focus:ring-0 cursor-pointer"
        />
        <span className="font-label-bold text-xs tracking-wider uppercase text-primary dark:text-white flex items-center gap-2">
          <Gift className="w-4 h-4" />
          {t.giftBoxAdd} (+{formatPrice(15)})
        </span>
      </label>

      <div>
        <label className="block text-xs font-label-bold tracking-wider text-secondary dark:text-zinc-400 uppercase mb-2">
          {t.specialInstructions}
        </label>
        <textarea
          rows={2}
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
          placeholder={t.giftNotePlaceholder}
          className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-xs text-primary dark:text-white focus:outline-none focus:border-primary"
        />
      </div>
    </div>
  );
};
