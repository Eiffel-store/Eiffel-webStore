import React, { useState } from 'react';
import { Package, Eye, Trash2, Check, Clock, Truck, CheckCircle2, XCircle, Phone } from 'lucide-react';
import { Order } from '@/types';
import { useLanguage, useCurrency } from '@/shared';

interface AdminOrdersTableProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onUpdateStatus: (id: string, status: Order['status']) => void;
  onDeleteOrder: (id: string) => void;
}

const STATUS_CONFIG: Record<Order['status'], { labelAr: string; labelEn: string; color: string; icon: any }> = {
  Pending: {
    labelAr: 'قيد الانتظار',
    labelEn: 'Pending',
    color: 'bg-amber-950/80 text-amber-300 border-amber-800',
    icon: Clock
  },
  Processing: {
    labelAr: 'جاري التجهيز',
    labelEn: 'Processing',
    color: 'bg-indigo-950/80 text-indigo-300 border-indigo-800',
    icon: Package
  },
  Shipped: {
    labelAr: 'خرج للتوصيل',
    labelEn: 'Out for Delivery',
    color: 'bg-blue-950/80 text-blue-300 border-blue-800',
    icon: Truck
  },
  Delivered: {
    labelAr: 'تم التسليم',
    labelEn: 'Delivered',
    color: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
    icon: CheckCircle2
  },
  Cancelled: {
    labelAr: 'ملغي',
    labelEn: 'Cancelled',
    color: 'bg-red-950/80 text-red-300 border-red-800',
    icon: XCircle
  }
};

export const AdminOrdersTable: React.FC<AdminOrdersTableProps> = ({
  orders,
  onSelectOrder,
  onUpdateStatus,
  onDeleteOrder
}) => {
  const { isRTL } = useLanguage();
  const { formatPrice } = useCurrency();
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingOrderId(orderId);
    try {
      await onUpdateStatus(orderId, newStatus);
    } finally {
      setTimeout(() => setUpdatingOrderId(null), 400);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 p-12 text-center text-zinc-500 rounded-xl">
        <Package className="w-10 h-10 mx-auto mb-3 opacity-30 text-amber-400" />
        <p className="text-sm font-medium">{isRTL ? 'لا توجد طلبات مسجلة حالياً.' : 'No orders found matching criteria.'}</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 overflow-x-auto shadow-xl rounded-xl">
      <table className="w-full text-left rtl:text-right border-collapse min-w-[750px]">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/60 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
            <th className="py-3.5 px-4">{isRTL ? 'رقم الطلب' : 'Order ID'}</th>
            <th className="py-3.5 px-4">{isRTL ? 'بيانات العميل' : 'Customer'}</th>
            <th className="py-3.5 px-4">{isRTL ? 'المنتجات المطلوبة' : 'Items'}</th>
            <th className="py-3.5 px-4">{isRTL ? 'المبلغ المطلوب' : 'Total'}</th>
            <th className="py-3.5 px-4">{isRTL ? 'تغيير حالة الطلب' : 'Change Status'}</th>
            <th className="py-3.5 px-4 text-right rtl:text-left">{isRTL ? 'إجراءات' : 'Actions'}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60 text-xs">
          {orders.map((order) => {
            const currentConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
            const Icon = currentConfig.icon;
            const isUpdating = updatingOrderId === order.id;

            return (
              <tr key={order.id} className="hover:bg-zinc-900/40 transition-colors">
                {/* Order ID & Date */}
                <td className="py-3.5 px-4 font-mono">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>{order.id}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{order.date}</div>
                </td>

                {/* Customer Details */}
                <td className="py-3.5 px-4">
                  <div className="font-bold text-white">
                    {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                  </div>
                  {order.shippingAddress?.phone && (
                    <a
                      href={`tel:${order.shippingAddress.phone}`}
                      className="text-[11px] text-zinc-400 font-mono flex items-center gap-1 hover:text-emerald-400 mt-0.5"
                    >
                      <Phone className="w-3 h-3 text-emerald-400" />
                      <span>{order.shippingAddress.phone}</span>
                    </a>
                  )}
                  <div className="text-[10px] text-zinc-500 mt-0.5 truncate max-w-[180px]">
                    📍 {order.shippingAddress?.city} - {order.shippingAddress?.street}
                  </div>
                </td>

                {/* Order Items */}
                <td className="py-3.5 px-4">
                  <div className="font-mono text-zinc-300 font-bold">
                    {order.items?.length || 0} {isRTL ? 'قطعة' : 'items'}
                  </div>
                  <div className="text-[10px] text-zinc-400 truncate max-w-[180px] mt-0.5">
                    {order.items?.map(i => `${i.product?.name || 'قطعة'} (${i.selectedColor || ''})`).join(' • ')}
                  </div>
                </td>

                {/* Total & Payment */}
                <td className="py-3.5 px-4 font-mono">
                  <div className="font-bold text-emerald-400 text-sm">{formatPrice(order.total)}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{order.paymentMethod || 'الدفع عند الاستلام'}</div>
                </td>

                {/* Interactive Status Selector */}
                <td className="py-3.5 px-4">
                  <div className="inline-flex items-center gap-2">
                    <div className="relative">
                      <select
                        value={order.status}
                        disabled={isUpdating}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                        className={`appearance-none text-xs font-bold font-mono pl-3 pr-7 py-1.5 rounded-lg border cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 ${currentConfig.color} ${
                          isUpdating ? 'opacity-50 animate-pulse' : ''
                        }`}
                      >
                        <option value="Pending" className="bg-zinc-900 text-amber-300">
                          ⏳ {isRTL ? 'قيد الانتظار (Pending)' : 'Pending'}
                        </option>
                        <option value="Processing" className="bg-zinc-900 text-indigo-300">
                          📦 {isRTL ? 'جاري التجهيز (Processing)' : 'Processing'}
                        </option>
                        <option value="Shipped" className="bg-zinc-900 text-blue-300">
                          🚚 {isRTL ? 'خرج للتوصيل (Shipped)' : 'Out for Delivery'}
                        </option>
                        <option value="Delivered" className="bg-zinc-900 text-emerald-300">
                          ✓ {isRTL ? 'تم التسليم (Delivered)' : 'Delivered'}
                        </option>
                        <option value="Cancelled" className="bg-zinc-900 text-red-300">
                          ✕ {isRTL ? 'ملغي (Cancelled)' : 'Cancelled'}
                        </option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
                        ▼
                      </div>
                    </div>
                  </div>
                </td>

                {/* Action Buttons */}
                <td className="py-3.5 px-4 text-right rtl:text-left">
                  <div className="flex items-center justify-end rtl:justify-start gap-1.5">
                    <button
                      onClick={() => onSelectOrder(order)}
                      className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 rounded-lg transition-colors cursor-pointer shadow"
                      title={isRTL ? 'عرض تفاصيل الطلب والتواصل واتساب' : 'View Order Details & WhatsApp'}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(isRTL ? `هل أنت متأكد من حذف الطلب رقم ${order.id}؟` : `Delete order ${order.id}?`)) {
                          onDeleteOrder(order.id);
                        }
                      }}
                      className="p-2 bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-400 border border-zinc-700 rounded-lg transition-colors cursor-pointer"
                      title={isRTL ? 'حذف السجل' : 'Delete Order'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
