import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Lock, Truck, AlertCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '@/features/cart';
import { useAuthStore } from '@/stores/useAuthStore';
import { useCurrency, useLanguage, useStoreData } from '@/shared';
import { Address, Order } from '@/types';
import { orderService } from '@/services/orderService';
import { customerService } from '@/services/customerService';
import { OrderConfirmation } from '../components/OrderConfirmation';
import { CheckoutContactForm, CheckoutFormErrors } from '../components/CheckoutContactForm';
import { CheckoutShippingSelector } from '../components/CheckoutShippingSelector';
import { CheckoutPaymentSelector } from '../components/CheckoutPaymentSelector';
import { CheckoutOrderSummary } from '../components/CheckoutOrderSummary';

export const CheckoutPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { cart, subtotal, discountAmount, discountCode, clearCart } = useCart();
  const { user, updateUserPoints, addAddress } = useAuthStore();
  const { addOrder, settings } = useStoreData();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<Order | null>(null);
  const [formAlert, setFormAlert] = useState<string | null>(null);
  const [saveAddressToAccount, setSaveAddressToAccount] = useState(true);

  // Form state - initialized with real logged-in user or empty strings for guests
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Cairo (القاهرة)');
  const [postalCode, setPostalCode] = useState('');
  const [country] = useState('Egypt');
  const [phone, setPhone] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [mapUrl, setMapUrl] = useState<string | undefined>(undefined);

  // Validation States
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Sync user info if authenticated
  useEffect(() => {
    if (user) {
      if (user.email) setEmail(user.email);
      if (user.name) {
        const parts = user.name.split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
      }
      if (user.phone) setPhone(user.phone);
      if (user.addresses && user.addresses.length > 0) {
        const defAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
        if (defAddr.street) setStreet(defAddr.street);
        if (defAddr.city) setCity(defAddr.city);
        if (defAddr.postalCode) setPostalCode(defAddr.postalCode);
      }
    }
  }, [user]);

  // Validate single field or whole form
  const validateField = (field: string, val: string): string | undefined => {
    switch (field) {
      case 'email':
        if (!val.trim()) return `${t.emailLabel} ${t.required}`;
        if (!/\S+@\S+\.\S+/.test(val)) return t.invalidEmail || 'Invalid email address';
        return undefined;
      case 'firstName':
        if (!val.trim()) return `${t.firstNameLabel} ${t.required}`;
        if (val.trim().length < 2) return `${t.firstNameLabel} ${t.invalidOrExpiredOtp}`;
        return undefined;
      case 'lastName':
        if (!val.trim()) return `${t.lastNameLabel} ${t.required}`;
        if (val.trim().length < 2) return `${t.lastNameLabel} ${t.invalidOrExpiredOtp}`;
        return undefined;
      case 'phone':
        if (!val.trim()) return `${t.phoneLabel} ${t.required}`;
        const cleanPhone = val.replace(/\s+/g, '');
        if (cleanPhone.length < 10) return `${t.phoneLabel} ${t.required}`;
        return undefined;
      case 'city':
        if (!val.trim()) return `${t.governorateCity} ${t.required}`;
        return undefined;
      case 'street':
        if (!val.trim()) return `${t.streetLabel} ${t.required}`;
        if (val.trim().length < 5) return `${t.streetDetailedLabel} ${t.required}`;
        return undefined;
      default:
        return undefined;
    }
  };

  const validateAll = (): { isValid: boolean; newErrors: CheckoutFormErrors } => {
    const newErrors: CheckoutFormErrors = {
      email: validateField('email', email),
      firstName: validateField('firstName', firstName),
      lastName: validateField('lastName', lastName),
      phone: validateField('phone', phone),
      city: validateField('city', city),
      street: validateField('street', street),
    };

    // Filter out undefined
    const cleanErrors: CheckoutFormErrors = {};
    Object.entries(newErrors).forEach(([k, v]) => {
      if (v) cleanErrors[k as keyof CheckoutFormErrors] = v;
    });

    const isValid = Object.keys(cleanErrors).length === 0;
    return { isValid, newErrors: cleanErrors };
  };

  const handleBlurField = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    let val = '';
    if (field === 'email') val = email;
    if (field === 'firstName') val = firstName;
    if (field === 'lastName') val = lastName;
    if (field === 'phone') val = phone;
    if (field === 'city') val = city;
    if (field === 'street') val = street;

    const errorMsg = validateField(field, val);
    setErrors(prev => ({ ...prev, [field]: errorMsg }));
  };

  // Shipping & Payment
  const [shippingMethod, setShippingMethod] = useState<'express' | 'white-glove'>('express');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'points'>('cod');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

  // Points & Loyalty Calculations
  const availablePoints = user?.tierPoints || 0;
  const isVip = Boolean(user?.isVip) || user?.tier === 'VIP' || user?.tier === 'VIP_PLATINUM';

  const vipDiscountRate = isVip && settings?.vipDiscountPercentage ? (settings.vipDiscountPercentage / 100) : 0;
  const vipDiscountAmount = subtotal * vipDiscountRate;
  const discountValue = discountAmount + vipDiscountAmount;
  const isFreeShipping = (settings?.vipFreeShipping && isVip) || subtotal >= (settings?.freeShippingThreshold || 1500);
  const shippingFee = isFreeShipping ? 0 : (shippingMethod === 'white-glove' ? 10 : 0);
  const totalBeforePoints = Math.max(0, subtotal - discountValue + shippingFee);

  // Full points coverage rule: Payment with points is ONLY allowed if availablePoints covers 100% of order total
  const isFullPointsCoverage = availablePoints >= totalBeforePoints && totalBeforePoints > 0;

  // Auto-reset payment method to COD if user selected points but points become insufficient
  useEffect(() => {
    if (paymentMethod === 'points' && !isFullPointsCoverage) {
      setPaymentMethod('cod');
    }
  }, [paymentMethod, isFullPointsCoverage]);

  // Apply points ONLY if explicitly chosen as payment method AND covers 100% of order
  const isUsingPoints = paymentMethod === 'points' && isFullPointsCoverage;
  const pointsDiscountValue = isUsingPoints ? totalBeforePoints : 0;
  const totalAmount = Math.max(0, totalBeforePoints - pointsDiscountValue);

  // Dynamic Points to earn based on settings cashback rate (e.g. 5%)
  const cashbackRate = typeof settings?.loyaltyCashbackRate === 'number' ? settings.loyaltyCashbackRate : 0.05;
  const pointsToEarn = Math.max(1, Math.round(totalAmount * cashbackRate));

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setFormAlert(null);

    // 1. Check Cart
    if (!cart || cart.length === 0) {
      setFormAlert(t.cartEmptyOrderAlert);
      return;
    }

    // 2. Validate All Inputs
    const { isValid, newErrors } = validateAll();
    setErrors(newErrors);
    setTouched({
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      city: true,
      street: true
    });

    if (!isValid) {
      const missingFieldsCount = Object.keys(newErrors).length;
      setFormAlert(
        t.missingFieldsAlert.replace('{count}', String(missingFieldsCount))
      );

      // Focus first error field
      const firstKey = Object.keys(newErrors)[0];
      if (firstKey) {
        const el = document.getElementById(`checkout-${firstKey}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.focus();
        }
      }
      return;
    }

    setIsSubmitting(true);

    const shippingAddress: Address = {
      id: `addr-${Date.now()}`,
      type: 'Home',
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      street: street.trim(),
      city: city.trim(),
      state: city.trim(),
      postalCode: postalCode.trim(),
      country,
      phone: phone.trim(),
      latitude,
      longitude,
      mapUrl: mapUrl || (latitude && longitude ? `https://maps.google.com/?q=${latitude},${longitude}` : undefined),
      isDefault: true,
    };

    let paymentMethodString = 'Cash on Delivery (الدفع عند الاستلام)';
    if (paymentMethod === 'points' && isFullPointsCoverage) {
      paymentMethodString = t.paidWithPointsFull;
    }

    try {
      const orderPayload: Partial<Order> = {
        items: cart,
        subtotal,
        shipping: shippingFee,
        discount: discountValue + pointsDiscountValue,
        tax: 0,
        total: totalAmount,
        customerName: `${firstName.trim()} ${lastName.trim()}`.trim(),
        customerEmail: email.trim() || user?.email || '',
        customerPhone: phone.trim(),
        shippingAddress: {
          ...shippingAddress,
          email: email.trim() || user?.email || '',
        } as any,
        paymentMethod: paymentMethodString,
        pointsEarned: pointsToEarn,
        pointsRedeemed: pointsDiscountValue,
        pointsDiscount: pointsDiscountValue,
        couponCode: discountCode || undefined
      };

      const createdOrder = await orderService.create(orderPayload);
      addOrder(createdOrder);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', 'my-orders'] });

      // Broadcast order creation to open Admin tabs
      try {
        if (typeof BroadcastChannel !== 'undefined') {
          const bc = new BroadcastChannel('eiffel-sync');
          bc.postMessage({
            type: 'ORDER_CREATED',
            payload: {
              orderId: createdOrder.id,
              total: createdOrder.total,
              customerName: orderPayload.customerName || orderPayload.customerEmail || 'عميل جديد',
              customerPhone: orderPayload.customerPhone || '',
              customerEmail: orderPayload.customerEmail,
              itemsCount: createdOrder.items?.length || 1,
              status: createdOrder.status,
              timestamp: Date.now(),
            },
          });
          bc.close();
        }
      } catch {
        // ignore
      }

      // Deduct points from user balance if points were redeemed
      if (pointsDiscountValue > 0 && user) {
        updateUserPoints(-pointsDiscountValue);
        if (user.id) {
          customerService.adjustPoints(user.id, -pointsDiscountValue).catch(() => {});
        }
      }

      // If user is logged in and chose to save this address to their profile
      if (user && saveAddressToAccount && street.trim()) {
        const existingMatch = (user.addresses || []).find(
          (a) => a.street.toLowerCase() === street.trim().toLowerCase() && a.city === city
        );
        if (!existingMatch) {
          addAddress({
            type: 'Home',
            firstName: firstName.trim() || user.name?.split(' ')[0] || '',
            lastName: lastName.trim() || user.name?.split(' ').slice(1).join(' ') || '',
            street: street.trim(),
            city: city.trim(),
            postalCode: postalCode.trim(),
            phone: phone.trim() || user.phone || '',
            country: country || 'Egypt',
            latitude,
            longitude,
            mapUrl,
            state: city.trim(),
            isDefault: (user.addresses || []).length === 0,
          });
        }
      }

      clearCart();
      setOrderComplete(createdOrder);
    } catch (err: any) {
      console.error('Failed to create order on backend:', err);
      const serverMessage = err?.response?.data?.message || err?.message;

      // Invalidate products query to refresh real-time stock
      queryClient.invalidateQueries({ queryKey: ['products'] });

      // If backend returned a clear validation error (e.g. stock out, validation limit)
      if (serverMessage && typeof serverMessage === 'string' && (err?.response?.status === 400 || err?.response?.status === 409 || err?.response?.status === 422)) {
        setFormAlert(serverMessage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      setFormAlert(
        serverMessage || t.orderProcessingError
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="min-h-screen bg-background text-on-surface py-6 sm:py-12 px-3 sm:px-8 md:px-12 pb-safe">
      <div className="max-w-[1440px] mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 sm:pb-6 border-b border-surface-container dark:border-zinc-800 mb-6 sm:mb-8 gap-3">
          <div>
            <span className="text-[10px] sm:text-xs font-mono text-secondary dark:text-zinc-400 uppercase">
              {t.checkoutSecurityNotice}
            </span>
            <h1 className="font-editorial text-3xl sm:text-5xl text-primary dark:text-white mt-0.5 sm:mt-1 uppercase">
              {t.proceedToCheckout}
            </h1>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono text-secondary">
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>256-BIT SECURE (EGYPT)</span>
          </div>
        </div>

        {/* Global Validation Alert Banner */}
        {formAlert && (
          <div className="mb-6 sm:mb-8 p-3.5 sm:p-4 bg-red-950/60 border-2 border-red-500 text-red-200 text-xs sm:text-sm rounded-lg flex items-start gap-3 shadow-xl animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">{t.checkoutValidationAlert}</span>
              <p className="leading-relaxed">{formAlert}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
          {/* Main Checkout Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <form onSubmit={handlePlaceOrder} noValidate className="space-y-8">
              <CheckoutContactForm
                addresses={user?.addresses}
                email={email}
                setEmail={(v) => {
                  setEmail(v);
                  if (touched.email) setErrors(prev => ({ ...prev, email: validateField('email', v) }));
                }}
                firstName={firstName}
                setFirstName={(v) => {
                  setFirstName(v);
                  if (touched.firstName) setErrors(prev => ({ ...prev, firstName: validateField('firstName', v) }));
                }}
                lastName={lastName}
                setLastName={(v) => {
                  setLastName(v);
                  if (touched.lastName) setErrors(prev => ({ ...prev, lastName: validateField('lastName', v) }));
                }}
                city={city}
                setCity={(v) => {
                  setCity(v);
                  if (touched.city) setErrors(prev => ({ ...prev, city: validateField('city', v) }));
                }}
                street={street}
                setStreet={(v) => {
                  setStreet(v);
                  if (touched.street) setErrors(prev => ({ ...prev, street: validateField('street', v) }));
                }}
                phone={phone}
                setPhone={(v) => {
                  setPhone(v);
                  if (touched.phone) setErrors(prev => ({ ...prev, phone: validateField('phone', v) }));
                }}
                postalCode={postalCode}
                setPostalCode={setPostalCode}
                latitude={latitude}
                setLatitude={setLatitude}
                longitude={longitude}
                setLongitude={setLongitude}
                mapUrl={mapUrl}
                setMapUrl={setMapUrl}
                errors={errors}
                touched={touched}
                onBlurField={handleBlurField}
                isLoggedIn={Boolean(user)}
                saveAddressToAccount={saveAddressToAccount}
                setSaveAddressToAccount={setSaveAddressToAccount}
              />

              <CheckoutShippingSelector
                shippingMethod={shippingMethod}
                setShippingMethod={setShippingMethod}
              />

              <CheckoutPaymentSelector
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                availablePoints={availablePoints}
                totalBeforePoints={totalBeforePoints}
                pointsDiscountValue={pointsDiscountValue}
              />

              {/* Authorize CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-xl disabled:opacity-50 cursor-pointer"
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
              availablePoints={availablePoints}
              redeemPoints={paymentMethod === 'points'}
              pointsDiscountValue={pointsDiscountValue}
              pointsToEarn={pointsToEarn}
              isVip={isVip}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
