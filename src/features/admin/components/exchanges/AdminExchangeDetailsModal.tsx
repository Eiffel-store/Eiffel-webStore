import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageSquare,
  MapPin,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  FileText,
  Tag,
  AlertTriangle,
  Eye,
  ZoomIn,
  Loader2,
  ArrowRightLeft,
  ImageOff
} from 'lucide-react';
import { ExchangeRequest, ExchangeStatus } from '@/types';
import { useLanguage } from '@/shared';

interface AdminExchangeDetailsModalProps {
  request: ExchangeRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: ExchangeStatus, adminNotes?: string) => void;
  isUpdating?: boolean;
}

export const AdminExchangeDetailsModal: React.FC<AdminExchangeDetailsModalProps> = ({
  request,
  isOpen,
  onClose,
  onUpdateStatus,
  isUpdating = false,
}) => {
  const { isRTL, t } = useLanguage();
  const [selectedStatus, setSelectedStatus] = useState<ExchangeStatus | null>(null);
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [activeLightboxImg, setActiveLightboxImg] = useState<{ url: string; title: string } | null>(null);

  React.useEffect(() => {
    if (request) {
      setSelectedStatus(request.status);
      setAdminNotes(request.adminNotes || '');
    }
  }, [request]);

  if (!isOpen || !request) return null;

  const phone = request.customerPhone || '';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const waPhone = cleanPhone.startsWith('0')
    ? `2${cleanPhone}`
    : cleanPhone.startsWith('20')
    ? cleanPhone
    : `20${cleanPhone}`;

  const customerName = request.customerName || 'عميل إيفل';
  const waMessage = encodeURIComponent(
    `أهلاً بك يا ${customerName}، معك إدارة دار أزياء إيفل (EIFFEL).\n` +
    `بخصوص طلب الاستبدال/الاسترجاع للطلب رقم (#${request.orderId}) بخصوص القطعة (${request.productName})...\n`
  );

  const getStatusBadge = (status: ExchangeStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            <span>{t.exchangeStatusPending}</span>
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.exchangeStatusApproved}</span>
          </span>
        );
      case 'IN_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Truck className="w-3.5 h-3.5" />
            <span>{t.exchangeStatusInTransit}</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.exchangeStatusCompleted}</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30">
            <XCircle className="w-3.5 h-3.5" />
            <span>{t.exchangeStatusRejected}</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'EXCHANGE_SIZE':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-zinc-800 text-zinc-200 border border-zinc-700">{t.exchangeTypeSize}</span>;
      case 'EXCHANGE_COLOR':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-zinc-800 text-purple-300 border border-purple-800">{t.exchangeTypeColor}</span>;
      case 'DEFECT':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-red-950/80 text-red-300 border border-red-800">{t.exchangeTypeDefect}</span>;
      case 'RETURN_REFUND':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-800">{t.exchangeTypeRefund}</span>;
      default:
        return null;
    }
  };

  const handleSaveStatus = () => {
    if (!selectedStatus) return;
    onUpdateStatus(request.id, selectedStatus, adminNotes.trim() || undefined);
  };

  // Proof Images slots
  const tagPhotoUrl = request.tagImageUrl || request.proofImageUrl;
  const invoicePhotoUrl = request.invoiceImageUrl;
  const defectPhotoUrl = request.defectImageUrl;

  const proofSlots = [
    {
      type: 'invoice',
      title: t.adminInvoicePhotoTitle,
      icon: FileText,
      iconColor: 'text-blue-400',
      url: invoicePhotoUrl,
      required: request.requestType === 'RETURN_REFUND',
    },
    {
      type: 'tag',
      title: t.adminTagPhotoTitle,
      icon: Tag,
      iconColor: 'text-amber-400',
      url: tagPhotoUrl,
      required: true,
    },
    {
      type: 'defect',
      title: t.adminDefectPhotoTitle,
      icon: AlertTriangle,
      iconColor: 'text-red-400',
      url: defectPhotoUrl,
      required: request.requestType === 'DEFECT',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative bg-zinc-950 border border-zinc-800 w-[96vw] max-w-7xl h-[92vh] max-h-[92vh] flex flex-col shadow-2xl rounded-2xl my-auto text-white overflow-hidden">
        {/* Top Gold Accent Bar */}
        <div className="h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 shrink-0" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 flex items-start justify-between border-b border-zinc-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                EIFFEL EXCHANGE & RETURN
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs font-mono text-zinc-400">
                {new Date(request.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
              <h2 className="text-xl sm:text-2xl font-bold font-editorial text-white tracking-tight">
                #{request.orderId}
              </h2>
              {getTypeBadge(request.requestType)}
              {getStatusBadge(request.status)}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column Responsive Dashboard Layout */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Customer + Product + Reason (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Customer Info Card */}
              <div className="p-3.5 bg-zinc-900/70 border border-zinc-800/80 rounded-xl space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
                  <div>
                    <span className="font-bold text-sm text-white block">{customerName}</span>
                    {request.customerEmail && (
                      <span className="text-zinc-400 text-[11px] block">{request.customerEmail}</span>
                    )}
                  </div>
                  {phone && (
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${phone}`}
                        className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-zinc-700 rounded-lg transition-colors"
                        title="اتصال"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`https://wa.me/${waPhone}?text=${waMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-700/80 hover:bg-emerald-900 rounded-lg text-xs flex items-center gap-1.5 font-bold transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>واتساب</span>
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-2 text-zinc-300 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <strong className="text-white block">{request.pickupCity || 'القاهرة'}</strong>
                    <span className="text-zinc-400 block">{request.pickupAddress || 'عنوان الشحن'}</span>
                  </div>
                </div>
              </div>

              {/* Exchanged Item & Replacement Details */}
              <div className="p-3.5 bg-zinc-900/70 border border-zinc-800/80 rounded-xl space-y-2.5">
                <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  {t.exchangeItem}
                </span>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {request.productImage && (
                      <img
                        src={request.productImage}
                        alt={request.productName}
                        className="w-14 h-16 object-cover rounded-lg border border-zinc-800 shrink-0"
                      />
                    )}
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="text-sm font-editorial font-bold text-white truncate">
                        {request.productName}
                      </h4>
                      <div className="text-xs font-mono text-zinc-400">
                        <span>{t.exchangeCurrentPiece}: </span>
                        <strong className="text-zinc-200">{request.originalSize}</strong>{' '}
                        {request.originalColor && `• ${request.originalColor}`}
                      </div>
                    </div>
                  </div>

                  {/* Required Replacement */}
                  <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-2 shrink-0">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase block">
                        {t.exchangeRequestedPiece}
                      </span>
                      <strong className="text-xs font-mono font-bold text-amber-400">
                        {request.requestedSize || request.requestedColor || t.exchangeRefundAmount}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reason & Customer Notes */}
              <div className="p-3.5 bg-zinc-900/70 border border-zinc-800/80 rounded-xl space-y-1.5">
                <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                  {t.adminExchangeReason}
                </span>
                <p className="text-xs text-zinc-200 font-medium">{request.reason}</p>
                {request.customerNotes && (
                  <div className="mt-2 p-2 bg-zinc-950/80 rounded-lg border border-zinc-800/80 text-xs text-zinc-300 italic">
                    "{request.customerNotes}"
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: 3 Proof Photo Cards + Status Action (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Attached Proof Images Gallery (All 3 slots explicitly displayed) */}
              <div className="p-3.5 bg-zinc-900/70 border border-zinc-800/80 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t.adminExchangeProofGallery}</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {[tagPhotoUrl, invoicePhotoUrl, defectPhotoUrl].filter(Boolean).length}/3 صور
                  </span>
                </div>

                {/* 3 Dedicated Slots */}
                <div className="grid grid-cols-3 gap-2">
                  {proofSlots.map((slot, idx) => {
                    const Icon = slot.icon;
                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-zinc-800 bg-zinc-950 p-2 flex flex-col justify-between space-y-1.5"
                      >
                        <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-zinc-300 truncate">
                          <Icon className={`w-3 h-3 ${slot.iconColor} shrink-0`} />
                          <span className="truncate">{slot.title}</span>
                        </div>

                        {slot.url ? (
                          <div
                            onClick={() => setActiveLightboxImg({ url: slot.url!, title: slot.title })}
                            className="relative group aspect-square rounded-lg overflow-hidden border border-zinc-800 bg-black/60 cursor-pointer"
                          >
                            <img
                              src={slot.url}
                              alt={slot.title}
                              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                              <ZoomIn className="w-4 h-4 text-amber-400" />
                            </div>
                          </div>
                        ) : (
                          <div className="aspect-square rounded-lg border border-dashed border-zinc-800 bg-zinc-900/40 flex flex-col items-center justify-center p-1 text-center text-zinc-500">
                            <ImageOff className="w-4 h-4 mb-1 text-zinc-600" />
                            <span className="text-[9px] font-mono">غير مرفقة</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Direct Status Update & Admin Notes Panel */}
              <div className="p-3.5 bg-zinc-900/90 border border-zinc-700/80 rounded-xl space-y-3">
                <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider block">
                  {t.adminUpdateExchangeStatusTitle}
                </span>

                {/* Status Pills */}
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedStatus('APPROVED')}
                    className={`p-2 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      selectedStatus === 'APPROVED'
                        ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3 text-blue-400" />
                    <span>{t.adminApproveStatus}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedStatus('IN_TRANSIT')}
                    className={`p-2 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      selectedStatus === 'IN_TRANSIT'
                        ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <Truck className="w-3 h-3 text-purple-400" />
                    <span>{t.adminInTransitStatus}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedStatus('COMPLETED')}
                    className={`p-2 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      selectedStatus === 'COMPLETED'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{t.adminCompleteStatus}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedStatus('REJECTED')}
                    className={`p-2 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      selectedStatus === 'REJECTED'
                        ? 'bg-red-600 text-white border-red-500 shadow-sm'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <XCircle className="w-3 h-3 text-red-400" />
                    <span>{t.adminRejectStatus}</span>
                  </button>
                </div>

                {/* Admin Notes */}
                <div>
                  <textarea
                    rows={2}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder={t.adminCourierInstructionsPlaceholder}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Save Button */}
                <button
                  type="button"
                  onClick={handleSaveStatus}
                  disabled={isUpdating}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black rounded-xl text-xs font-mono font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>{t.adminConfirmUpdateStatus}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Lightbox Overlay */}
      {activeLightboxImg && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg animate-fade-in"
          onClick={() => setActiveLightboxImg(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between w-full text-white font-mono text-sm px-2">
              <span className="font-bold text-amber-400">{activeLightboxImg.title}</span>
              <button
                type="button"
                onClick={() => setActiveLightboxImg(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <img
              src={activeLightboxImg.url}
              alt={activeLightboxImg.title}
              className="max-w-full max-h-[80vh] object-contain rounded-xl border border-zinc-800 shadow-2xl"
            />
            <a
              href={activeLightboxImg.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
            >
              <span>فتح الصورة بجودتها الكاملة</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
