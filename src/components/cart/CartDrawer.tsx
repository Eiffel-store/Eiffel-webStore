import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';

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

      <div className={`fixed inset-y-0 ${isRTL ? 'left-0' : 'right-0'} max-w-full flex ${isRTL ? 'pr-10' : 'pl-10'}`}>
        <div className="w-screen max-w-md bg-surface-container-lowest dark:bg-zinc-950 shadow-2xl border-l rtl:border-l-0 rtl:border-r border-surface-container dark:border-zinc-800 flex flex-col animate-slide-right">
          {/* Drawer Header */}
          <div className="p-6 border-b border-surface-container dark:border-zinc-800 flex items-center justify-between">
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
              className="p-2 text-primary dark:text-white hover:opacity-70 transition-opacity"
              aria-label="Close bag"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-6 py-3.5 bg-surface-container-low dark:bg-zinc-900 border-b border-surface-container dark:border-zinc-800">
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

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-surface-container dark:divide-zinc-800">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 border-2 border-dashed border-surface-container dark:border-zinc-800 flex items-center justify-center mb-4">
                  <X className="w-8 h-8 text-secondary dark:text-zinc-600" />
                </div>
                <h3 className="font-editorial text-xl text-primary dark:text-white mb-2">
                  {t.emptyBagTitle}
                </h3>
                <p className="text-xs text-secondary dark:text-zinc-400 mb-6 max-w-xs font-light">
                  {t.emptyBagDesc}
                </p>
                <Link
                  to="/collections/new-arrivals"
                  onClick={closeCart}
                  className="px-6 py-3 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                >
                  {t.exploreNewArrivals}
                </Link>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  <Link
                    to={`/product/${item.product.id}`}
                    onClick={closeCart}
                    className="w-20 h-24 shrink-0 bg-surface-container-low dark:bg-zinc-900 overflow-hidden border border-surface-container dark:border-zinc-800"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          to={`/product/${item.product.id}`}
                          onClick={closeCart}
                          className="font-editorial text-lg text-primary dark:text-white hover:underline line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                          className="text-secondary hover:text-error dark:text-zinc-400 dark:hover:text-red-400 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-secondary dark:text-zinc-400 mt-0.5 font-light">
                        {t.size}: <span className="text-primary dark:text-zinc-200 font-medium">{item.selectedSize}</span> | {item.selectedColor}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-surface-container dark:border-zinc-700 bg-surface-container-lowest dark:bg-zinc-900">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                          className="p-1.5 hover:bg-surface-container-high dark:hover:bg-zinc-800 text-primary dark:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 font-mono text-xs font-bold text-primary dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                          className="p-1.5 hover:bg-surface-container-high dark:hover:bg-zinc-800 text-primary dark:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="font-mono text-sm font-bold text-primary dark:text-white">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Actions */}
          {cart.length > 0 && (
            <div className="p-6 bg-surface-container-lowest dark:bg-zinc-950 border-t border-surface-container dark:border-zinc-800 space-y-4">
              {/* Promo Code Input */}
              <div>
                {!discountCode ? (
                  <form onSubmit={handleApplyCode} className="flex gap-2">
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder={t.promoCodePlaceholder}
                      className="flex-1 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 px-3 py-2 text-xs font-mono text-primary dark:text-white uppercase placeholder:normal-case focus:outline-none focus:border-primary dark:focus:border-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-secondary text-white dark:bg-zinc-800 dark:text-zinc-200 font-label-bold text-xs tracking-wider uppercase hover:bg-primary dark:hover:bg-zinc-700 transition-colors"
                    >
                      {t.apply}
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between p-2.5 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 text-xs">
                    <span className="flex items-center gap-1.5 font-mono text-primary dark:text-white">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {t.privilegeDiscount}: <strong>{discountCode}</strong> ({(discountAmount * 100).toFixed(0)}%)
                    </span>
                    <button
                      onClick={removeDiscount}
                      className="text-error dark:text-red-400 hover:underline font-label-bold"
                    >
                      {t.remove}
                    </button>
                  </div>
                )}
                {promoMessage && (
                  <p className={`text-[11px] mt-1.5 ${promoMessage.isError ? 'text-error' : 'text-green-600 dark:text-green-400'}`}>
                    {promoMessage.text}
                  </p>
                )}
              </div>

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-secondary dark:text-zinc-400 pt-2 border-t border-surface-container/60 dark:border-zinc-800/80">
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
                <div className="flex justify-between">
                  <span>{t.estimatedShipping}</span>
                  <span className="font-mono text-primary dark:text-white font-medium">
                    {freeShippingRemaining === 0 ? t.complimentary : formatPrice(25)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-primary dark:text-white pt-2 border-t border-surface-container dark:border-zinc-800">
                  <span>{t.estimatedTotal}</span>
                  <span className="font-mono text-base">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-4 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-md"
                >
                  <span>{t.proceedToCheckout}</span>
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="block w-full py-2.5 text-center font-label-bold text-xs tracking-wider text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors uppercase"
                >
                  {t.viewFullBag}
                </Link>
              </div>

              <div className="flex items-center justify-center gap-4 text-[10px] text-secondary dark:text-zinc-500 pt-2 border-t border-surface-container/60 dark:border-zinc-800/60">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {t.encryptionNotice}
                </span>
                <span>•</span>
                <span>{t.returnsNotice}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
