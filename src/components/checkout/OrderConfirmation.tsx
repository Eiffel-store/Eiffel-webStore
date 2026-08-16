import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Smartphone } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { Order } from '../../types';
import { Logo } from '../common/Logo';

interface OrderConfirmationProps {
  order: Order;
  paymentMethod: 'instapay' | 'card' | 'cod';
  street: string;
  city: string;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  order,
  paymentMethod,
  street,
  city,
}) => {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-on-surface py-16 px-4 sm:px-8 md:px-12 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-surface-container-lowest dark:bg-zinc-950 p-8 sm:p-12 border border-surface-container dark:border-zinc-800 shadow-2xl space-y-8 animate-fade-in text-center">
        <div className="flex justify-center pb-2">
          <Logo size="lg" />
        </div>

        <div className="w-14 h-14 rounded-full bg-primary text-white dark:bg-white dark:text-black mx-auto flex items-center justify-center shadow-lg">
          <CheckCircle2 className="w-7 h-7" />
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
            <strong className="text-primary dark:text-white">{order.id}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">{t.estimatedDelivery}</span>
            <span className="text-primary dark:text-white">{order.estimatedDelivery}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">{t.trackingId}</span>
            <span className="text-primary dark:text-white font-bold">{order.trackingNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">{t.totalCharged}</span>
            <span className="text-primary dark:text-white font-bold">{formatPrice(order.total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">طريقة الدفع:</span>
            <span className="text-primary dark:text-white font-bold">{order.paymentMethod}</span>
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
            <p>يرجى إرسال المبلغ الإجمالي ({formatPrice(order.total)}) إلى الحساب الموثق: <strong>eiffel.egypt@instapay</strong> واذكر رقم الطلب <strong>{order.id}</strong> في الملاحظات.</p>
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
};
