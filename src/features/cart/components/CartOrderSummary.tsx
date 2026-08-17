import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useCurrency } from '@/shared';
import { useLanguage } from '@/shared';

interface CartOrderSummaryProps {
  subtotal: number;
  discountValue: number;
  discountCode: string | null;
  discountPercentage?: number;
  discountAmount: number;
  giftWrap: boolean;
  shippingFee: number;
  estimatedTotal: number;
  inputCode: string;
  setInputCode: (code: string) => void;
  promoMessage: { text: string; isError: boolean } | null;
  onApplyPromo: (e: React.FormEvent) => void;
  onRemoveDiscount: () => void;
  onProceedToCheckout: () => void;
}

export const CartOrderSummary: React.FC<CartOrderSummaryProps> = ({
  subtotal,
  discountValue,
  discountCode,
  discountPercentage = 0,
  giftWrap,
  shippingFee,
  estimatedTotal,
  inputCode,
  setInputCode,
  promoMessage,
  onApplyPromo,
  onRemoveDiscount,
  onProceedToCheckout,
}) => {
  const { formatPrice } = useCurrency();
  const { t, isRTL } = useLanguage();

  return (
    <div className="sticky top-28 p-6 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 space-y-6">
      <h3 className="font-editorial text-2xl text-primary dark:text-white tracking-wider pb-3 border-b border-surface-container dark:border-zinc-800">
        {t.bagSummary}
      </h3>

      {/* Promo Code Form */}
      <div>
        {!discountCode ? (
          <form onSubmit={onApplyPromo} className="flex gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder={t.promoCodePlaceholder}
              className="flex-1 bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 px-3 py-2 text-xs font-mono uppercase text-primary dark:text-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-wider uppercase hover:bg-neutral-800 transition-colors"
            >
              {t.apply}
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between p-2.5 bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-800 text-xs">
            <span className="flex items-center gap-1.5 font-mono text-primary dark:text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {t.privilegeDiscount}: <strong>{discountCode}</strong> ({discountPercentage > 0 ? `${discountPercentage}%` : ''})
            </span>
            <button onClick={onRemoveDiscount} className="text-error font-label-bold hover:underline">
              {t.remove}
            </button>
          </div>
        )}
        {promoMessage && (
          <p className={`text-[11px] mt-1.5 ${promoMessage.isError ? 'text-error' : 'text-green-600'}`}>
            {promoMessage.text}
          </p>
        )}
      </div>

      {/* Costs Breakdown */}
      <div className="space-y-2.5 text-xs text-secondary dark:text-zinc-400 pt-3 border-t border-surface-container dark:border-zinc-800">
        <div className="flex justify-between">
          <span>{t.subtotal}</span>
          <span className="font-mono text-primary dark:text-white font-medium">{formatPrice(subtotal)}</span>
        </div>
        {discountValue > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>{t.privilegeDiscount}</span>
            <span className="font-mono">-{formatPrice(discountValue)}</span>
          </div>
        )}
        {giftWrap && (
          <div className="flex justify-between">
            <span>{t.giftBoxAdd}</span>
            <span className="font-mono text-primary dark:text-white">{formatPrice(15)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>{t.estimatedShipping}</span>
          <span className="font-mono text-primary dark:text-white font-medium">
            {shippingFee === 0 ? t.complimentary : formatPrice(shippingFee)}
          </span>
        </div>
        <div className="flex justify-between text-sm font-bold text-primary dark:text-white pt-3 border-t border-surface-container dark:border-zinc-800">
          <span>{t.estimatedTotal}</span>
          <span className="font-mono text-lg">{formatPrice(estimatedTotal)}</span>
        </div>
      </div>

      {/* Checkout Trigger */}
      <button
        onClick={onProceedToCheckout}
        className="w-full py-4 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-lg"
      >
        <span>{t.proceedToCheckout}</span>
        <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};
