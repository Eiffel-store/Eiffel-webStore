import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Lock, CheckCircle2, QrCode, Smartphone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { Address } from '../types';

const EGYPTIAN_GOVERNORATES = [
  'Cairo (القاهرة)',
  'Giza (الجيزة)',
  'Alexandria (الإسكندرية)',
  'New Cairo (التجمع الخامس)',
  'Sheikh Zayed & 6th October (الشيخ زايد وأكتوبر)',
  'Red Sea & El Gouna (البحر الأحمر والجونة)',
  'South Sinai & Sharm (جنوب سيناء وشرم الشيخ)',
  'Qalyubia (القليوبية)',
  'Dakahlia / Mansoura (الدقهلية والمنصورة)',
  'Sharqia (الشرقية)',
  'Gharbia / Tanta (الغربية وطنطا)',
  'Port Said (بورسعيد)',
  'Suez (السويس)',
  'Ismailia (الإسماعيلية)',
  'Assiut & Upper Egypt (أسيوط والصعيد)'
];

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, discountAmount, clearCart } = useCart();
  const { user, placeOrder } = useAuth();
  const { formatPrice } = useCurrency();
  const { t, isRTL } = useLanguage();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any | null>(null);

  // Egyptian Form state
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
  const [paymentMethod, setPaymentMethod] = useState<'instapay' | 'card' | 'cod'>('instapay');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvc, setCardCvc] = useState('842');
  const [cardName, setCardName] = useState('TAREK MANSOUR');

  const discountValue = subtotal * discountAmount;
  const shippingFee = shippingMethod === 'white-glove' ? 10 : 0; // 10 USD = 500 EGP
  const totalAmount = subtotal - discountValue + shippingFee;

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
      isDefault: true
    };

    let paymentMethodString = 'InstaPay (@eiffel.egypt)';
    if (paymentMethod === 'card') {
      paymentMethodString = 'Credit Card / Meeza (ending in 4242)';
    } else if (paymentMethod === 'cod') {
      paymentMethodString = 'Cash on Delivery (الدفع عند الاستلام)';
    }

    setTimeout(() => {
      const order = placeOrder({
        items: cart,
        subtotal,
        shipping: shippingFee,
        discount: discountValue,
        tax: 0,
        total: totalAmount,
        shippingAddress,
        paymentMethod: paymentMethodString
      });
      clearCart();
      setIsSubmitting(false);
      setOrderComplete(order);
    }, 1800);
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background text-on-surface py-16 px-4 sm:px-8 md:px-12 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-surface-container-lowest dark:bg-zinc-950 p-8 sm:p-12 border border-surface-container dark:border-zinc-800 shadow-2xl space-y-8 animate-fade-in text-center">
          <div className="w-16 h-16 rounded-full bg-primary text-white dark:bg-white dark:text-black mx-auto flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono text-secondary dark:text-zinc-400 uppercase tracking-widest">
              {t.acquisitionConfirmed}
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl text-primary dark:text-white mt-1">
              {t.orderThankYou}
            </h1>
            <p className="text-xs sm:text-sm text-secondary dark:text-zinc-400 mt-2 font-light max-w-md mx-auto">
              {t.receiptNotice}
            </p>
          </div>

          <div className="p-6 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 text-xs font-mono text-left rtl:text-right space-y-2.5">
            <div className="flex justify-between">
              <span className="text-secondary">{t.orderRef}</span>
              <strong className="text-primary dark:text-white">{orderComplete.id}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">{t.estimatedDelivery}</span>
              <span className="text-primary dark:text-white">{orderComplete.estimatedDelivery}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">{t.trackingId}</span>
              <span className="text-primary dark:text-white font-bold">{orderComplete.trackingNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">{t.totalCharged}</span>
              <span className="text-primary dark:text-white font-bold">{formatPrice(orderComplete.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">طريقة الدفع:</span>
              <span className="text-primary dark:text-white font-bold">{orderComplete.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">{t.destination}</span>
              <span className="text-primary dark:text-white truncate max-w-xs">{street}, {city}</span>
            </div>
          </div>

          {paymentMethod === 'instapay' && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-mono text-left rtl:text-right space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" />
                <span>تعليمات التحويل عبر إنستاباي (InstaPay):</span>
              </p>
              <p>يرجى إرسال المبلغ الإجمالي ({formatPrice(orderComplete.total)}) إلى الحساب الموثق: <strong>eiffel.egypt@instapay</strong> واذكر رقم الطلب <strong>{orderComplete.id}</strong> في الملاحظات.</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link
              to="/account"
              className="flex-1 py-4 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors"
            >
              {t.viewInClientPortal}
            </Link>
            <Link
              to="/collections/men"
              className="flex-1 py-4 border border-surface-container dark:border-zinc-800 text-xs font-label-bold tracking-widest uppercase hover:bg-surface-container-high"
            >
              {t.continueShopping}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface py-12 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto">
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
              {/* Step 1: Contact & Delivery */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container dark:border-zinc-800">
                  <h3 className="font-editorial text-2xl text-primary dark:text-white uppercase">
                    1. {t.stepContact} & {t.stepDelivery}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
                      {t.emailLabel}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-xs text-primary dark:text-white font-mono focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
                      {t.firstNameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-xs text-primary dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
                      {t.lastNameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-xs text-primary dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
                      {t.cityLabel}
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-xs text-primary dark:text-white focus:outline-none"
                    >
                      {EGYPTIAN_GOVERNORATES.map((gov) => (
                        <option key={gov} value={gov}>{gov}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
                      {t.streetLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="e.g. 18 Gezira St, Zamalek, Building 4, Apt 7"
                      className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-xs text-primary dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
                      {t.phoneLabel}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+20 100 123 4567"
                      className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-xs font-mono text-primary dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
                      {t.postalCodeLabel}
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-xs font-mono text-primary dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Method */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container dark:border-zinc-800">
                  <h3 className="font-editorial text-2xl text-primary dark:text-white uppercase">
                    2. {t.stepShipping}
                  </h3>
                </div>

                <div className="space-y-3">
                  <label
                    onClick={() => setShippingMethod('express')}
                    className={`flex items-start justify-between p-4 border cursor-pointer transition-all ${
                      shippingMethod === 'express'
                        ? 'border-primary dark:border-white bg-surface-container-low dark:bg-zinc-900'
                        : 'border-surface-container dark:border-zinc-800 hover:border-secondary'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="mt-1 text-primary focus:ring-0"
                      />
                      <div>
                        <h4 className="font-label-bold text-xs uppercase tracking-wider text-primary dark:text-white">
                          {t.shippingPriorityTitle}
                        </h4>
                        <p className="text-xs text-secondary dark:text-zinc-400 mt-0.5 font-light">
                          {t.shippingPriorityDesc}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-green-600 dark:text-green-400">
                      {t.complimentary}
                    </span>
                  </label>

                  <label
                    onClick={() => setShippingMethod('white-glove')}
                    className={`flex items-start justify-between p-4 border cursor-pointer transition-all ${
                      shippingMethod === 'white-glove'
                        ? 'border-primary dark:border-white bg-surface-container-low dark:bg-zinc-900'
                        : 'border-surface-container dark:border-zinc-800 hover:border-secondary'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === 'white-glove'}
                        onChange={() => setShippingMethod('white-glove')}
                        className="mt-1 text-primary focus:ring-0"
                      />
                      <div>
                        <h4 className="font-label-bold text-xs uppercase tracking-wider text-primary dark:text-white">
                          {t.shippingWhiteGloveTitle}
                        </h4>
                        <p className="text-xs text-secondary dark:text-zinc-400 mt-0.5 font-light">
                          {t.shippingWhiteGloveDesc}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-primary dark:text-white">
                      +{formatPrice(10)}
                    </span>
                  </label>
                </div>
              </div>

              {/* Step 3: Payment */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container dark:border-zinc-800">
                  <h3 className="font-editorial text-2xl text-primary dark:text-white uppercase">
                    3. {t.stepPayment}
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('instapay')}
                    className={`py-3 px-2 text-xs font-label-bold uppercase border transition-all text-center ${
                      paymentMethod === 'instapay'
                        ? 'border-primary dark:border-white bg-surface-container-high dark:bg-zinc-800 text-primary dark:text-white'
                        : 'border-surface-container dark:border-zinc-800 text-secondary'
                    }`}
                  >
                    ⚡ INSTAPAY (إنستاباي)
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-3 px-2 text-xs font-label-bold uppercase border transition-all text-center ${
                      paymentMethod === 'cod'
                        ? 'border-primary dark:border-white bg-surface-container-high dark:bg-zinc-800 text-primary dark:text-white'
                        : 'border-surface-container dark:border-zinc-800 text-secondary'
                    }`}
                  >
                    {t.paymentCOD}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-3 px-2 text-xs font-label-bold uppercase border transition-all text-center ${
                      paymentMethod === 'card'
                        ? 'border-primary dark:border-white bg-surface-container-high dark:bg-zinc-800 text-primary dark:text-white'
                        : 'border-surface-container dark:border-zinc-800 text-secondary'
                    }`}
                  >
                    {t.paymentCreditCard}
                  </button>
                </div>

                {paymentMethod === 'instapay' && (
                  <div className="p-6 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                        ⚡
                      </div>
                      <div>
                        <h4 className="font-editorial text-lg text-primary dark:text-white">
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
                  <div className="p-6 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 space-y-2">
                    <h4 className="font-editorial text-lg text-primary dark:text-white">
                      الدفع عند الاستلام (Cash on Delivery)
                    </h4>
                    <p className="text-xs text-secondary dark:text-zinc-300 font-light">
                      ادفع نقداً أو عبر بطاقتك الائتمانية أو إنستاباي لمندوب التوصيل عند استلام وتجربة القطعة في منزلك.
                    </p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="p-6 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 space-y-4">
                    <div>
                      <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
                        {t.cardNumberLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-xs font-mono text-primary dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-label-bold text-secondary uppercase mb-1">
                          {t.cardExpiryLabel}
                        </label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-xs font-mono text-primary dark:text-white focus:outline-none"
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
                          className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-xs font-mono text-primary dark:text-white focus:outline-none"
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
                        className="w-full bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 p-3 text-xs font-mono text-primary dark:text-white uppercase focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

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
          </div>
        </div>
      </div>
    </div>
  );
};
