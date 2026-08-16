import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ArrowRight, Truck, Sparkles } from 'lucide-react';
import { useCart } from '@/features/cart';
import { useCurrency } from '@/shared';
import { useLanguage } from '@/shared';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
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

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const discountValue = subtotal * discountAmount;
  const finalTotal = subtotal - discountValue;

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode) return;
    const res = applyDiscount(inputCode);
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) setInputCode('');
  };

  const handleProceedToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className={`fixed inset-y-0 ${isRTL ? 'left-0' : 'right-0'} max-w-full flex pl-0 sm:pl-10 rtl:pr-0 rtl:sm:pr-10`}>
        <div className="w-screen max-w-full sm:max-w-md bg-surface-container-lowest dark:bg-zinc-950 shadow-2xl border-l rtl:border-l-0 rtl:border-r border-surface-container dark:border-zinc-800 flex flex-col animate-slide-right">
          {/* Drawer Header */}
          <div className="p-4 sm:p-6 border-b border-surface-container dark:border-zinc-800 flex items-center justify-between">
            <div>
              <h2 className="font-editorial text-2xl tracking-wider text-primary dark:text-white">
                {t.shoppingBag}
              </h2>
              <p className="text-xs text-secondary dark:text-zinc-400 font-mono mt-0.5">
                {cart.length} {t.itemsReserved}
              </p>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-primary dark:text-white hover:opacity-70 transition-opacity"
              aria-label="Close bag"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-4 sm:px-6 py-3 bg-surface-container-low dark:bg-zinc-900 border-b border-surface-container dark:border-zinc-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 font-label-bold tracking-wider text-primary dark:text-zinc-200">
                <Truck className="w-3.5 h-3.5" />
                {freeShippingRemaining === 0 ? (
                  <span className="text-green-600 dark:text-green-400 font-bold">{t.freeShippingUnlocked}</span>
                ) : (
                  <span>
                    {t.addForFreeShipping}: <strong className="font-mono">{formatPrice(freeShippingRemaining)}</strong>
                  </span>
                )}
              </span>
              <span className="font-mono text-[11px] text-secondary dark:text-zinc-400">
                {freeShippingProgress}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-surface-container dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-primary dark:bg-white transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-surface-container/60 dark:divide-zinc-800">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <p className="font-editorial text-2xl text-primary dark:text-white">{t.emptyBagTitle}</p>
                <p className="text-xs text-secondary max-w-xs font-light">{t.emptyBagDesc}</p>
                <button
                  onClick={closeCart}
                  className="px-6 py-3 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors"
                >
                  {t.exploreCollection}
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`} className="py-4 flex gap-3 sm:gap-4 items-center">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-20 object-cover bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-editorial text-base text-primary dark:text-white truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-secondary dark:text-zinc-400 font-mono mt-0.5">
                      {item.selectedSize} • {item.selectedColor}
                    </p>
                    <div className="font-mono text-xs font-bold text-primary dark:text-white mt-1">
                      {formatPrice(item.product.price)}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                      className="text-secondary hover:text-error p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center border border-surface-container dark:border-zinc-700 bg-surface-container-lowest dark:bg-zinc-900">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                        className="px-2 py-1 text-xs hover:bg-surface-container-high dark:hover:bg-zinc-800 text-primary dark:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-mono text-xs font-bold text-primary dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                        className="px-2 py-1 text-xs hover:bg-surface-container-high dark:hover:bg-zinc-800 text-primary dark:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-surface-container dark:border-zinc-800 bg-surface-container-lowest dark:bg-zinc-950 space-y-4">
              {/* Promo code */}
              <div>
                {!discountCode ? (
                  <form onSubmit={handleApplyCode} className="flex gap-2">
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder={t.promoCodePlaceholder}
                      className="flex-1 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 px-3 py-2 text-xs font-mono uppercase text-primary dark:text-white focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs uppercase"
                    >
                      {t.apply}
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between p-2 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 text-xs">
                    <span className="flex items-center gap-1.5 font-mono text-primary dark:text-white">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {discountCode} ({(discountAmount * 100).toFixed(0)}%)
                    </span>
                    <button onClick={removeDiscount} className="text-error font-label-bold hover:underline">
                      {t.remove}
                    </button>
                  </div>
                )}
                {promoMessage && (
                  <p className={`text-[10px] mt-1 ${promoMessage.isError ? 'text-error' : 'text-green-600'}`}>
                    {promoMessage.text}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-1.5 text-xs text-secondary dark:text-zinc-400">
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
                <div className="flex justify-between text-sm font-bold text-primary dark:text-white pt-2 border-t border-surface-container dark:border-zinc-800">
                  <span>{t.estimatedTotal}</span>
                  <span className="font-mono text-base">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
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
