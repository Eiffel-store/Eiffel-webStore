import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/features/cart';
import { useLanguage } from '@/shared';
import { CartFreeShippingBar } from '../components/CartFreeShippingBar';
import { CartItemRow } from '../components/CartItemRow';
import { CartGiftWrap } from '../components/CartGiftWrap';
import { CartOrderSummary } from '../components/CartOrderSummary';

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

  const { t } = useLanguage();
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
        {/* Header */}
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
            {/* Items Column (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Shipping Progress */}
              <CartFreeShippingBar
                freeShippingRemaining={freeShippingRemaining}
                freeShippingProgress={freeShippingProgress}
              />

              {/* Items List */}
              <div className="divide-y divide-surface-container dark:divide-zinc-800 border-y border-surface-container dark:border-zinc-800">
                {cart.map((item, idx) => (
                  <CartItemRow
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
                    item={item}
                    onUpdateQuantity={(qty) => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, qty)}
                    onRemove={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                  />
                ))}
              </div>

              {/* Gift Wrap & Special Instructions */}
              <CartGiftWrap
                giftWrap={giftWrap}
                setGiftWrap={setGiftWrap}
                orderNote={orderNote}
                setOrderNote={setOrderNote}
              />
            </div>

            {/* Summary Panel (4 cols) */}
            <div className="lg:col-span-4">
              <CartOrderSummary
                subtotal={subtotal}
                discountValue={discountValue}
                discountCode={discountCode}
                discountAmount={discountAmount}
                giftWrap={giftWrap}
                shippingFee={shippingFee}
                estimatedTotal={estimatedTotal}
                inputCode={inputCode}
                setInputCode={setInputCode}
                promoMessage={promoMessage}
                onApplyPromo={handleApply}
                onRemoveDiscount={removeDiscount}
                onProceedToCheckout={() => navigate('/checkout')}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
