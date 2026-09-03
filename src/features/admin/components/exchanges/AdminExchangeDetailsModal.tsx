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
  ArrowRightLeft
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

  // Proof Images array
  const proofImagesList = [
    {
      type: 'invoice',
      title: t.adminInvoicePhotoTitle,
      icon: FileText,
      iconColor: 'text-blue-400',
      url: request.invoiceImageUrl,
    },
    {
      type: 'tag',
      title: t.adminTagPhotoTitle,
      icon: Tag,
      iconColor: 'text-amber-400',
      url: request.tagImageUrl || request.proofImageUrl,
    },
    {
      type: 'defect',
      title: t.adminDefectPhotoTitle,
      icon: AlertTriangle,
      iconColor: 'text-red-400',
      url: request.defectImageUrl,
    },
  ].filter((img) => Boolean(img.url));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative bg-zinc-950 border border-zinc-800 w-full max-w-3xl overflow-hidden shadow-2xl rounded-2xl my-auto text-white">
        {/* Top Gold Accent Bar */}
        <div className="h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 flex items-start justify-between border-b border-zinc-800">
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
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Customer Info & WhatsApp Communication */}
          <div className="p-4 bg-zinc-900/70 border border-zinc-800/80 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-2">
              <div className="font-bold text-sm text-white">{customerName}</div>
              {request.customerEmail && (
                <div className="text-zinc-400 text-[11px]">{request.customerEmail}</div>
              )}
              {phone && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href={`tel:${phone}`}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-lg text-xs flex items-center gap-1.5 font-bold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{phone}</span>
                  </a>
                  <a
                    href={`https://wa.me/${waPhone}?text=${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-700/80 hover:bg-emerald-900 rounded-lg text-xs flex items-center gap-1.5 font-bold transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{t.adminDirectWhatsAppContact}</span>
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-1 text-zinc-300 md:border-r md:border-zinc-800 md:pr-4">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 min-w-0">
                  <strong className="text-white block">{request.pickupCity || 'القاهرة'}</strong>
                  <span className="text-zinc-400 text-xs block break-words">
                    {request.pickupAddress || 'عنوان الشحن المستلم'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Exchanged Item & Replacement Details */}
          <div className="p-4 bg-zinc-900/70 border border-zinc-800/80 rounded-xl space-y-3">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
              {t.exchangeItem}
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {request.productImage && (
                  <img
                    src={request.productImage}
                    alt={request.productName}
                    className="w-16 h-20 object-cover rounded-xl border border-zinc-800 shrink-0"
                  />
                )}
                <div className="space-y-1 min-w-0">
                  <h4 className="text-base font-editorial font-bold text-white">
                    {request.productName}
                  </h4>
                  <div className="text-xs font-mono text-zinc-400">
                    <span>{t.exchangeCurrentPiece}: </span>
                    <strong className="text-zinc-200">{request.originalSize}</strong>{' '}
                    {request.originalColor && `• ${request.originalColor}`}
                  </div>
                </div>
              </div>

              {/* Required Action / Replacement */}
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-3 sm:self-center">
                <ArrowRightLeft className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">
                    {t.exchangeRequestedPiece}
                  </span>
                  <strong className="text-xs font-mono font-bold text-amber-400">
                    {request.requestedSize || request.requestedColor || t.exchangeRefundAmount}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Reason & Customer Notes */}
          <div className="p-4 bg-zinc-900/70 border border-zinc-800/80 rounded-xl space-y-2">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
              {t.adminExchangeReason}
            </span>
            <p className="text-xs text-zinc-200 font-medium">{request.reason}</p>
            {request.customerNotes && (
              <div className="mt-2 p-2.5 bg-zinc-950/80 rounded-lg border border-zinc-800/80 text-xs text-zinc-300 italic">
                "{request.customerNotes}"
              </div>
            )}
          </div>

          {/* Section 4: Attached Proof Images Gallery (Invoice, Tag, Defect) */}
          <div className="p-4 bg-zinc-900/70 border border-zinc-800/80 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>{t.adminExchangeProofGallery}</span>
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                {proofImagesList.length} {t.uploadedStatus || 'صور'}
              </span>
            </div>

            {proofImagesList.length === 0 ? (
              <div className="p-6 text-center text-zinc-500 text-xs font-mono border border-dashed border-zinc-800 rounded-xl">
                {t.adminNoProofPhotos}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {proofImagesList.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="group relative rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 space-y-2 hover:border-zinc-600 transition-all shadow-md"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-300">
                        <Icon className={`w-3.5 h-3.5 ${item.iconColor}`} />
                        <span className="truncate">{item.title}</span>
                      </div>

                      <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-850 bg-black/60 cursor-pointer">
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={() => setActiveLightboxImg({ url: item.url!, title: item.title })}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 text-xs font-bold text-white transition-opacity"
                        >
                          <ZoomIn className="w-4 h-4 text-amber-400" />
                          <span>{t.adminClickToEnlarge}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 5: Direct Status Update & Admin Notes */}
          <div className="p-4 bg-zinc-900/90 border border-zinc-700/80 rounded-xl space-y-4">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
              {t.adminUpdateExchangeStatusTitle}
            </span>

            {/* Status Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setSelectedStatus('APPROVED')}
                className={`p-2.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedStatus === 'APPROVED'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-1 ring-blue-400'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>{t.adminApproveStatus}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus('IN_TRANSIT')}
                className={`p-2.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedStatus === 'IN_TRANSIT'
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md ring-1 ring-purple-400'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                }`}
              >
                <Truck className="w-3.5 h-3.5 text-purple-400" />
                <span>{t.adminInTransitStatus}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus('COMPLETED')}
                className={`p-2.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedStatus === 'COMPLETED'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-1 ring-emerald-400'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.adminCompleteStatus}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus('REJECTED')}
                className={`p-2.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedStatus === 'REJECTED'
                    ? 'bg-red-600 text-white border-red-500 shadow-md ring-1 ring-red-400'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                }`}
              >
                <XCircle className="w-3.5 h-3.5 text-red-400" />
                <span>{t.adminRejectStatus}</span>
              </button>
            </div>

            {/* Admin Notes */}
            <div>
              <label className="block text-[11px] font-mono font-bold text-zinc-400 mb-1.5">
                {t.adminNotesCustomerVisible}
              </label>
              <textarea
                rows={2}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder={t.adminCourierInstructionsPlaceholder}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-mono font-bold text-zinc-400 hover:text-white cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleSaveStatus}
                disabled={isUpdating}
                className="px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black rounded-xl text-xs font-mono font-bold shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>{t.adminConfirmUpdateStatus}</span>
              </button>
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
              <span>فتح الصورة في نافذة جديدة</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
