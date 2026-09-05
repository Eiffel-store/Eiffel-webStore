import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Smartphone, Crown, Sparkles, MessageCircle } from 'lucide-react';
import { useCurrency, useLanguage, useStoreData, Logo } from '@/shared';
import { Order } from '@/types';

interface OrderConfirmationProps {
  order: Order;
  paymentMethod?: string;
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
  const { settings } = useStoreData();
  const [hasClickedWhatsApp, setHasClickedWhatsApp] = React.useState(false);

  // Clean WhatsApp phone number
  const rawWhatsapp = settings?.whatsappNumber || '+201009326801';
  const cleanWhatsappNumber = rawWhatsapp.replace(/[^0-9]/g, '');

  const customerName =
    order.customerName ||
    `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim() ||
    'عميل إيفل';

  const isOrderConfirmed = order.status === 'Confirmed';

  // Pre-filled WhatsApp message for unconfirmed orders
  const messageText = 
    `مرحباً خدمة عملاء دار أزياء إيفل 👋\n` +
    `أود تأكيد طلبي للشحن والتجهيز فوراً، وأنا جاهز للاستلام ✅\n\n` +
    `📋 *بيانات الطلب:*\n` +
    `• رقم الطلب: *#${order.id}*\n` +
    `• الاسم: *${customerName}*\n` +
    `• إجمالي الفاتورة: *${formatPrice(order.total)}*\n` +
    `• عنوان التوصيل: *${street}, ${city}*\n\n` +
    `برجاء إدراج الطلب في أسرع دورة شحن وتسليم. شكراً لكم ✨`;

  const whatsappDeepLink = `https://api.whatsapp.com/send/?phone=${cleanWhatsappNumber}&text=${encodeURIComponent(messageText)}`;

  // Pre-filled WhatsApp message for VIP concierge inquiry
  const vipInquiryText = 
    `مرحباً خدمة عملاء دار أزياء إيفل 👑\n` +
    `معكم العميل VIP: *${customerName}*\n\n` +
    `بخصوص طلبي المعتمد رقم: *#${order.id}* بقيمة *${formatPrice(order.total)}* 🛍️\n` +
    `أود الاستفسار والمتابعة بخصوص موعد وصول الشحنة 🚚\n\n` +
    `شكراً لكم ولمجهودكم ✨`;

  const vipWhatsAppDeepLink = `https://api.whatsapp.com/send/?phone=${cleanWhatsappNumber}&text=${encodeURIComponent(vipInquiryText)}`;

  const handleOpenWhatsApp = () => {
    setHasClickedWhatsApp(true);
    window.open(whatsappDeepLink, '_blank', 'noopener,noreferrer');
  };

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

        {/* Dynamic Card: VIP Auto-Confirmed vs New Customer WhatsApp Verification */}
        {isOrderConfirmed ? (
          <div className="p-6 bg-gradient-to-b from-amber-950/30 via-zinc-900/60 to-emerald-950/30 border border-amber-500/40 rounded-xl space-y-4 text-center shadow-2xl relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold tracking-wider">
              <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{t.vipAutoConfirmBadge}</span>
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            </div>

            <h3 className="font-editorial text-xl sm:text-2xl text-amber-200">
              {t.vipAutoConfirmTitle}
            </h3>

            <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto leading-relaxed">
              {t.vipAutoConfirmDesc}
            </p>

            <div className="pt-1">
              <button
                onClick={() => window.open(vipWhatsAppDeepLink, '_blank', 'noopener,noreferrer')}
                type="button"
                className="w-full sm:w-auto px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-amber-300 hover:text-amber-200 border border-amber-500/30 font-label-bold text-xs uppercase tracking-wider rounded-lg shadow-lg flex items-center justify-center gap-2 mx-auto transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t.vipConciergeButton}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-gradient-to-b from-emerald-950/40 to-zinc-900/50 border border-emerald-500/30 rounded-xl space-y-4 text-center shadow-lg relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{t.whatsappConfirmCardTitle}</span>
            </div>

            <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
              {t.whatsappConfirmCardDesc}
            </p>

            <div className="pt-1">
              <button
                onClick={handleOpenWhatsApp}
                type="button"
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-label-bold text-xs uppercase tracking-wider rounded-lg shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2.5 mx-auto transition-all transform hover:scale-[1.02] cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-black shrink-0" />
                <span>{t.whatsappConfirmButton}</span>
              </button>
            </div>

            {hasClickedWhatsApp && (
              <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center justify-center gap-2 animate-fade-in font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t.whatsappSentNotice}</span>
              </div>
            )}
          </div>
        )}

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

        <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono text-center space-y-1 rounded">
          <p className="font-bold">
            ✓ يرجى تجهيز المبلغ المطلوب نقداً لمندوب الشحن عند استلام وتجربة شحنتك.
          </p>
        </div>

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
