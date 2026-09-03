import React, { useState, useEffect } from 'react';
import {
  X,
  RefreshCw,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  Truck,
  HelpCircle,
  FileText,
  Tag,
  AlertTriangle,
  Trash2,
  Camera
} from 'lucide-react';
import { Order, CartItem, ExchangeType, ExchangeRequest, ProductColor } from '@/types';
import { useLanguage } from '@/shared';
import { exchangeService } from '@/services/exchangeService';
import { uploadService } from '@/services/uploadService';
import toast from 'react-hot-toast';

interface RequestExchangeModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RequestExchangeModal: React.FC<RequestExchangeModalProps> = ({
  order,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useLanguage();
  const items = order?.items || [];

  const [existingRequests, setExistingRequests] = useState<ExchangeRequest[]>([]);
  const [isLoadingExisting, setIsLoadingExisting] = useState<boolean>(true);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const [requestType, setRequestType] = useState<ExchangeType>('EXCHANGE_SIZE');
  const [requestedSize, setRequestedSize] = useState<string>('');
  const [requestedColor, setRequestedColor] = useState<string>('');
  const [reason, setReason] = useState<string>('المقاس غير ملائم (أصغر أو أكبر من المطلوب)');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [proofImageUrl, setProofImageUrl] = useState<string>('');
  const [invoiceImageUrl, setInvoiceImageUrl] = useState<string>('');
  const [tagImageUrl, setTagImageUrl] = useState<string>('');
  const [defectImageUrl, setDefectImageUrl] = useState<string>('');
  const [uploadingSlot, setUploadingSlot] = useState<'invoice' | 'tag' | 'defect' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [pickupAddress, setPickupAddress] = useState<string>(
    order.shippingAddress?.street || ''
  );
  const [pickupCity, setPickupCity] = useState<string>(order.shippingAddress?.city || 'Cairo');
  const [customerPhone, setCustomerPhone] = useState<string>(
    order.shippingAddress?.phone || order.customerPhone || ''
  );

  // Fetch existing requests for this order to permanently block already requested products (anti-spam)
  useEffect(() => {
    if (isOpen && order?.id) {
      setIsLoadingExisting(true);
      exchangeService
        .getByOrderId(order.id)
        .then((res) => {
          setExistingRequests(res || []);
          // Auto select first item that has no previous request
          const requestedProductIds = new Set((res || []).map((r) => r.productId));
          const firstAvailableIdx = items.findIndex((it) => !requestedProductIds.has(it.product?.id));
          if (firstAvailableIdx !== -1) {
            setSelectedItemIndex(firstAvailableIdx);
          }
        })
        .catch(() => setExistingRequests([]))
        .finally(() => setIsLoadingExisting(false));
    }
  }, [isOpen, order?.id, items]);

  // Reset selected size / color when switching item or type
  useEffect(() => {
    setRequestedSize('');
    setRequestedColor('');
  }, [selectedItemIndex, requestType]);

  if (!isOpen) return null;

  // Map of all previous requests (Pending, Approved, In Transit, Completed, Rejected)
  const allRequestsMap = new Map<string, ExchangeRequest>();
  existingRequests.forEach((r) => allRequestsMap.set(r.productId, r));

  const allItemsDisabled = items.length > 0 && items.every((it) => allRequestsMap.has(it.product?.id));
  const currentItem: CartItem | undefined = items[selectedItemIndex] || items[0];
  const product = currentItem?.product;
  const isCurrentItemDisabled = currentItem ? allRequestsMap.has(currentItem.product?.id) : false;

  // Filter out the purchased size and purchased color
  const purchasedSize = (currentItem?.selectedSize || '').trim().toUpperCase();
  const rawSizes = (product?.sizes && product.sizes.length > 0)
    ? product.sizes
    : ['S', 'M', 'L', 'XL', '2XL', '3XL'];
  const suggestedSizes = rawSizes.filter(
    (sz) => sz.trim().toUpperCase() !== purchasedSize
  );

  const purchasedColor = (currentItem?.selectedColor || '').trim().toLowerCase();
  const rawColors: ProductColor[] = (product?.colors && product.colors.length > 0)
    ? product.colors
    : [
        { name: 'أسود', hex: '#0a0a0a' },
        { name: 'أبيض', hex: '#f8fafc' },
        { name: 'بيج', hex: '#d4b996' },
        { name: 'رمادي', hex: '#64748b' },
        { name: 'كحلي', hex: '#1e293b' },
        { name: 'زيتي', hex: '#3f4f38' },
      ];
  const suggestedColors = rawColors.filter((c) => {
    const cName = (c.name || '').trim().toLowerCase();
    return cName !== purchasedColor;
  });

  const handleSlotUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    slot: 'invoice' | 'tag' | 'defect'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSlot(slot);
    try {
      const res = await uploadService.uploadImage(file);
      if (res?.fileUrl) {
        if (slot === 'invoice') setInvoiceImageUrl(res.fileUrl);
        if (slot === 'tag') setTagImageUrl(res.fileUrl);
        if (slot === 'defect') setDefectImageUrl(res.fileUrl);
        // also keep proofImageUrl synced
        setProofImageUrl(res.fileUrl);
        toast.success(t.imageUploadedSuccess);
      }
    } catch {
      toast.error(t.imageUploadFailed);
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleRemoveSlot = (slot: 'invoice' | 'tag' | 'defect') => {
    if (slot === 'invoice') setInvoiceImageUrl('');
    if (slot === 'tag') setTagImageUrl('');
    if (slot === 'defect') setDefectImageUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentItem) {
      toast.error(t.pleaseSelectItemToExchange);
      return;
    }

    if (isCurrentItemDisabled) {
      toast.error(t.exchangeItemAlreadySubmitted);
      return;
    }

    if (requestType === 'EXCHANGE_SIZE' && !requestedSize.trim()) {
      toast.error(t.pleaseSelectReplacementSize);
      return;
    }

    if (!pickupAddress.trim() || !customerPhone.trim()) {
      toast.error(t.pleaseProvidePickupAddressPhone);
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await exchangeService.create({
        orderId: order.id,
        customerName: order.customerName || 'Customer',
        customerEmail: order.customerEmail || '',
        customerPhone: customerPhone.trim(),
        productId: product?.id || 'UNKNOWN',
        productName: product?.name || 'Item',
        productImage: product?.images?.[0] || '',
        originalSize: currentItem.selectedSize || 'M',
        originalColor: currentItem.selectedColor || 'Standard',
        requestedSize: requestType === 'EXCHANGE_SIZE' ? requestedSize : undefined,
        requestedColor: requestType === 'EXCHANGE_COLOR' ? requestedColor : undefined,
        requestType,
        reason: reason.trim(),
        customerNotes: customerNotes.trim(),
        proofImageUrl: tagImageUrl || invoiceImageUrl || defectImageUrl || proofImageUrl,
        invoiceImageUrl: invoiceImageUrl || undefined,
        tagImageUrl: tagImageUrl || undefined,
        defectImageUrl: defectImageUrl || undefined,
        pickupAddress: pickupAddress.trim(),
        pickupCity: pickupCity.trim(),
        status: 'PENDING',
      });

      try {
        const bc = new BroadcastChannel('eiffel-sync');
        bc.postMessage({
          type: 'EXCHANGE_CREATED',
          payload: {
            id: created?.id,
            orderId: order.id,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerPhone: customerPhone.trim(),
            productName: product?.name,
            reason: reason.trim(),
            type: requestType,
            requestedSize,
            status: 'PENDING',
          },
        });
        bc.close();
      } catch {
        // ignore
      }

      toast.success(t.exchangeSubmittedSuccess);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        t.exchangeSubmissionFailed;
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderItemStatusBadge = (req: ExchangeRequest) => {
    switch (req.status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            <Clock className="w-2.5 h-2.5" />
            <span>{t.exchangeStatusPending}</span>
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>{t.exchangeStatusApproved}</span>
          </span>
        );
      case 'IN_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
            <Truck className="w-2.5 h-2.5" />
            <span>{t.exchangeStatusInTransit}</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>{t.exchangeStatusCompleted}</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
            <XCircle className="w-2.5 h-2.5" />
            <span>{t.exchangeStatusRejected}</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-zinc-950 border border-surface-container dark:border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-container dark:border-zinc-800 bg-surface-container-low dark:bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 dark:bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-editorial text-base sm:text-lg font-bold text-primary dark:text-white">
                {t.requestExchangeReturn}
              </h3>
              <p className="text-xs font-mono text-secondary dark:text-zinc-400">
                {`${t.requestExchangeOrderPrefix}${order.id}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-secondary hover:text-primary dark:text-zinc-400 dark:hover:text-white rounded-lg hover:bg-surface-container dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* All Items Processed Anti-Spam Notice */}
        {allItemsDisabled && !isLoadingExisting && (
          <div className="mx-6 mt-6 p-4 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-mono space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <strong className="font-bold text-white block mb-0.5">
                  {t.allOrderItemsRequested}
                </strong>
                <span className="text-zinc-400">
                  {t.allOrderItemsRequestedDesc}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800">
              <a
                href="https://wa.me/201011122334"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:underline"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{t.contactCustomerSupportWhatsApp}</span>
              </a>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Step 1: Select Item to Exchange */}
          <div className="space-y-2">
            <label className="block text-xs font-label-bold uppercase tracking-wider text-primary dark:text-white">
              {t.selectItemToExchange}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map((it, idx) => {
                const isSelected = selectedItemIndex === idx;
                const existingReq = allRequestsMap.get(it.product?.id);
                const isDisabled = Boolean(existingReq);
                const img = it?.product?.images?.[0] || 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop';

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (!isDisabled) setSelectedItemIndex(idx);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isDisabled
                        ? 'opacity-65 bg-zinc-100 dark:bg-zinc-900/40 border-zinc-300 dark:border-zinc-800 cursor-not-allowed'
                        : isSelected
                        ? 'border-primary dark:border-white bg-surface-container-low dark:bg-zinc-900 shadow-md ring-1 ring-primary dark:ring-white cursor-pointer'
                        : 'border-surface-container dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 cursor-pointer'
                    }`}
                  >
                    <img src={img} alt="Product" className="w-12 h-14 object-cover rounded-lg shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-editorial text-sm text-primary dark:text-white truncate">
                        {it?.product?.name || 'Product'}
                      </h5>
                      <p className="text-[11px] font-mono text-secondary dark:text-zinc-400 mt-0.5">
                        {t.currentSize} <strong className="text-primary dark:text-white">{it.selectedSize || 'M'}</strong>
                        {it.selectedColor ? ` • ${it.selectedColor}` : ''}
                      </p>

                      {/* Status Badge if already has request */}
                      {existingReq && (
                        <div className="mt-1.5">
                          {renderItemStatusBadge(existingReq)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Request Type */}
          <div className="space-y-2">
            <label className="block text-xs font-label-bold uppercase tracking-wider text-primary dark:text-white">
              {t.exchangeRequestType}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              {[
                { type: 'EXCHANGE_SIZE', label: t.exchangeTypeSize },
                { type: 'EXCHANGE_COLOR', label: t.exchangeTypeColor },
                { type: 'DEFECT', label: t.exchangeTypeDefect },
                { type: 'RETURN_REFUND', label: t.exchangeTypeRefund },
              ].map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  disabled={allItemsDisabled || isCurrentItemDisabled}
                  onClick={() => setRequestType(opt.type as ExchangeType)}
                  className={`py-2 px-3 rounded-lg border text-center font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    requestType === opt.type
                      ? 'bg-primary text-white dark:bg-white dark:text-black border-primary dark:border-white shadow-sm'
                      : 'border-surface-container dark:border-zinc-800 text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Requested Size / Color based on type */}
          {requestType === 'EXCHANGE_SIZE' && (
            <div className="p-4 bg-surface-container-lowest dark:bg-zinc-900/50 border border-surface-container dark:border-zinc-800 rounded-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="block text-xs font-label-bold text-primary dark:text-white">
                  {t.requiredReplacementSize}
                </label>
                {purchasedSize && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                    {t.currentSizeExcluded}: <strong className="text-amber-500 font-bold">{purchasedSize}</strong>
                  </span>
                )}
              </div>

              {suggestedSizes.length === 0 ? (
                <p className="text-xs font-mono text-zinc-500 py-2">
                  {t.noAlternativeSizesAvailable}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {suggestedSizes.map((sz: string) => (
                    <button
                      key={sz}
                      type="button"
                      disabled={allItemsDisabled || isCurrentItemDisabled}
                      onClick={() => setRequestedSize(sz)}
                      className={`min-w-[2.75rem] h-10 px-3 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                        requestedSize === sz
                          ? 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-500/30'
                          : 'border-surface-container dark:border-zinc-700 bg-white dark:bg-zinc-900 text-primary dark:text-white hover:border-amber-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {requestType === 'EXCHANGE_COLOR' && (
            <div className="p-4 bg-surface-container-lowest dark:bg-zinc-900/50 border border-surface-container dark:border-zinc-800 rounded-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="block text-xs font-label-bold text-primary dark:text-white">
                  {t.requiredReplacementColor}
                </label>
                {currentItem?.selectedColor && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                    {t.currentColorExcluded}: <strong className="text-amber-500 font-bold">{currentItem.selectedColor}</strong>
                  </span>
                )}
              </div>

              {/* Color chips */}
              {suggestedColors.length === 0 ? (
                <p className="text-xs font-mono text-zinc-500 py-2">
                  {t.noAlternativeColorsAvailable}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {suggestedColors.map((col, idx) => {
                    const isSelected = requestedColor === col.name;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={allItemsDisabled || isCurrentItemDisabled}
                        onClick={() => setRequestedColor(col.name)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 text-amber-500 dark:text-amber-400 shadow-sm ring-1 ring-amber-500/40'
                            : 'bg-white dark:bg-zinc-900 border-surface-container dark:border-zinc-700 text-primary dark:text-zinc-300 hover:border-zinc-500'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20 dark:border-white/20 shadow-inner shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Optional custom color input */}
              <div className="pt-2 border-t border-surface-container dark:border-zinc-800/80">
                <input
                  type="text"
                  disabled={allItemsDisabled || isCurrentItemDisabled}
                  value={requestedColor}
                  onChange={(e) => setRequestedColor(e.target.value)}
                  placeholder={t.orTypeCustomColor}
                  className="w-full bg-white dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 rounded-lg p-2.5 text-xs text-primary dark:text-white focus:outline-none focus:border-amber-400 disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          )}

          {/* Step 4: Reason & Notes */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-label-bold uppercase tracking-wider text-primary dark:text-white mb-1.5">
                {t.exchangeReasonLabel}
              </label>
              <select
                disabled={allItemsDisabled || isCurrentItemDisabled}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 rounded-lg p-2.5 text-xs text-primary dark:text-white focus:outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="المقاس غير ملائم (أصغر أو أكبر من المطلوب)">
                  {t.exchangeReasonSize}
                </option>
                <option value="اللون أو الموديل مختلف عن التوقعات">
                  {t.exchangeReasonColor}
                </option>
                <option value="يوجد عيب أو تلف في القطعة">
                  {t.exchangeReasonDefect}
                </option>
                <option value="تم استلام قطعة مختلفة عن الطلب">
                  {t.exchangeReasonWrong}
                </option>
                <option value="أخرى">
                  {t.exchangeReasonOther}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-label-bold text-secondary dark:text-zinc-400 mb-1">
                {t.additionalNotesOptional}
              </label>
              <textarea
                rows={2}
                disabled={allItemsDisabled || isCurrentItemDisabled}
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder={t.additionalNotesPlaceholder}
                className="w-full bg-white dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 rounded-lg p-2.5 text-xs text-primary dark:text-white focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Step 5: Proof Photos (Invoice, Tag, Defect) */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-label-bold uppercase tracking-wider text-primary dark:text-white flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-amber-500" />
                  <span>{t.adminExchangeProofGallery}</span>
                </label>
                <p className="text-[11px] text-secondary dark:text-zinc-400 font-mono mt-0.5">
                  {t.tagPhotoDesc}
                </p>
              </div>
              {/* Counter badge */}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                {[invoiceImageUrl, tagImageUrl, defectImageUrl].filter(Boolean).length}/3 {t.uploadedStatus || 'مرفوعة'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Slot 1: Invoice Photo */}
              <div className="p-3 bg-surface-container-lowest dark:bg-zinc-900/60 border border-dashed border-surface-container dark:border-zinc-800 rounded-xl flex flex-col justify-between space-y-2 hover:border-zinc-600 transition-all">
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-primary dark:text-white flex items-center gap-1.5 truncate">
                      <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{t.invoicePhoto}</span>
                    </span>
                    <p className="text-[10px] text-secondary dark:text-zinc-500 font-mono mt-0.5 line-clamp-1">
                      {t.invoicePhotoDesc}
                    </p>
                  </div>
                  {invoiceImageUrl && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot('invoice')}
                      className="p-1 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                      title={t.removePhoto}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {invoiceImageUrl ? (
                  <div className="relative group rounded-lg overflow-hidden border border-zinc-700 aspect-video bg-black/40">
                    <img src={invoiceImageUrl} alt="Invoice" className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 text-[11px] font-bold text-white transition-opacity cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{t.changePhoto}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSlotUpload(e, 'invoice')}
                        disabled={uploadingSlot !== null || allItemsDisabled || isCurrentItemDisabled}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className={`w-full py-4 border border-dashed border-zinc-700/80 hover:border-amber-500/60 rounded-lg flex flex-col items-center justify-center gap-1.5 text-xs text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white bg-zinc-950/40 transition-all ${allItemsDisabled || isCurrentItemDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
                    {uploadingSlot === 'invoice' ? (
                      <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                    ) : (
                      <Upload className="w-5 h-5 text-zinc-500" />
                    )}
                    <span className="text-[11px] font-mono font-bold">
                      {uploadingSlot === 'invoice' ? t.uploadingStatus : t.choosePhoto}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSlotUpload(e, 'invoice')}
                      disabled={uploadingSlot !== null || allItemsDisabled || isCurrentItemDisabled}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Slot 2: Product with Tag Photo */}
              <div className="p-3 bg-surface-container-lowest dark:bg-zinc-900/60 border border-dashed border-surface-container dark:border-zinc-800 rounded-xl flex flex-col justify-between space-y-2 hover:border-zinc-600 transition-all">
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-primary dark:text-white flex items-center gap-1.5 truncate">
                      <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{t.tagPhoto}</span>
                    </span>
                    <p className="text-[10px] text-secondary dark:text-zinc-500 font-mono mt-0.5 line-clamp-1">
                      {t.tagPhotoDesc}
                    </p>
                  </div>
                  {tagImageUrl && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot('tag')}
                      className="p-1 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                      title={t.removePhoto}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {tagImageUrl ? (
                  <div className="relative group rounded-lg overflow-hidden border border-zinc-700 aspect-video bg-black/40">
                    <img src={tagImageUrl} alt="Tag" className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 text-[11px] font-bold text-white transition-opacity cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{t.changePhoto}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSlotUpload(e, 'tag')}
                        disabled={uploadingSlot !== null || allItemsDisabled || isCurrentItemDisabled}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className={`w-full py-4 border border-dashed border-zinc-700/80 hover:border-amber-500/60 rounded-lg flex flex-col items-center justify-center gap-1.5 text-xs text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white bg-zinc-950/40 transition-all ${allItemsDisabled || isCurrentItemDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
                    {uploadingSlot === 'tag' ? (
                      <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                    ) : (
                      <Upload className="w-5 h-5 text-zinc-500" />
                    )}
                    <span className="text-[11px] font-mono font-bold">
                      {uploadingSlot === 'tag' ? t.uploadingStatus : t.choosePhoto}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSlotUpload(e, 'tag')}
                      disabled={uploadingSlot !== null || allItemsDisabled || isCurrentItemDisabled}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Slot 3: Defect Photo (Enhanced for DEFECT requestType) */}
              <div className={`p-3 bg-surface-container-lowest dark:bg-zinc-900/60 border border-dashed rounded-xl flex flex-col justify-between space-y-2 transition-all ${requestType === 'DEFECT' ? 'border-amber-500/50 ring-1 ring-amber-500/20' : 'border-surface-container dark:border-zinc-800 hover:border-zinc-600'}`}>
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-primary dark:text-white flex items-center gap-1.5 truncate">
                      <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${requestType === 'DEFECT' ? 'text-amber-400 animate-pulse' : 'text-zinc-400'}`} />
                      <span>{t.defectPhoto}</span>
                    </span>
                    <p className="text-[10px] text-secondary dark:text-zinc-500 font-mono mt-0.5 line-clamp-1">
                      {t.defectPhotoDesc}
                    </p>
                  </div>
                  {defectImageUrl && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot('defect')}
                      className="p-1 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                      title={t.removePhoto}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {defectImageUrl ? (
                  <div className="relative group rounded-lg overflow-hidden border border-zinc-700 aspect-video bg-black/40">
                    <img src={defectImageUrl} alt="Defect" className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 text-[11px] font-bold text-white transition-opacity cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{t.changePhoto}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSlotUpload(e, 'defect')}
                        disabled={uploadingSlot !== null || allItemsDisabled || isCurrentItemDisabled}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className={`w-full py-4 border border-dashed border-zinc-700/80 hover:border-amber-500/60 rounded-lg flex flex-col items-center justify-center gap-1.5 text-xs text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white bg-zinc-950/40 transition-all ${allItemsDisabled || isCurrentItemDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
                    {uploadingSlot === 'defect' ? (
                      <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                    ) : (
                      <Upload className="w-5 h-5 text-zinc-500" />
                    )}
                    <span className="text-[11px] font-mono font-bold">
                      {uploadingSlot === 'defect' ? t.uploadingStatus : t.choosePhoto}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSlotUpload(e, 'defect')}
                      disabled={uploadingSlot !== null || allItemsDisabled || isCurrentItemDisabled}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Step 6: Pickup Address & Phone */}
          <div className="space-y-3 pt-2 border-t border-surface-container dark:border-zinc-800">
            <h4 className="text-xs font-label-bold uppercase tracking-wider text-primary dark:text-white">
              {t.pickupDeliveryDetails}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-secondary dark:text-zinc-400 mb-1">
                  {t.pickupPhone}
                </label>
                <input
                  type="tel"
                  required
                  disabled={allItemsDisabled || isCurrentItemDisabled}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 rounded-lg p-2 text-primary dark:text-white font-mono disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-secondary dark:text-zinc-400 mb-1">
                  {t.pickupCityGov}
                </label>
                <input
                  type="text"
                  required
                  disabled={allItemsDisabled || isCurrentItemDisabled}
                  value={pickupCity}
                  onChange={(e) => setPickupCity(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 rounded-lg p-2 text-primary dark:text-white font-mono disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-secondary dark:text-zinc-400 mb-1">
                  {t.pickupAddress}
                </label>
                <input
                  type="text"
                  required
                  disabled={allItemsDisabled || isCurrentItemDisabled}
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 rounded-lg p-2 text-primary dark:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit Button */}
          <div className="pt-4 border-t border-surface-container dark:border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white cursor-pointer"
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              disabled={isSubmitting || uploadingSlot !== null || allItemsDisabled || isCurrentItemDisabled}
              className="px-6 py-2.5 bg-primary text-white dark:bg-white dark:text-black hover:opacity-90 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>{t.submitExchangeRequest}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
