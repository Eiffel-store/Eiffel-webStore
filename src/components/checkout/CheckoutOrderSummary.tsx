import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { CartItem } from '../../types';

interface CheckoutOrderSummaryProps {
  cart: CartItem[];
  subtotal: number;
  discountValue: number;
  shippingFee: number;
  totalAmount: number;
}

export const CheckoutOrderSummary: React.FC<CheckoutOrderSummaryProps> = ({
  cart,
  subtotal,
  discountValue,
  shippingFee,
  totalAmount,
}) => {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  return (
    <div className="sticky top-28 p-6 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 space-y-6">
      <h3 className="font-editorial text-2xl text-primary dark:text-white tracking-wider pb-3 border-b border-surface-container dark:border-zinc-800">
        {t.bagSummary} ({cart.length})
      </h3>

      <div className="max-h-72 overflow-y-auto divide-y divide-surface-container/80 dark:divide-zinc-800">
        {cart.map((item, idx) => (
          <div key={idx} className="py-3 flex gap-3 items-center">
            <img
              src={item.product.images[0]}
              alt=""
              className="w-14 h-16 object-cover bg-zinc-950"
            />
            <div className="flex-1">
              <h4 className="font-editorial text-base text-primary dark:text-white line-clamp-1">
                {item.product.name}
              </h4>
              <p className="text-[11px] text-secondary dark:text-zinc-400 font-mono">
                {item.selectedSize} • {item.selectedColor} (x{item.quantity})
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-primary dark:text-white">
              {formatPrice(item.product.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Price Details */}
      <div className="space-y-2 text-xs text-secondary dark:text-zinc-400 pt-3 border-t border-surface-container dark:border-zinc-800">
        <div className="flex justify-between">
          <span>{t.subtotal}</span>
          <span className="font-mono text-primary dark:text-white">{formatPrice(subtotal)}</span>
        </div>
        {discountValue > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>{t.privilegeDiscount}</span>
            <span className="font-mono">-{formatPrice(discountValue)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>{t.estimatedShipping}</span>
          <span className="font-mono text-primary dark:text-white">
            {shippingFee === 0 ? t.complimentary : formatPrice(shippingFee)}
          </span>
        </div>
        <div className="flex justify-between text-sm font-bold text-primary dark:text-white pt-3 border-t border-surface-container dark:border-zinc-800">
          <span>{t.estimatedTotal}</span>
          <span className="font-mono text-lg">{formatPrice(totalAmount)}</span>
        </div>
      </div>

      <div className="p-3 bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-800 text-[11px] text-secondary dark:text-zinc-400 space-y-1">
        <p className="font-bold text-primary dark:text-white">🇪🇬 خدمة التوصيل المباشر داخل مصر</p>
        <p>شحن سريع إلى كافة المحافظات مع إمكانية المعاينة قبل الاستلام والدفع كاش أو عبر إنستاباي.</p>
      </div>
    </div>
  );
};
