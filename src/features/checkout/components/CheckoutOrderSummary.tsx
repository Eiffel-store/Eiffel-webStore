import React from 'react';
import { Sparkles, Crown, Coins, CheckCircle2 } from 'lucide-react';
import { useCurrency, useLanguage } from '@/shared';
import { CartItem } from '@/types';

interface CheckoutOrderSummaryProps {
  cart: CartItem[];
  subtotal: number;
  discountValue: number;
  shippingFee: number;
  totalAmount: number;
  availablePoints?: number;
  redeemPoints?: boolean;
  onToggleRedeemPoints?: (checked: boolean) => void;
  pointsDiscountValue?: number;
  pointsToEarn?: number;
  isVip?: boolean;
}

export const CheckoutOrderSummary: React.FC<CheckoutOrderSummaryProps> = ({
  cart = [],
  subtotal,
  discountValue,
  shippingFee,
  totalAmount,
  availablePoints = 0,
  redeemPoints = false,
  onToggleRedeemPoints,
  pointsDiscountValue = 0,
  pointsToEarn = 0,
  isVip = false,
}) => {
  const { formatPrice } = useCurrency();
  const { t, isRTL } = useLanguage();

  return (
    <div className="sticky top-28 p-6 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 space-y-6 shadow-xl rounded-xl">
      <div className="flex items-center justify-between pb-3 border-b border-surface-container dark:border-zinc-800">
        <h3 className="font-editorial text-2xl text-primary dark:text-white tracking-wider">
          {t.bagSummary} ({cart.length})
        </h3>
        {isVip && (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400 text-black flex items-center gap-1">
            <Crown className="w-3 h-3" />
            <span>VIP CLIENT</span>
          </span>
        )}
      </div>

      {/* Cart items preview */}
      <div className="max-h-64 overflow-y-auto divide-y divide-surface-container/80 dark:divide-zinc-800">
        {cart.map((item, idx) => {
          const colorObj = item?.product?.colors?.find(c => c.name.toLowerCase() === item.selectedColor.toLowerCase());
          const img = colorObj?.image || item?.product?.images?.[0] || 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop';
          return (
            <div key={idx} className="py-3 flex gap-3 items-center">
              <img
                src={img}
                alt={item?.product?.name || 'Item'}
                className="w-14 h-16 object-cover bg-zinc-950 rounded"
              />
              <div className="flex-1">
                <h4 className="font-editorial text-base text-primary dark:text-white line-clamp-1">
                  {item?.product?.name || 'Product'}
                </h4>
                <p className="text-[11px] text-secondary dark:text-zinc-400 font-mono flex items-center gap-2 flex-wrap">
                  <span>{item.selectedSize} • {item.selectedColor} (x{item.quantity})</span>
                  {item?.product?.stock !== undefined && item?.product?.stock <= 2 && (
                    <span className="text-[10px] text-amber-400 font-bold px-1.5 py-0.5 bg-amber-400/10 border border-amber-400/20 rounded font-mono">
                      {item.product.stock === 1 ? (isRTL ? '🔥 آخر قطعة' : '🔥 Last 1 left') : (isRTL ? `متبقي ${item.product.stock} فقط` : `Only ${item.product.stock} left`)}
                    </span>
                  )}
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-primary dark:text-white">
                {formatPrice((item?.product?.price || 0) * item.quantity)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Loyalty Points Redemption Box */}
      {availablePoints > 0 && onToggleRedeemPoints && (
        <div className="p-4 rounded-lg bg-zinc-950/80 border border-amber-400/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-white">
                {isRTL ? 'استبدال نقاط الولاء' : 'Redeem Loyalty Points'}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={redeemPoints}
                onChange={(e) => onToggleRedeemPoints(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
            </label>
          </div>

          <p className="text-[11px] text-zinc-400 font-mono">
            {isRTL
              ? `لديك ${availablePoints} نقطة متاحة (تعادل ${formatPrice(availablePoints)} خصم).`
              : `You have ${availablePoints} PTS available (= ${formatPrice(availablePoints)} discount).`}
          </p>

          {redeemPoints && (
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-emerald-400">
              <span>{isRTL ? 'الخصم المطبق من النقاط:' : 'Points Discount Applied:'}</span>
              <span className="font-bold">-{formatPrice(pointsDiscountValue)}</span>
            </div>
          )}
        </div>
      )}

      {/* Price Details */}
      <div className="space-y-2 text-xs text-secondary dark:text-zinc-400 pt-3 border-t border-surface-container dark:border-zinc-800">
        <div className="flex justify-between">
          <span>{t.subtotal}</span>
          <span className="font-mono text-primary dark:text-white">{formatPrice(subtotal)}</span>
        </div>
        {discountValue > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
            <span>{t.privilegeDiscount}</span>
            <span className="font-mono">-{formatPrice(discountValue)}</span>
          </div>
        )}
        {pointsDiscountValue > 0 && (
          <div className="flex justify-between text-amber-500 font-mono font-bold">
            <span>{isRTL ? 'خصم استبدال النقاط' : 'Loyalty Points Discount'}</span>
            <span>-{formatPrice(pointsDiscountValue)}</span>
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

      {/* Points To Earn On This Order */}
      <div className="p-3 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-amber-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{isRTL ? 'النقاط المكتسبة (1% من قيمة الطلب):' : 'Points to earn (1% of order):'}</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold text-amber-400">
          <span>+{pointsToEarn} PTS</span>
        </div>
      </div>

      <div className="p-3 bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-800 text-[11px] text-secondary dark:text-zinc-400 space-y-1 rounded">
        <p className="font-bold text-primary dark:text-white">🇪🇬 خدمة التوصيل المباشر داخل مصر</p>
        <p>شحن سريع إلى كافة المحافظات مع إمكانية المعاينة قبل الاستلام والدفع كاش عند الاستلام.</p>
      </div>
    </div>
  );
};
