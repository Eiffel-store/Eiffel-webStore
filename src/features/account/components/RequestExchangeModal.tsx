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
  HelpCircle
} from 'lucide-react';
import { Order, CartItem, ExchangeType, ExchangeRequest } from '@/types';
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
  const { isRTL } = useLanguage();
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
  const [isUploading, setIsUploading] = useState<boolean>(false);
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

  if (!isOpen) return null;

  // Map of all previous requests (Pending, Approved, In Transit, Completed, Rejected)
  const allRequestsMap = new Map<string, ExchangeRequest>();
  existingRequests.forEach((r) => allRequestsMap.set(r.productId, r));

  const allItemsDisabled = items.length > 0 && items.every((it) => allRequestsMap.has(it.product?.id));
  const currentItem: CartItem | undefined = items[selectedItemIndex] || items[0];
  const product = currentItem?.product;
  const isCurrentItemDisabled = currentItem ? allRequestsMap.has(currentItem.product?.id) : false;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      if (res?.fileUrl) {
        setProofImageUrl(res.fileUrl);
        toast.success(isRTL ? 'تم رفع الصورة بنجاح' : 'Image uploaded successfully');
      }
    } catch {
      toast.error(isRTL ? 'فشل رفع الصورة، يرجى المحاولة مرة أخرى' : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentItem) {
      toast.error(isRTL ? 'يرجى اختيار القطعة المراد استبدالها' : 'Please select an item');
      return;
    }

    if (isCurrentItemDisabled) {
      toast.error(
        isRTL
          ? 'تم تقديم طلب لهذه القطعة مسبقاً. يرجى التواصل مع خدمة العملاء لأي استفسار.'
          : 'A request has already been submitted for this item.'
      );
      return;
    }

    if (requestType === 'EXCHANGE_SIZE' && !requestedSize.trim()) {
      toast.error(isRTL ? 'يرجى تحديد المقاس البديل المطلوب' : 'Please select a replacement size');
      return;
    }

    if (!pickupAddress.trim() || !customerPhone.trim()) {
      toast.error(isRTL ? 'يرجى تأكيد عنوان الاستلام ورقم الهاتف' : 'Please provide pickup address & phone');
      return;
    }

    setIsSubmitting(true);
    try {
      await exchangeService.create({
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
        proofImageUrl,
        pickupAddress: pickupAddress.trim(),
        pickupCity: pickupCity.trim(),
        status: 'PENDING',
      });

      toast.success(
        isRTL
          ? 'تم إرسال طلب الاستبدال بنجاح! سيتواصل معك فريق خدمة العملاء.'
          : 'Exchange request submitted successfully! We will contact you soon.'
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          (isRTL ? 'حدث خطأ أثناء تقديم الطلب' : 'Failed to submit exchange request')
      );
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
            <span>{isRTL ? 'طلب قيد المراجعة' : 'Pending Review'}</span>
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>{isRTL ? 'تمت الموافقة' : 'Approved'}</span>
          </span>
        );
      case 'IN_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
            <Truck className="w-2.5 h-2.5" />
            <span>{isRTL ? 'جاري الاستبدال' : 'In Transit'}</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>{isRTL ? 'تم الاستبدال بنجاح' : 'Completed'}</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
            <XCircle className="w-2.5 h-2.5" />
            <span>{isRTL ? 'تم رفض الطلب' : 'Rejected'}</span>
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
                {isRTL ? 'طلب استبدال / إرجاع' : 'Request Exchange / Return'}
              </h3>
              <p className="text-xs font-mono text-secondary dark:text-zinc-400">
                {isRTL ? `للطلب رقم #${order.id}` : `For Order #${order.id}`}
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
                  {isRTL ? 'تم تقديم طلبات لجميع قطع هذا الطلب مسبقاً' : 'All Items Have Previous Requests'}
                </strong>
                <span className="text-zinc-400">
                  {isRTL
                    ? 'تم تسجيل طلبات استبدال/استرجاع لقطع هذا الطلب بالفعل. لا يمكن تقديم طلبات مكررة. للاستفسار أو طلب المساعدة، يرجى التواصل مع فريق خدمة العملاء.'
                    : 'Exchange/return requests have already been submitted for all items in this order. For further inquiries, please contact support.'}
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
                <span>{isRTL ? 'التواصل مع خدمة العملاء عبر الواتساب ↗' : 'Contact Customer Support on WhatsApp ↗'}</span>
              </a>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Step 1: Select Item to Exchange */}
          <div className="space-y-2">
            <label className="block text-xs font-label-bold uppercase tracking-wider text-primary dark:text-white">
              {isRTL ? '1. اختر القطعة المراد استبدالها:' : '1. Select Item to Exchange:'}
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
                        {isRTL ? 'المقاس الحالي:' : 'Current:'} <strong className="text-primary dark:text-white">{it.selectedSize || 'M'}</strong>
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
              {isRTL ? '2. نوع الطلب:' : '2. Request Type:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              {[
                { type: 'EXCHANGE_SIZE', labelAr: 'استبدال مقاس', labelEn: 'Change Size' },
                { type: 'EXCHANGE_COLOR', labelAr: 'استبدال لون', labelEn: 'Change Color' },
                { type: 'DEFECT', labelAr: 'عيب صناعة', labelEn: 'Defective Item' },
                { type: 'RETURN_REFUND', labelAr: 'إرجاع واسترداد', labelEn: 'Return & Refund' },
              ].map((t) => (
                <button
                  key={t.type}
                  type="button"
                  disabled={allItemsDisabled || isCurrentItemDisabled}
                  onClick={() => setRequestType(t.type as ExchangeType)}
                  className={`py-2 px-3 rounded-lg border text-center font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    requestType === t.type
                      ? 'bg-primary text-white dark:bg-white dark:text-black border-primary dark:border-white shadow-sm'
                      : 'border-surface-container dark:border-zinc-800 text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white'
                  }`}
                >
                  {isRTL ? t.labelAr : t.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Requested Size / Color based on type */}
          {requestType === 'EXCHANGE_SIZE' && (
            <div className="p-4 bg-surface-container-lowest dark:bg-zinc-900/50 border border-surface-container dark:border-zinc-800 rounded-xl space-y-2">
              <label className="block text-xs font-label-bold text-primary dark:text-white">
                {isRTL ? 'المقاس البديل المطلوب:' : 'Required Replacement Size:'}
              </label>
              <div className="flex flex-wrap gap-2">
                {((product?.sizes as string[] | undefined) || ['S', 'M', 'L', 'XL', '2XL', '3XL']).map((sz: string) => (
                  <button
                    key={sz}
                    type="button"
                    disabled={allItemsDisabled || isCurrentItemDisabled}
                    onClick={() => setRequestedSize(sz)}
                    className={`w-10 h-10 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                      requestedSize === sz
                        ? 'bg-amber-500 text-white border-amber-500 shadow'
                        : 'border-surface-container dark:border-zinc-700 text-primary dark:text-white hover:border-amber-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {requestType === 'EXCHANGE_COLOR' && (
            <div className="p-4 bg-surface-container-lowest dark:bg-zinc-900/50 border border-surface-container dark:border-zinc-800 rounded-xl space-y-2">
              <label className="block text-xs font-label-bold text-primary dark:text-white">
                {isRTL ? 'اللون البديل المطلوب:' : 'Required Replacement Color:'}
              </label>
              <input
                type="text"
                disabled={allItemsDisabled || isCurrentItemDisabled}
                value={requestedColor}
                onChange={(e) => setRequestedColor(e.target.value)}
                placeholder={isRTL ? 'مثال: أسود، أزرق داكن، بيج...' : 'e.g. Navy, Black, Beige...'}
                className="w-full bg-white dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 rounded-lg p-2.5 text-xs text-primary dark:text-white focus:outline-none focus:border-primary dark:focus:border-white disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>
          )}

          {/* Step 4: Reason & Notes */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-label-bold uppercase tracking-wider text-primary dark:text-white mb-1.5">
                {isRTL ? 'سبب الاستبدال / الإرجاع:' : 'Reason for Exchange / Return:'}
              </label>
              <select
                disabled={allItemsDisabled || isCurrentItemDisabled}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 rounded-lg p-2.5 text-xs text-primary dark:text-white focus:outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="المقاس غير ملائم (أصغر أو أكبر من المطلوب)">
                  {isRTL ? 'المقاس غير ملائم (أصغر أو أكبر من المطلوب)' : 'Size does not fit (too small or too big)'}
                </option>
                <option value="اللون أو الموديل مختلف عن التوقعات">
                  {isRTL ? 'اللون أو الموديل مختلف عن التوقعات' : 'Color or style different from expectations'}
                </option>
                <option value="يوجد عيب أو تلف في القطعة">
                  {isRTL ? 'يوجد عيب أو تلف في القطعة' : 'Defect or damage found on item'}
                </option>
                <option value="تم استلام قطعة مختلفة عن الطلب">
                  {isRTL ? 'تم استلام قطعة مختلفة عن الطلب' : 'Received incorrect item'}
                </option>
                <option value="أخرى">
                  {isRTL ? 'سبب آخر (سأوضحه في الملاحظات)' : 'Other reason (detailed below)'}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-label-bold text-secondary dark:text-zinc-400 mb-1">
                {isRTL ? 'ملاحظات إضافية للتوضيح (اختياري):' : 'Additional Notes (Optional):'}
              </label>
              <textarea
                rows={2}
                disabled={allItemsDisabled || isCurrentItemDisabled}
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder={isRTL ? 'اكتب أي تفاصيل إضافية تود إبلاغ المندوب أو خدمة العملاء بها...' : 'Any details for customer support...'}
                className="w-full bg-white dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 rounded-lg p-2.5 text-xs text-primary dark:text-white focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Step 5: Proof Photo (Optional) */}
          <div className="p-4 bg-surface-container-lowest dark:bg-zinc-900/50 border border-dashed border-surface-container dark:border-zinc-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-label-bold text-primary dark:text-white flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-amber-500" />
                <span>{isRTL ? 'صورة للقطعة مع التيكت (اختياري):' : 'Photo of Item with Tags (Optional):'}</span>
              </label>
              {proofImageUrl && (
                <span className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {isRTL ? 'تم الرفع بنجاح' : 'Uploaded'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <label className={`px-4 py-2 bg-surface-container dark:bg-zinc-800 hover:bg-surface-container-high text-primary dark:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${allItemsDisabled || isCurrentItemDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-amber-500" /> : <Upload className="w-4 h-4" />}
                <span>{isUploading ? (isRTL ? 'جاري الرفع...' : 'Uploading...') : (isRTL ? 'اختيار صورة' : 'Choose Photo')}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading || allItemsDisabled || isCurrentItemDisabled} className="hidden" />
              </label>
              {proofImageUrl && (
                <img src={proofImageUrl} alt="Proof" className="w-10 h-10 object-cover rounded-lg border border-zinc-700" />
              )}
            </div>
          </div>

          {/* Step 6: Pickup Address & Phone */}
          <div className="space-y-3 pt-2 border-t border-surface-container dark:border-zinc-800">
            <h4 className="text-xs font-label-bold uppercase tracking-wider text-primary dark:text-white">
              {isRTL ? 'بيانات الاستلام والتسليم مع مندوب الشحن:' : 'Pickup & Exchange Contact Details:'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-secondary dark:text-zinc-400 mb-1">
                  {isRTL ? 'رقم الهاتف للتواصل:' : 'Contact Phone:'}
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
                  {isRTL ? 'المدينة / المحافظة:' : 'City / Governorate:'}
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
                  {isRTL ? 'عنوان تسليم واستلام القطعة:' : 'Pickup Street Address:'}
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
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isUploading || allItemsDisabled || isCurrentItemDisabled}
              className="px-6 py-2.5 bg-primary text-white dark:bg-white dark:text-black hover:opacity-90 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>{isRTL ? 'تأكيد وإرسال طلب الاستبدال' : 'Submit Exchange Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
