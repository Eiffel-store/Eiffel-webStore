import React from 'react';
import { Banknote, Coins, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { useCurrency, useLanguage } from '@/shared';

interface CheckoutPaymentSelectorProps {
  paymentMethod: 'cod' | 'points';
  setPaymentMethod: (method: 'cod' | 'points') => void;
  availablePoints?: number;
  totalBeforePoints?: number;
  pointsDiscountValue?: number;
}

export const CheckoutPaymentSelector: React.FC<CheckoutPaymentSelectorProps> = ({
  paymentMethod = 'cod',
  setPaymentMethod,
  availablePoints = 0,
  totalBeforePoints = 0,
  pointsDiscountValue = 0,
}) => {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  const hasPoints = availablePoints > 0;
  const isFullPointsCoverage = availablePoints >= totalBeforePoints && totalBeforePoints > 0;
  const remainingCash = Math.max(0, totalBeforePoints - availablePoints);

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between pb-2 border-b border-surface-container dark:border-zinc-800">
        <h3 className="font-editorial text-xl sm:text-2xl text-primary dark:text-white uppercase">
          3. {t.paymentMethodTitle}
        </h3>
        <span className="text-xs font-mono text-secondary dark:text-zinc-400">
          {t.selectPaymentOption}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option 1: Cash On Delivery */}
        <div
          onClick={() => setPaymentMethod('cod')}
          className={`p-5 rounded-xl border-2 transition-all cursor-pointer relative space-y-3 ${
            paymentMethod === 'cod'
              ? 'bg-surface-container-low dark:bg-zinc-900 border-primary dark:border-white shadow-lg'
              : 'bg-surface-container-lowest dark:bg-zinc-950 border-surface-container dark:border-zinc-800 hover:border-zinc-600 opacity-80'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 transition-colors ${
                  paymentMethod === 'cod'
                    ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-editorial text-base font-bold text-primary dark:text-white flex items-center gap-2">
                  <span>{t.cashOnDelivery}</span>
                </h4>
                <p className="text-[11px] font-mono text-emerald-500 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.availableAcrossEgypt}</span>
                </p>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                paymentMethod === 'cod'
                  ? 'border-primary dark:border-white bg-primary dark:bg-white text-white dark:text-black'
                  : 'border-zinc-600'
              }`}
            >
              {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-white dark:bg-black" />}
            </div>
          </div>

          <div className="pt-2 border-t border-surface-container dark:border-zinc-800/80 text-xs text-secondary dark:text-zinc-400 font-light leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              {t.codDescription}
            </span>
          </div>
        </div>

        {/* Option 2: Pay with Loyalty Points */}
        <div
          onClick={() => {
            if (hasPoints) {
              setPaymentMethod('points');
            }
          }}
          className={`p-5 rounded-xl border-2 transition-all relative space-y-3 ${
            !hasPoints
              ? 'opacity-50 cursor-not-allowed bg-zinc-950/40 border-zinc-800'
              : paymentMethod === 'points'
              ? 'bg-amber-950/20 dark:bg-amber-950/30 border-amber-400 shadow-lg shadow-amber-500/10 cursor-pointer'
              : 'bg-surface-container-lowest dark:bg-zinc-950 border-surface-container dark:border-zinc-800 hover:border-amber-400/50 cursor-pointer'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 transition-colors ${
                  paymentMethod === 'points'
                    ? 'bg-amber-400 text-black shadow-md'
                    : hasPoints
                    ? 'bg-amber-400/20 text-amber-400 border border-amber-400/40'
                    : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-editorial text-base font-bold text-primary dark:text-white">
                    {t.payWithPoints}
                  </h4>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-amber-400/20 text-amber-400 border border-amber-400/30">
                    {availablePoints} PTS
                  </span>
                </div>
                <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                  {hasPoints
                    ? `${formatPrice(availablePoints)} ${t.availablePointsDiscount}`
                    : t.insufficientPoints}
                </p>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                paymentMethod === 'points'
                  ? 'border-amber-400 bg-amber-400 text-black'
                  : 'border-zinc-600'
              }`}
            >
              {paymentMethod === 'points' && <div className="w-2 h-2 rounded-full bg-black" />}
            </div>
          </div>

          <div className="pt-2 border-t border-surface-container dark:border-zinc-800/80 text-xs font-mono leading-relaxed">
            {paymentMethod === 'points' ? (
              <div className="space-y-1 text-amber-300">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {isFullPointsCoverage
                      ? t.fullPointsCoverage
                      : `${formatPrice(pointsDiscountValue || availablePoints)} + ${formatPrice(remainingCash)} COD`}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-secondary dark:text-zinc-400 font-light font-sans">
                {hasPoints
                  ? t.pointsRedeemDesc
                  : t.pointsEarnDesc}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
