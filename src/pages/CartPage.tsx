import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, Gift, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountCode,
    discountAmount,
    applyDiscount,
    removeDiscount,
    freeShippingRemaining,
    freeShippingProgress,
    clearCart
  } = useCart();

  const { formatPrice } = useCurrency();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [giftWrap, setGiftWrap] = useState(false);
  const [orderNote, setOrderNote] = useState('');

  const discountValue = subtotal * discountAmount;
  const giftWrapFee = giftWrap ? 15 : 0;
  const shippingFee = freeShippingRemaining === 0 ? 0 : 25;
  const estimatedTotal = subtotal - discountValue + giftWrapFee + shippingFee;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode) return;
    const res = applyDiscount(inputCode);
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) setInputCode('');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface py-12 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between pb-6 border-b border-surface-container dark:border-zinc-800">
          <div>
            <span className="text-xs font-mono text-secondary dark:text-zinc-400 uppercase">
              {t.itemsReserved}
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl text-primary dark:text-white mt-1">
              {t.shoppingBag} ({cart.length})
            </h1>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-label-bold text-error hover:underline uppercase"
            >
              {t.clearAll}
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="py-24 text-center">
            <h2 className="font-editorial text-3xl text-primary dark:text-white mb-2">
              {t.emptyBagTitle}
            </h2>
            <p className="text-xs text-secondary dark:text-zinc-400 max-w-md mx-auto mb-8 font-light">
              {t.emptyBagDesc}
            </p>
            <Link
              to="/collections/men"
              className="px-8 py-4 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors"
            >
              {t.exploreCollection}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
            {/* Items Table (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Shipping Progress */}
              <div className="p-4 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="flex items-center gap-2 font-label-bold text-primary dark:text-white uppercase tracking-wider">
                    <Truck className="w-4 h-4" />
                    {freeShippingRemaining === 0 ? (
                      <span className="text-green-600 dark:text-green-400 font-bold">
                        {t.freeShippingUnlocked}
                      </span>
                    ) : (
                      <span>
                        {t.addForFreeShipping}: <strong className="font-mono">{formatPrice(freeShippingRemaining)}</strong>
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-xs text-secondary">{freeShippingProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container dark:bg-zinc-800">
                  <div
                    className="h-full bg-primary dark:bg-white transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-surface-container dark:divide-zinc-800 border-y border-surface-container dark:border-zinc-800">
                {cart.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
                    className="py-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
                  >
                    <div className="flex gap-4">
                      <Link
                        to={`/product/${item.product.id}`}
                        className="w-24 h-28 shrink-0 bg-surface-container-low dark:bg-zinc-900 overflow-hidden border border-surface-container dark:border-zinc-800"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      <div className="space-y-1">
                        <span className="text-[10px] font-label-bold text-secondary dark:text-zinc-400 uppercase">
                          {item.product.subCategory}
                        </span>
                        <Link
                          to={`/product/${item.product.id}`}
                          className="font-editorial text-xl text-primary dark:text-white hover:underline block"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-secondary dark:text-zinc-400 font-light">
                          {t.colorway} <strong className="text-primary dark:text-white font-medium">{item.selectedColor}</strong> | {t.size}: <strong className="text-primary dark:text-white font-medium">{item.selectedSize}</strong>
                        </p>
                        <div className="font-mono text-sm font-bold text-primary dark:text-white pt-1">
                          {formatPrice(item.product.price)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-surface-container dark:border-zinc-700 bg-surface-container-lowest dark:bg-zinc-900">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                          className="px-3 py-2 hover:bg-surface-container-high dark:hover:bg-zinc-800 text-primary dark:text-white transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-4 font-mono text-xs font-bold text-primary dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                          className="px-3 py-2 hover:bg-surface-container-high dark:hover:bg-zinc-800 text-primary dark:text-white transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total For Item */}
                      <div className="font-mono text-base font-bold text-primary dark:text-white">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                        className="text-secondary hover:text-error dark:hover:text-red-400 p-2 transition-colors"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gift Wrap & Special Instructions Accordion */}
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
                    placeholder={isRTL ? "ملاحظات إضافية للمندوب أو الأتيليه..." : "e.g. Please leave package with concierge; custom gift note text..."}
                    className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-xs text-primary dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Summary Panel (4 cols) */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 p-6 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 space-y-6">
                <h3 className="font-editorial text-2xl text-primary dark:text-white tracking-wider pb-3 border-b border-surface-container dark:border-zinc-800">
                  {t.bagSummary}
                </h3>

                {/* Promo Code Form */}
                <div>
                  {!discountCode ? (
                    <form onSubmit={handleApply} className="flex gap-2">
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
                        {t.privilegeDiscount}: <strong>{discountCode}</strong> ({(discountAmount * 100).toFixed(0)}%)
                      </span>
                      <button onClick={removeDiscount} className="text-error font-label-bold hover:underline">
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
                      {shippingFee === 0 ? t.complimentary : formatPrice(25)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-primary dark:text-white pt-3 border-t border-surface-container dark:border-zinc-800">
                    <span>{t.estimatedTotal}</span>
                    <span className="font-mono text-lg">{formatPrice(estimatedTotal)}</span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-lg"
                >
                  <span>{t.proceedToCheckout}</span>
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>

                <div className="flex items-center justify-center gap-4 text-[10px] text-secondary dark:text-zinc-500 pt-3 border-t border-surface-container dark:border-zinc-800">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> {t.encryptionNotice}
                  </span>
                  <span>•</span>
                  <span>{t.taxesIncludedNotice}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
