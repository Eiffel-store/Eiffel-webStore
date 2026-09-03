import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { RefreshCw, X, ExternalLink, User, Phone, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { TranslationDictionary } from '@/i18n/types';
import { playLuxuryOrderChime } from '@/shared/utils/soundNotification';

export interface AdminExchangePayload {
  id: string;
  orderId: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  productName?: string;
  reason?: string;
  type?: string;
  requestedSize?: string;
  status?: string;
  timestamp?: number;
}

export interface CustomerExchangePayload {
  id: string;
  orderId: string;
  customerEmail?: string;
  productName?: string;
  status?: string;
  adminNotes?: string;
  timestamp?: number;
}

// -------------------------------------------------------------
// ADMIN NOTIFICATION FOR INCOMING EXCHANGE REQUESTS
// -------------------------------------------------------------
interface AdminExchangeToastProps {
  tId: string;
  payload: AdminExchangePayload;
  t: TranslationDictionary;
  onView?: (exchangeId: string) => void;
}

export const AdminExchangeNotification: React.FC<AdminExchangeToastProps> = ({
  tId,
  payload,
  t,
  onView,
}) => {
  useEffect(() => {
    playLuxuryOrderChime();
  }, []);

  return (
    <div className="relative w-full max-w-md bg-zinc-950/95 backdrop-blur-2xl border border-indigo-500/40 rounded-2xl p-4 shadow-2xl shadow-black/90 ring-1 ring-indigo-400/20 text-white overflow-hidden animate-slide-in transition-all">
      {/* Top Gradient Shimmer Bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-300 to-indigo-600 animate-pulse" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-400 rounded-full animate-ping" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-bold">
              {t.newExchangeTitle}
            </span>
            <h4 className="text-sm font-label-bold text-white tracking-wide mt-0.5">
              {t.newExchangeOrder}{payload.orderId}
            </h4>
          </div>
        </div>

        <button
          onClick={() => toast.dismiss(tId)}
          className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Details Box */}
      <div className="mt-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-1.5 text-xs">
        {payload.productName && (
          <p className="font-medium text-zinc-200 truncate">
            {payload.productName} {payload.requestedSize ? `(مقاس: ${payload.requestedSize})` : ''}
          </p>
        )}
        <div className="flex items-center gap-3 text-zinc-400 text-[11px] font-mono">
          <span className="flex items-center gap-1 truncate">
            <User className="w-3 h-3 text-indigo-400 shrink-0" />
            {payload.customerName || payload.customerEmail}
          </span>
          {payload.customerPhone && (
            <span className="flex items-center gap-1 shrink-0">
              <Phone className="w-3 h-3 text-indigo-400 shrink-0" />
              {payload.customerPhone}
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          onClick={() => {
            toast.dismiss(tId);
            onView?.(payload.id);
          }}
          className="flex-1 py-2 px-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-xl text-xs font-label-bold tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <span>{t.viewExchanges}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => toast.dismiss(tId)}
          className="py-2 px-3 text-zinc-400 hover:text-white text-xs font-mono transition-colors cursor-pointer"
        >
          {t.close || 'إغلاق'}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 inset-x-0 h-0.5 bg-zinc-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 origin-left"
          style={{ animation: 'exchangeShrink 8s linear forwards' }}
        />
        <style>{`
          @keyframes exchangeShrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}</style>
      </div>
    </div>
  );
};

export const showAdminExchangeToast = (
  payload: AdminExchangePayload,
  t: TranslationDictionary,
  onView?: (exchangeId: string) => void
) => {
  toast.custom(
    (tObj) => (
      <AdminExchangeNotification
        tId={tObj.id}
        payload={payload}
        t={t}
        onView={onView}
      />
    ),
    {
      duration: 8000,
      position: 'top-right',
    }
  );
};

// -------------------------------------------------------------
// CUSTOMER NOTIFICATION WHEN ADMIN UPDATES EXCHANGE STATUS
// -------------------------------------------------------------
interface CustomerExchangeToastProps {
  tId: string;
  payload: CustomerExchangePayload;
  t: TranslationDictionary;
  onView?: () => void;
}

export const CustomerExchangeNotification: React.FC<CustomerExchangeToastProps> = ({
  tId,
  payload,
  t,
  onView,
}) => {
  useEffect(() => {
    playLuxuryOrderChime();
  }, []);

  const isApproved = payload.status === 'APPROVED';
  const isRejected = payload.status === 'REJECTED';
  const isCompleted = payload.status === 'COMPLETED';

  const statusTitle = isApproved
    ? t.exchangeApproved
    : isRejected
    ? t.exchangeRejected
    : isCompleted
    ? t.exchangeCompleted
    : t.exchangeStatusUpdated;

  return (
    <div className="relative w-full max-w-md bg-zinc-950/95 backdrop-blur-2xl border border-zinc-700/80 rounded-2xl p-4 shadow-2xl shadow-black/90 text-white overflow-hidden animate-slide-in transition-all">
      {/* Top Accent Bar */}
      <div
        className={`absolute top-0 inset-x-0 h-1 ${
          isApproved
            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
            : isRejected
            ? 'bg-gradient-to-r from-red-500 to-rose-400'
            : 'bg-gradient-to-r from-amber-500 to-yellow-400'
        }`}
      />

      <div className="flex items-start justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl border flex items-center justify-center ${
              isApproved
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : isRejected
                ? 'bg-red-500/20 border-red-500/40 text-red-400'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
            }`}
          >
            {isApproved ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : isRejected ? (
              <XCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
              {t.exchangeStatusUpdated}
            </span>
            <h4 className="text-sm font-label-bold text-white mt-0.5">
              {t.newExchangeOrder}{payload.orderId}
            </h4>
          </div>
        </div>

        <button
          onClick={() => toast.dismiss(tId)}
          className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="mt-2.5 text-xs text-zinc-300 leading-relaxed">
        {statusTitle}
      </p>

      {payload.adminNotes && (
        <div className="mt-2 p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 font-mono">
          <span className="text-amber-400 font-bold block mb-0.5">ملاحظات الإدارة:</span>
          {payload.adminNotes}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          onClick={() => {
            toast.dismiss(tId);
            onView?.();
          }}
          className="flex-1 py-2 px-3 bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-label-bold tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>{t.viewInClientPortal}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => toast.dismiss(tId)}
          className="py-2 px-3 text-zinc-400 hover:text-white text-xs font-mono transition-colors cursor-pointer"
        >
          {t.close || 'إغلاق'}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 inset-x-0 h-0.5 bg-zinc-800 overflow-hidden">
        <div
          className={`h-full origin-left ${
            isApproved
              ? 'bg-emerald-400'
              : isRejected
              ? 'bg-red-400'
              : 'bg-amber-400'
          }`}
          style={{ animation: 'exchangeShrink 8s linear forwards' }}
        />
      </div>
    </div>
  );
};

export const showCustomerExchangeToast = (
  payload: CustomerExchangePayload,
  t: TranslationDictionary,
  onView?: () => void
) => {
  toast.custom(
    (tObj) => (
      <CustomerExchangeNotification
        tId={tObj.id}
        payload={payload}
        t={t}
        onView={onView}
      />
    ),
    {
      duration: 8000,
      position: 'top-right',
    }
  );
};
