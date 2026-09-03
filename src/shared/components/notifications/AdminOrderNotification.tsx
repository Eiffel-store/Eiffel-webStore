import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ShoppingBag, X, ExternalLink, User, Phone, Coins } from 'lucide-react';
import { TranslationDictionary } from '@/i18n/types';
import { playLuxuryOrderChime } from '@/shared/utils/soundNotification';

export interface AdminOrderCreatedPayload {
  orderId: string;
  total?: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  itemsCount?: number;
  status?: string;
  timestamp?: number;
}

interface AdminOrderNotificationProps {
  tId: string;
  payload: AdminOrderCreatedPayload;
  t: TranslationDictionary;
  onViewOrder?: (orderId: string) => void;
}

export const AdminOrderNotification: React.FC<AdminOrderNotificationProps> = ({
  tId,
  payload,
  t,
  onViewOrder,
}) => {
  useEffect(() => {
    // Play warm luxury chime once when notification is rendered
    playLuxuryOrderChime();
  }, []);

  const customerDisplay = payload.customerName || payload.customerEmail || 'عميل جديد';
  const descText = t.adminNewOrderReceivedDesc
    .replace('{total}', (payload.total || 0).toString())
    .replace('{customer}', customerDisplay);

  return (
    <div className="relative w-full max-w-md bg-zinc-950/95 backdrop-blur-2xl border border-amber-500/40 rounded-2xl p-4 shadow-2xl shadow-black/90 ring-1 ring-amber-400/20 text-white overflow-hidden animate-slide-in transition-all">
      {/* Top Gold Shimmer Bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-600 animate-pulse" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          {/* Pulsing Animated Icon */}
          <div className="relative p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-amber-400 text-black shadow">
                {t.adminNewOrderReceivedTitle}
              </span>
              <span className="text-[10px] font-mono text-zinc-400 font-bold">
                {payload.orderId}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white tracking-wide mt-1">
              {payload.total ? `${payload.total} EGP` : ''}
              {payload.itemsCount ? ` (${payload.itemsCount} ${t.adminPiecesCountLabel})` : ''}
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

      {/* Customer Details Pill */}
      <div className="mt-3 p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5 text-xs">
        <div className="flex items-center justify-between text-zinc-300">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium text-white">{customerDisplay}</span>
          </div>
          {payload.customerPhone && (
            <div className="flex items-center gap-1 font-mono text-zinc-400 text-[11px]">
              <Phone className="w-3 h-3 text-zinc-500" />
              <span>{payload.customerPhone}</span>
            </div>
          )}
        </div>
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          {descText}
        </p>
      </div>

      {/* Action Footer */}
      {onViewOrder && (
        <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-end">
          <button
            type="button"
            onClick={() => {
              toast.dismiss(tId);
              onViewOrder(payload.orderId);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono font-bold transition-all shadow-md shadow-amber-400/20 cursor-pointer"
          >
            <span>{t.adminViewOrderAction}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="absolute bottom-0 inset-x-0 h-0.5 bg-zinc-900 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 origin-left"
          style={{ animation: 'adminProgressShrink 9s linear forwards' }}
        />
        <style>{`
          @keyframes adminProgressShrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}</style>
      </div>
    </div>
  );
};

export const showAdminNewOrderToast = (
  payload: AdminOrderCreatedPayload,
  t: TranslationDictionary,
  onViewOrder?: (orderId: string) => void
) => {
  toast.custom(
    (toastInstance) => (
      <AdminOrderNotification
        tId={toastInstance.id}
        payload={payload}
        t={t}
        onViewOrder={onViewOrder}
      />
    ),
    {
      id: `admin-new-order-${payload.orderId}`,
      duration: 9000,
      position: 'top-right',
    }
  );
};
