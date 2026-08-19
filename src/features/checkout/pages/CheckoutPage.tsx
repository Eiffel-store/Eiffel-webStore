import React, { useState } from 'react';
import { Lock, Truck } from 'lucide-react';
import { useCart } from '@/features/cart';
import { useAuth } from '@/features/account';
import { useCurrency } from '@/shared';
import { useLanguage } from '@/shared';
import { useStoreData } from '@/shared';
import { Address } from '@/types';
import { OrderConfirmation } from '../components/OrderConfirmation';
import { CheckoutContactForm } from '../components/CheckoutContactForm';
import { CheckoutShippingSelector } from '../components/CheckoutShippingSelector';
import { CheckoutPaymentSelector } from '../components/CheckoutPaymentSelector';
import { CheckoutOrderSummary } from '../components/CheckoutOrderSummary';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, discountAmount, clearCart } = useCart();
  const { user, placeOrder } = useAuth();
  const { addOrder } = useStoreData();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any | null>(null);

  // Form state
  const [email, setEmail] = useState(user?.email || 'tarek.mansour@eiffel-client.eg');
  const [firstName, setFirstName] = useState(user?.name.split(' ')[0] || 'Tarek');
  const [lastName, setLastName] = useState(user?.name.split(' ')[1] || 'Mansour');
  const [street, setStreet] = useState(user?.addresses[0]?.street || '18 Gezira Street, Zamalek, Apt 7A');
  const [city, setCity] = useState(user?.addresses[0]?.city || 'Cairo (القاهرة)');
  const [postalCode, setPostalCode] = useState(user?.addresses[0]?.postalCode || '11211');
  const [country] = useState('Egypt');
  const [phone, setPhone] = useState(user?.phone || '+20 100 123 4567');

  // Shipping & Payment
  const [shippingMethod, setShippingMethod] = useState<'express' | 'white-glove'>('express');
  const [paymentMethod, setPaymentMethod] = useState<'cod'>('cod');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

  const discountValue = discountAmount;
  const shippingFee = shippingMethod === 'white-glove' ? 10 : 0;
  const totalAmount = Math.max(0, subtotal - discountValue + shippingFee);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const shippingAddress: Address = {
      id: `addr-${Date.now()}`,
      type: 'Home',
      firstName,
      lastName,
      street,
      city,
      state: city,
      postalCode,
      country,
      phone,
      isDefault: true,
    };

    const paymentMethodString = 'Cash on Delivery (الدفع عند الاستلام)';

    setTimeout(() => {
      const order = placeOrder({
        items: cart,
        subtotal,
        shipping: shippingFee,
        discount: discountValue,
        tax: 0,
        total: totalAmount,
        shippingAddress,
        paymentMethod: paymentMethodString,
      });
      addOrder(order);
      clearCart();
      setIsSubmitting(false);
      setOrderComplete(order);
    }, 1800);
  };

  if (orderComplete) {
    return (
      <OrderConfirmation
        order={orderComplete}
        paymentMethod={paymentMethod}
        street={street}
        city={city}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface py-12 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-surface-container dark:border-zinc-800 mb-8">
          <div>
            <span className="text-xs font-mono text-secondary dark:text-zinc-400 uppercase">
              {t.checkoutSecurityNotice}
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl text-primary dark:text-white mt-1 uppercase">
              {t.proceedToCheckout}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-secondary">
            <Lock className="w-4 h-4" />
            <span>256-BIT SECURE (EGYPT)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Checkout Form (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              <CheckoutContactForm
                email={email}
                setEmail={setEmail}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                city={city}
                setCity={setCity}
                street={street}
                setStreet={setStreet}
                phone={phone}
                setPhone={setPhone}
                postalCode={postalCode}
                setPostalCode={setPostalCode}
              />

              <CheckoutShippingSelector
                shippingMethod={shippingMethod}
                setShippingMethod={setShippingMethod}
              />

              <CheckoutPaymentSelector
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                cardExpiry={cardExpiry}
                setCardExpiry={setCardExpiry}
                cardCvc={cardCvc}
                setCardCvc={setCardCvc}
                cardName={cardName}
                setCardName={setCardName}
              />

              {/* Authorize CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{t.authenticating}</span>
                ) : (
                  <>
                    <span>{t.authorizeOrder} ({formatPrice(totalAmount)})</span>
                    <Truck className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Order Review (5 cols) */}
          <div className="lg:col-span-5">
            <CheckoutOrderSummary
              cart={cart}
              subtotal={subtotal}
              discountValue={discountValue}
              shippingFee={shippingFee}
              totalAmount={totalAmount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
