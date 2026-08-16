import React from 'react';
import { Package, Printer, MapPin, Phone, CreditCard, User, Calendar, X } from 'lucide-react';
import { Order } from '@/types';
import { useLanguage, useCurrency } from '@/shared';

interface AdminOrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Order['status']) => void;
}

export const AdminOrderDetailsModal: React.FC<AdminOrderDetailsModalProps> = ({
  order,
  onClose,
  onUpdateStatus
}) => {
  const { isRTL } = useLanguage();
  const { formatPrice } = useCurrency();

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 max-w-2xl w-full p-6 space-y-6 shadow-2xl animate-fade-in max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-400" />
              <h3 className="font-editorial text-lg font-bold text-white tracking-wide">
                {isRTL ? `تفاصيل الطلب: ${order.id}` : `Order Details: ${order.id}`}
              </h3>
            </div>
            <div className="text-[11px] text-zinc-500 font-mono mt-0.5 flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <span>{order.date}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-mono flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isRTL ? 'طباعة الفاتورة' : 'Print Slip'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Customer & Shipping Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-zinc-900/60 border border-zinc-800 text-xs">
          <div className="space-y-2">
            <div className="font-bold text-zinc-200 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>{isRTL ? 'بيانات العميل:' : 'Customer Information:'}</span>
            </div>
            <div className="text-zinc-300 font-medium">
              {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
            </div>
            <div className="text-zinc-400 font-mono flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{order.shippingAddress?.phone}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-zinc-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>{isRTL ? 'عنوان التوصيل:' : 'Delivery Address:'}</span>
            </div>
            <div className="text-zinc-300">
              {order.shippingAddress?.street}, {order.shippingAddress?.city}
            </div>
            <div className="text-zinc-400 flex items-center gap-1.5">
              <CreditCard className="w-3 h-3 text-blue-400" />
              <span>{order.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
            {isRTL ? 'المنتجات المطلوبة:' : 'Ordered Items:'}
          </h4>
          <div className="divide-y divide-zinc-800/80 border border-zinc-800 bg-zinc-900/40">
            {order.items?.map((item, idx) => (
              <div key={idx} className="p-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-14 object-cover bg-zinc-900 border border-zinc-800"
                  />
                  <div>
                    <div className="font-bold text-white">{item.product.name}</div>
                    <div className="text-[11px] text-zinc-400 font-mono">
                      Size: {item.selectedSize} | Color: {item.selectedColor}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      Qty: {item.quantity} × {formatPrice(item.product.price)}
                    </div>
                  </div>
                </div>
                <div className="font-mono font-bold text-white text-right rtl:text-left">
                  {formatPrice(item.product.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Breakdown */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 space-y-2 text-xs font-mono">
          <div className="flex justify-between text-zinc-400">
            <span>{isRTL ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-amber-400">
              <span>{isRTL ? 'الخصم / الكوبون:' : 'Discount:'}</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-zinc-400">
            <span>{isRTL ? 'تكلفة الشحن:' : 'Shipping:'}</span>
            <span>{order.shipping === 0 ? (isRTL ? 'مجاني' : 'FREE') : formatPrice(order.shipping)}</span>
          </div>
          <div className="pt-2 border-t border-zinc-800 flex justify-between text-white font-bold text-sm">
            <span>{isRTL ? 'الإجمالي النهائي:' : 'Grand Total:'}</span>
            <span className="text-emerald-400">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Change Status Control */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-zinc-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-zinc-400 font-bold">{isRTL ? 'تحديث حالة الشحن:' : 'Update Status:'}</span>
            <select
              value={order.status}
              onChange={(e) => onUpdateStatus(order.id, e.target.value as any)}
              className="bg-zinc-900 border border-zinc-700 text-xs text-white px-3 py-1.5 rounded focus:outline-none"
            >
              <option value="Pending">Pending (جديد)</option>
              <option value="Processing">Processing (قيد التجهيز)</option>
              <option value="Shipped">Shipped (خرج للتوصيل)</option>
              <option value="Delivered">Delivered (تم التسليم)</option>
              <option value="Cancelled">Cancelled (ملغي)</option>
            </select>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-white text-black hover:bg-zinc-200 text-xs font-bold transition-colors"
          >
            {isRTL ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
