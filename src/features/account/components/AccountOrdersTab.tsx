import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Truck,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { useCurrency, useLanguage } from '@/shared';
import { Order, ExchangeRequest, ExchangeStatus } from '@/types';
import { exchangeService } from '@/services/exchangeService';
import { RequestExchangeModal } from './RequestExchangeModal';

interface AccountOrdersTabProps {
  orders: Order[];
}

export const AccountOrdersTab: React.FC<AccountOrdersTabProps> = ({ orders = [] }) => {
  const { formatPrice } = useCurrency();
  const { t, isRTL } = useLanguage();
  const [selectedOrderForExchange, setSelectedOrderForExchange] = useState<Order | null>(null);

  // Fetch all customer's exchange requests
  const { data: myExchanges = [], refetch: refetchExchanges } = useQuery({
    queryKey: ['my-exchange-requests'],
    queryFn: () => exchangeService.getMyRequests(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Group exchanges by orderId
  const exchangesByOrder = useMemo(() => {
    const map = new Map<string, ExchangeRequest[]>();
    (myExchanges || []).forEach((req) => {
      if (!req.orderId) return;
      const list = map.get(req.orderId) || [];
      list.push(req);
      map.set(req.orderId, list);
    });
    return map;
  }, [myExchanges]);

  if (!orders || orders.length === 0) {
    return (
      <div className="p-12 text-center bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 rounded-xl">
        <p className="text-xs text-secondary">{t.noOrdersYet}</p>
      </div>
    );
  }

  const renderExchangeStatusCard = (req: ExchangeRequest) => {
    const isApproved = req.status === 'APPROVED';
    const isInTransit = req.status === 'IN_TRANSIT';
    const isCompleted = req.status === 'COMPLETED';
    const isRejected = req.status === 'REJECTED';
    const isPending = req.status === 'PENDING';

    const bgClass = isApproved
      ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
      : isInTransit
      ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
      : isCompleted
      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
      : isRejected
      ? 'bg-red-500/10 border-red-500/30 text-red-300'
      : 'bg-amber-500/10 border-amber-500/30 text-amber-300';

    return (
      <div
        key={req.id}
        className={`p-4 rounded-xl border space-y-2.5 transition-all text-xs font-mono ${bgClass}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isApproved && <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />}
            {isInTransit && <Truck className="w-4 h-4 text-purple-400 shrink-0" />}
            {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {isRejected && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
            {isPending && <Clock className="w-4 h-4 text-amber-400 shrink-0" />}

            <span className="font-bold">
              {isApproved && (isRTL ? '✅ تمت الموافقة على طلب الاستبدال' : 'Exchange Approved')}
              {isInTransit && (isRTL ? '🚚 مندوب الشحن في الطريق للاستبدال' : 'Out For Exchange Pickup')}
              {isCompleted && (isRTL ? '🎉 تم الاستبدال بنجاح' : 'Exchange Completed')}
              {isRejected && (isRTL ? '❌ تم رفض طلب الاستبدال' : 'Exchange Request Rejected')}
              {isPending && (isRTL ? '🕒 طلب الاستبدال قيد المراجعة من الإدارة' : 'Exchange Pending Review')}
            </span>
          </div>

          <span className="text-[10px] opacity-75">
            {new Date(req.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        {/* Exchange details */}
        <div className="text-[11px] opacity-90 space-y-1">
          <div>
            <span>{isRTL ? 'القطعة:' : 'Item:'} </span>
            <strong className="text-white">{req.productName}</strong>
            <span className="opacity-75"> ({req.originalSize} ⬅️ {req.requestedSize || req.requestedColor || (isRTL ? 'استرجاع' : 'Refund')})</span>
          </div>
        </div>

        {/* Admin Notes / Rejection Reason */}
        {req.adminNotes && (
          <div className="pt-2 border-t border-current/20 flex items-start gap-2 text-[11px]">
            <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <div>
              <strong>{isRTL ? 'رد الإدارة:' : 'Admin Note:'} </strong>
              <span>{req.adminNotes}</span>
            </div>
          </div>
        )}

        {/* If Rejected: Contact Support Link */}
        {isRejected && (
          <div className="pt-1">
            <a
              href="https://wa.me/201011122334"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 hover:underline"
            >
              <HelpCircle className="w-3 h-3" />
              <span>{isRTL ? 'تواصل مع خدمة العملاء للاستفسار ↗' : 'Contact Support via WhatsApp ↗'}</span>
            </a>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        {orders.map((order) => {
          const items = order?.items || [];
          const exchanges = exchangesByOrder.get(order.id) || [];
          const hasActiveExchange = exchanges.some((e) => e.status !== 'REJECTED' && e.status !== 'COMPLETED');

          return (
            <div
              key={order.id}
              className="p-6 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 rounded-xl space-y-4 shadow-sm"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-container dark:border-zinc-800 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-primary dark:text-white">{order.id}</span>
                    <span className="text-xs font-label-bold px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase font-mono">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-secondary dark:text-zinc-400 mt-0.5">
                    {order.date} • {t.trackingId} <strong className="text-primary dark:text-white">{order.trackingNumber || 'BOUSTA-EFL'}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-base font-bold text-primary dark:text-white">
                    {formatPrice(order.total || 0)}
                  </span>
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {items.map((it, idx) => {
                  const img = it?.product?.images?.[0] || 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop';
                  return (
                    <div key={idx} className="flex gap-3 p-3 bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-800 rounded-lg">
                      <img src={img} alt={it?.product?.name || 'Item'} className="w-14 h-16 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-editorial text-base text-primary dark:text-white line-clamp-1">{it?.product?.name || 'Product'}</h4>
                        <p className="text-[11px] text-secondary font-mono">
                          {it?.selectedSize || 'M'} • {it?.selectedColor || 'Standard'} {it.quantity > 1 ? `• ${t.qty}: ${it.quantity}` : ''}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-xs font-bold text-primary dark:text-white">
                            {formatPrice((it?.product?.price || 0) * (it.quantity || 1))}
                          </span>
                          {it.quantity > 1 && (
                            <span className="font-mono text-[10px] text-zinc-400">
                              ({it.quantity} × {formatPrice(it?.product?.price || 0)})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Real-time Exchange Requests Status Cards */}
              {exchanges.length > 0 && (
                <div className="space-y-2 pt-2">
                  {exchanges.map((req) => renderExchangeStatusCard(req))}
                </div>
              )}

              {/* Order Footer with Shipping details & Exchange button */}
              <div className="pt-4 border-t border-surface-container dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-secondary">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {order.shippingAddress && (
                    <span>{t.destination} {order.shippingAddress.street}, {order.shippingAddress.city}</span>
                  )}
                  <span className="flex items-center gap-1 text-primary dark:text-white">
                    <Truck className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t.estimatedDelivery} {order.estimatedDelivery || '24–48 Hours'}</span>
                  </span>
                </div>

                {/* Request Exchange / Return Action Button */}
                <button
                  type="button"
                  onClick={() => setSelectedOrderForExchange(order)}
                  className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-bold transition-all text-xs cursor-pointer shadow-xs ${
                    hasActiveExchange
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                      : 'bg-surface-container dark:bg-zinc-800 hover:bg-amber-500 hover:text-black dark:hover:bg-amber-400 dark:hover:text-black text-primary dark:text-white'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>
                    {hasActiveExchange
                      ? (isRTL ? 'إدارة / تقديم طلب استبدال' : 'Manage Exchange')
                      : (isRTL ? 'طلب استبدال / إرجاع' : 'Request Exchange / Return')}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Exchange Request Modal */}
      {selectedOrderForExchange && (
        <RequestExchangeModal
          order={selectedOrderForExchange}
          isOpen={Boolean(selectedOrderForExchange)}
          onClose={() => setSelectedOrderForExchange(null)}
          onSuccess={() => {
            setSelectedOrderForExchange(null);
            refetchExchanges();
          }}
        />
      )}
    </>
  );
};
