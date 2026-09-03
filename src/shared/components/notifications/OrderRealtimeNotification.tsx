import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { 
  CheckCircle2, 
  Truck, 
  Sparkles, 
  XCircle, 
  Clock, 
  X, 
  ExternalLink, 
  Coins 
} from 'lucide-react';
import { TranslationDictionary } from '@/i18n/types';

export interface OrderRealtimePayload {
  orderId: string;
  status: string;
  pointsEarned?: number;
  total?: number;
  trackingNumber?: string;
  timestamp?: number;
  customerEmail?: string;
}

interface OrderRealtimeNotificationProps {
  tId: string;
  payload: OrderRealtimePayload;
  t: TranslationDictionary;
  onViewOrder?: (orderId: string) => void;
}

export const OrderRealtimeNotification: React.FC<OrderRealtimeNotificationProps> = ({
  tId,
  payload,
  t,
  onViewOrder,
}) => {
  const [progress, setProgress] = useState(100);
  const normalizedStatus = (payload.status || '').toLowerCase().replace(/_/g, ' ');

  useEffect(() => {
    const totalDuration = 7000;
    const intervalTime = 50;
    const step = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          toast.dismiss(tId);
          return 0;
        }
        return Math.max(0, prev - step);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [tId]);

  // Determine status configuration
  let StatusIcon = Clock;
  let statusBadgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  let iconGlowColor = 'text-amber-400';
  let statusTitle = t.orderLiveUpdate;
  let statusDesc = t.orderStatusAwaitingConfirmationDesc;

  if (normalizedStatus.includes('confirm')) {
    StatusIcon = CheckCircle2;
    statusBadgeColor = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    iconGlowColor = 'text-emerald-400 shadow-emerald-500/30';
    statusTitle = t.orderStatusConfirmedTitle;
    statusDesc = t.orderStatusConfirmedDesc;
  } else if (normalizedStatus.includes('ship') || normalizedStatus.includes('out for delivery')) {
    StatusIcon = Truck;
    statusBadgeColor = 'bg-sky-500/15 text-sky-300 border-sky-500/30';
    iconGlowColor = 'text-sky-400 shadow-sky-500/30';
    statusTitle = t.orderStatusShippedTitle;
    statusDesc = t.orderStatusShippedDesc;
  } else if (normalizedStatus.includes('deliver')) {
    StatusIcon = Sparkles;
    statusBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    iconGlowColor = 'text-amber-400 shadow-amber-500/40';
    statusTitle = t.orderStatusDeliveredTitle;
    statusDesc = t.orderStatusDeliveredDesc;
  } else if (normalizedStatus.includes('cancel')) {
    StatusIcon = XCircle;
    statusBadgeColor = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
    iconGlowColor = 'text-rose-400 shadow-rose-500/30';
    statusTitle = t.orderStatusCancelledTitle;
    statusDesc = t.orderStatusCancelledDesc;
  }

  const isDelivered = normalizedStatus.includes('deliver');
  const points = payload.pointsEarned ?? 0;

  return (
    <div className="relative w-full max-w-md bg-zinc-950/95 backdrop-blur-2xl border border-amber-500/30 rounded-2xl p-4 shadow-2xl shadow-black/90 ring-1 ring-white/10 text-white overflow-hidden animate-slide-in transition-all">
      {/* Top Luxury Shimmer Accent */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-600" />

      {/* Header Row */}
      <div className="flex items-start justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          {/* Pulsing Icon */}
          <div className={`relative p-2.5 rounded-xl border flex items-center justify-center ${statusBadgeColor}`}>
            <StatusIcon className={`w-5 h-5 ${iconGlowColor}`} />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-amber-400">
                {payload.orderId}
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                {t.orderLiveUpdate}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white tracking-wide mt-0.5">
              {statusTitle}
            </h4>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => toast.dismiss(tId)}
          className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-zinc-300 leading-relaxed mt-2.5 px-0.5">
        {statusDesc}
      </p>

      {/* Points Awarded Highlight (Only on Delivered) */}
      {isDelivered && points > 0 && (
        <div className="mt-3 p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-center gap-2.5 text-xs text-amber-300 font-mono">
          <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
            <Coins className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold">
            {t.pointsEarnedOnDeliveryBadge.replace('{points}', points.toString())}
          </span>
        </div>
      )}

      {/* Action Footer */}
      {onViewOrder && (
        <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between">
          <span className="text-[11px] font-mono text-zinc-400">
            {payload.total ? `${payload.total} EGP` : ''}
          </span>
          <button
            type="button"
            onClick={() => {
              toast.dismiss(tId);
              onViewOrder(payload.orderId);
            }}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <span>{t.viewOrderInAccount}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Auto-Dismiss Countdown Progress Line */}
      <div className="absolute bottom-0 inset-x-0 h-0.5 bg-zinc-900">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const showOrderRealtimeToast = (
  payload: OrderRealtimePayload,
  t: TranslationDictionary,
  onViewOrder?: (orderId: string) => void
) => {
  toast.custom(
    (toastInstance) => (
      <OrderRealtimeNotification
        tId={toastInstance.id}
        payload={payload}
        t={t}
        onViewOrder={onViewOrder}
      />
    ),
    {
      id: `order-live-${payload.orderId}-${payload.status}`,
      duration: 7000,
      position: 'top-center',
    }
  );
};
