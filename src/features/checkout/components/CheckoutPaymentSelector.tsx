import React from 'react';
import { Banknote, CheckCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/shared';

interface CheckoutPaymentSelectorProps {
  paymentMethod?: string;
  setPaymentMethod?: (method: 'cod') => void;
  cardNumber?: string;
  setCardNumber?: (val: string) => void;
  cardExpiry?: string;
  setCardExpiry?: (val: string) => void;
  cardCvc?: string;
  setCardCvc?: (val: string) => void;
  cardName?: string;
  setCardName?: (val: string) => void;
}

export const CheckoutPaymentSelector: React.FC<CheckoutPaymentSelectorProps> = () => {
  const { isRTL } = useLanguage();

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between pb-2 border-b border-surface-container dark:border-zinc-800">
        <h3 className="font-editorial text-xl sm:text-2xl text-primary dark:text-white uppercase">
          3. {isRTL ? 'طريقة الدفع (الدفع عند الاستلام)' : '3. Payment Method (Cash on Delivery)'}
        </h3>
      </div>

      {/* Confirmed Single Cash On Delivery Method */}
      <div className="p-5 sm:p-6 bg-surface-container-low dark:bg-zinc-900 border-2 border-primary dark:border-white rounded-lg space-y-3 relative shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold shrink-0">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-editorial text-base sm:text-lg font-bold text-primary dark:text-white flex items-center gap-2">
                <span>{isRTL ? 'الدفع عند الاستلام (كاش)' : 'Cash on Delivery (COD)'}</span>
              </h4>
              <p className="text-xs font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{isRTL ? 'مفعل ومتاح لكافة محافظات جمهورية مصر العربية' : 'Active and available for all Egyptian governorates'}</span>
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 bg-white text-black dark:bg-white dark:text-black font-label-bold text-[10px] uppercase tracking-wider rounded">
            {isRTL ? 'الخيار المعتمد' : 'Selected'}
          </span>
        </div>

        <div className="pt-2 border-t border-surface-container dark:border-zinc-800 text-xs text-secondary dark:text-zinc-300 font-light leading-relaxed flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            {isRTL
              ? 'يتم دفع قيمة الطلب نقداً لمندوب الشحن عند استلام وتجربة القطعة في منزلك بكل أمان وراحة.'
              : 'Pay in cash directly to the courier upon delivery and inspecting your order at your doorstep.'}
          </span>
        </div>
      </div>
    </div>
  );
};
