import React from 'react';
import { X, Phone, MessageSquare, MapPin, CreditCard, User, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Order } from '@/types';
import { useCurrency, useLanguage } from '@/shared';

interface AdminOrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
}

export const AdminOrderDetailsModal: React.FC<AdminOrderDetailsModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
}) => {
  const { formatPrice } = useCurrency();
  const { isRTL } = useLanguage();

  if (!order) return null;

  const phone = order.customerPhone || order.shippingAddress?.phone || '';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const waPhone = cleanPhone.startsWith('0') ? `2${cleanPhone}` : (cleanPhone.startsWith('20') ? cleanPhone : `20${cleanPhone}`);

  const customerName = order.customerName || `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim() || 'عميلنا العزيز';
  const waMessage = encodeURIComponent(
    `أهلاً بك يا ${customerName}، معك دار أزياء إيفل (EIFFEL Haute Couture).\n` +
    `نود تأكيد شحن طلبكم رقم (#${order.id}) بقيمة ${order.total || 0} ج.م.\n` +
    `العنوان: ${order.shippingAddress?.city || ''} - ${order.shippingAddress?.street || ''}.\n\n` +
    `يرجى الرد بتأكيد الشحن لتسليم الطلب لمندوب التوصيل فوراً.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-zinc-950 border border-zinc-800 w-full max-w-2xl overflow-hidden shadow-2xl p-6 space-y-5 rounded-xl">
        <div className="flex justify-between items-start pb-3 border-b border-zinc-800">
          <div>
            <span className="font-mono text-xs text-amber-400 font-bold">EIFFEL ORDER DETAILS</span>
            <h2 className="text-xl font-bold text-white mt-0.5">{order.id}</h2>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">تاريخ الطلب: {order.date}</p>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer & Direct Confirmation Actions */}
        <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-white font-bold">
              <User className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-sm">{customerName}</span>
            </div>
            {phone && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href={`tel:${phone}`}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded text-xs flex items-center gap-1.5 font-mono font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{phone}</span>
                </a>
                <a
                  href={`https://wa.me/${waPhone}?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-xs flex items-center gap-1.5 font-bold hover:bg-emerald-900 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>تأكيد عبر واتساب</span>
                </a>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-zinc-400 pt-1">
              <CreditCard className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{order.paymentMethod || 'الدفع عند الاستلام (كاش)'}</span>
            </div>
          </div>

          <div className="space-y-1 text-zinc-300">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-white block">{order.shippingAddress?.city || 'مصر'}</span>
                <span className="text-zinc-400 block">{order.shippingAddress?.street}</span>
                {order.shippingAddress?.apartment && (
                  <span className="text-zinc-500 block">شقة/ملاحظات: {order.shippingAddress?.apartment}</span>
                )}
                {(order.shippingAddress?.mapUrl || (order.shippingAddress?.latitude && order.shippingAddress?.longitude)) && (
                  <a
                    href={order.shippingAddress.mapUrl || `https://maps.google.com/?q=${order.shippingAddress.latitude},${order.shippingAddress.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[11px] font-mono mt-1 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>📍 موقع العميل على Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Selector & 1-Click Confirm Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-300 font-bold">{isRTL ? 'حالة الطلب الحالية:' : 'Status:'}</span>
            <select
              value={order.status}
              onChange={(e) => onUpdateStatus(order.id, e.target.value as any)}
              className="bg-zinc-900 border border-zinc-700 text-white text-xs px-3 py-1.5 rounded focus:outline-none focus:border-amber-400 font-bold"
            >
              <option value="Awaiting_Confirmation">📞 في انتظار التأكيد (Awaiting Confirmation)</option>
              <option value="Confirmed">✅ تم التأكيد من العميل (Confirmed)</option>
              <option value="Pending">⏳ قيد الانتظار (Pending)</option>
              <option value="Processing">📦 جاري التجهيز (Processing)</option>
              <option value="Shipped">🚚 خرج للتوصيل (Shipped)</option>
              <option value="Delivered">✓ تم التسليم بنجاح (Delivered)</option>
              <option value="Cancelled">✕ ملغي / لم يرد (Cancelled)</option>
              <option value="Returned">↩ مرتجع (Returned)</option>
            </select>
          </div>

          {order.status !== 'Confirmed' && order.status !== 'Shipped' && order.status !== 'Delivered' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'Confirmed' as any)}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تأكيد الطلب وشحنه للعميل</span>
            </button>
          )}
        </div>

        {/* Ordered Items */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          <span className="text-xs text-zinc-400 font-bold block mb-1">{isRTL ? 'المنتجات المطلوبة:' : 'Ordered Items:'}</span>
          {order.items?.map((it, idx) => {
            const colorObj = it?.product?.colors?.find(c => c && c.name && c.name.toLowerCase() === (it.selectedColor || '').toLowerCase());
            const img = colorObj?.image || it?.product?.images?.[0] || 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop';
            return (
              <div key={idx} className="flex items-center gap-3 p-2.5 bg-zinc-900/80 border border-zinc-800 rounded">
                <img src={img} alt="" className="w-12 h-14 object-cover rounded bg-zinc-950" />
                <div className="flex-1 text-xs">
                  <h4 className="font-bold text-white">{it?.product?.name || 'Product'}</h4>
                  <p className="text-zinc-400 font-mono mt-0.5">
                    اللون: {it.selectedColor} | المقاس: {it.selectedSize} | الكمية: {it.quantity}
                  </p>
                </div>
                <span className="font-mono font-bold text-white text-xs">
                  {formatPrice((it?.product?.price || 0) * it.quantity)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Total & Summary */}
        <div className="pt-3 border-t border-zinc-800 flex justify-between items-center font-mono">
          <span className="text-xs text-zinc-400">إجمالي المبلغ المطلوب كاش:</span>
          <span className="text-base font-bold text-emerald-400">{formatPrice(order.total || 0)}</span>
        </div>
      </div>
    </div>
  );
};
