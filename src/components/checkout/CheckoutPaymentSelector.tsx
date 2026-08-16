import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface CheckoutPaymentSelectorProps {
  paymentMethod: 'instapay' | 'card' | 'cod';
  setPaymentMethod: (method: 'instapay' | 'card' | 'cod') => void;
  cardNumber: string;
  setCardNumber: (val: string) => void;
  cardExpiry: string;
  setCardExpiry: (val: string) => void;
  cardCvc: string;
  setCardCvc: (val: string) => void;
  cardName: string;
  setCardName: (val: string) => void;
}

export const CheckoutPaymentSelector: React.FC<CheckoutPaymentSelectorProps> = ({
  paymentMethod,
  setPaymentMethod,
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
  cardCvc,
  setCardCvc,
  cardName,
  setCardName,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between pb-2 border-b border-surface-container dark:border-zinc-800">
        <h3 className="font-editorial text-xl sm:text-2xl text-primary dark:text-white uppercase">
          3. {t.stepPayment}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        <button
          type="button"
          onClick={() => setPaymentMethod('instapay')}
          className={`py-3 px-3 text-xs font-label-bold uppercase border transition-all text-center flex items-center justify-center gap-1.5 ${
            paymentMethod === 'instapay'
              ? 'border-primary dark:border-white bg-surface-container-high dark:bg-zinc-800 text-primary dark:text-white shadow-sm'
              : 'border-surface-container dark:border-zinc-800 text-secondary hover:border-primary'
          }`}
        >
          <span>⚡</span>
          <span>INSTAPAY (إنستاباي)</span>
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod('cod')}
          className={`py-3 px-3 text-xs font-label-bold uppercase border transition-all text-center ${
            paymentMethod === 'cod'
              ? 'border-primary dark:border-white bg-surface-container-high dark:bg-zinc-800 text-primary dark:text-white shadow-sm'
              : 'border-surface-container dark:border-zinc-800 text-secondary hover:border-primary'
          }`}
        >
          {t.paymentCOD}
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod('card')}
          className={`py-3 px-3 text-xs font-label-bold uppercase border transition-all text-center ${
            paymentMethod === 'card'
              ? 'border-primary dark:border-white bg-surface-container-high dark:bg-zinc-800 text-primary dark:text-white shadow-sm'
              : 'border-surface-container dark:border-zinc-800 text-secondary hover:border-primary'
          }`}
        >
          {t.paymentCreditCard}
        </button>
      </div>

      {paymentMethod === 'instapay' && (
        <div className="p-4 sm:p-6 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
              ⚡
            </div>
            <div>
              <h4 className="font-editorial text-base sm:text-lg text-primary dark:text-white">
                التحويل الفوري عبر إنستاباي (InstaPay Egypt)
              </h4>
              <p className="text-xs font-mono text-secondary dark:text-zinc-400">
                InstaPay IPA: <strong className="text-primary dark:text-white">eiffel.egypt@instapay</strong>
              </p>
            </div>
          </div>
          <p className="text-xs text-secondary dark:text-zinc-300 font-light leading-relaxed">
            عند النقر على تأكيد الطلب، سيتم حجز القطعة فوراً وإرسال رابط وبوليصة الشحن، ويمكنك تحويل القيمة عبر تطبيق إنستاباي بسهولة أو عند استلام المندوب.
          </p>
        </div>
      )}

      {paymentMethod === 'cod' && (
        <div className="p-4 sm:p-6 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 space-y-2">
          <h4 className="font-editorial text-base sm:text-lg text-primary dark:text-white">
            الدفع عند الاستلام (Cash on Delivery)
          </h4>
          <p className="text-xs text-secondary dark:text-zinc-300 font-light">
            ادفع نقداً أو عبر بطاقتك الائتمانية أو إنستاباي لمندوب التوصيل عند استلام وتجربة القطعة في منزلك.
          </p>
        </div>
      )}

      {paymentMethod === 'card' && (
        <div className="p-4 sm:p-6 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 space-y-4">
          <div>
            <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
              {t.cardNumberLabel}
            </label>
            <input
              type="text"
              required
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-sm font-mono text-primary dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
                {t.cardExpiryLabel}
              </label>
              <input
                type="text"
                required
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-sm font-mono text-primary dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
                {t.cardCvcLabel}
              </label>
              <input
                type="password"
                maxLength={4}
                required
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value)}
                className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-sm font-mono text-primary dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
              {t.cardNameLabel}
            </label>
            <input
              type="text"
              required
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-sm font-mono text-primary dark:text-white uppercase focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};
