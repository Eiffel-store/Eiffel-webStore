import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency, useLanguage } from '@/shared';

export const CartDrawer: React.FC = () => {
  const {
    cart = [],
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems,
    discountCode,
    discountAmount,
    applyDiscount,
    removeDiscount,
    freeShippingRemaining,
    freeShippingProgress
  } = useCart();

  const { formatPrice } = useCurrency();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = await applyDiscount(couponInput.trim());
    setCouponMsg(res);
    if (res.success) setCouponInput('');
  };

  const handleProceedToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 rtl:right-auto rtl:left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white dark:bg-zinc-950 shadow-2xl flex flex-col justify-between border-l rtl:border-l-0 rtl:border-r border-surface-container dark:border-zinc-800 animate-slide-left">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-surface-container dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary dark:text-white" />
              <h2 className="font-editorial text-xl font-bold text-primary dark:text-white">
                {t.shoppingBag} ({totalItems})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Shipping Progress */}
          <div className="px-4 sm:px-6 py-3 bg-surface-container-low dark:bg-zinc-900 border-b border-surface-container dark:border-zinc-800 text-xs">
            <div className="flex justify-between font-mono mb-1.5">
              <span className="text-secondary dark:text-zinc-400">
                {freeShippingRemaining === 0
                  ? (isRTL ? 'تهانينا! حصلت على شحن مجاني لكافة محافظات مصر' : 'Complimentary shipping unlocked across Egypt!')
                  : (isRTL ? `أضف ${formatPrice(freeShippingRemaining)} للحصول على شحن مجاني` : `Add ${formatPrice(freeShippingRemaining)} for free shipping`)}
              </span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 overflow-hidden">
              <div
                className="bg-primary dark:bg-white h-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-surface-container dark:divide-zinc-800">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 text-secondary dark:text-zinc-400">
                <ShoppingBag className="w-12 h-12 stroke-1 mb-3 opacity-40" />
                <p className="text-sm font-light">{isRTL ? 'حقيبة التسوق فارغة' : 'Your shopping bag is empty'}</p>
              </div>
            ) : (
              cart.map((item, idx) => {
                const prod = item?.product;
                const colorObj = prod?.colors?.find(c => c.name.toLowerCase() === item.selectedColor.toLowerCase());
                const prodImg = colorObj?.image || prod?.images?.[0] || 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop';
                return (
                  <div key={idx} className="py-4 flex gap-3 sm:gap-4 items-center">
                    <img
                      src={prodImg}
                      alt={prod?.name || 'Item'}
                      className="w-16 h-20 sm:w-18 sm:h-24 object-cover bg-zinc-900 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-editorial text-sm font-bold text-primary dark:text-white truncate">
                        {prod?.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                        {item.selectedColor} / {item.selectedSize}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-primary dark:text-white">
                          {formatPrice(prod?.price || 0)}
                        </span>
                        <div className="flex items-center border border-zinc-700">
                          <button
                            onClick={() => prod && updateQuantity(prod.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                            className="px-2 py-0.5 text-zinc-400 hover:text-white text-xs"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-mono text-white">{item.quantity}</span>
                          <button
                            onClick={() => prod && updateQuantity(prod.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                            className="px-2 py-0.5 text-zinc-400 hover:text-white text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => prod && removeFromCart(prod.id, item.selectedSize, item.selectedColor)}
                      className="text-zinc-500 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 bg-surface-container-low dark:bg-zinc-900 border-t border-surface-container dark:border-zinc-800 space-y-4">
              {/* Quick Coupon Input */}
              <div className="pb-2 border-b border-surface-container dark:border-zinc-800">
                {!discountCode ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder={t.promoCodePlaceholder}
                      className="flex-1 bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 px-2.5 py-1.5 text-xs font-mono uppercase text-primary dark:text-white focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs uppercase hover:bg-neutral-800 transition-colors"
                    >
                      {t.apply}
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-500">
                    <span>{t.privilegeDiscount}: {discountCode}</span>
                    <button onClick={removeDiscount} className="text-red-500 hover:underline text-[11px]">
                      {t.remove}
                    </button>
                  </div>
                )}
                {couponMsg && (
                  <p className={`text-[10px] mt-1 ${couponMsg.success ? 'text-emerald-500' : 'text-red-500'}`}>
                    {couponMsg.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-secondary dark:text-zinc-400">
                  <span>{t.subtotal}</span>
                  <span className="font-mono">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-500">
                    <span>{t.privilegeDiscount || 'الخصم'} ({discountCode})</span>
                    <span className="font-mono">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-primary dark:text-white pt-2 border-t border-surface-container dark:border-zinc-800">
                  <span>{t.estimatedTotal || 'الإجمالي'}</span>
                  <span className="font-mono">{formatPrice(Math.max(0, subtotal - discountAmount))}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 sm:py-4 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors shadow-lg"
                >
                  <span>{t.proceedToCheckout}</span>
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="w-full py-2.5 text-center text-xs font-label-bold text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white uppercase tracking-wider"
                >
                  {t.shoppingBag}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
