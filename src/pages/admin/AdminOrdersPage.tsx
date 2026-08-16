import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Eye,
  Trash2,
  Printer,
  Phone,
  MapPin,
  CreditCard,
  User,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useStoreData } from '../../context/StoreDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { Order } from '../../types';

export const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder } = useStoreData();
  const { isRTL } = useLanguage();
  const { formatPrice } = useCurrency();

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.shippingAddress?.firstName && o.shippingAddress.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.shippingAddress?.lastName && o.shippingAddress.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.shippingAddress?.phone && o.shippingAddress.phone.includes(searchQuery)) ||
      (o.shippingAddress?.city && o.shippingAddress.city.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono text-[10px] font-bold">✓ Delivered</span>;
      case 'Shipped':
        return <span className="bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded font-mono text-[10px] font-bold">🚚 Out for Delivery</span>;
      case 'Processing':
      case 'Pending':
        return <span className="bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded font-mono text-[10px] font-bold">⏳ Processing</span>;
      case 'Cancelled':
        return <span className="bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded font-mono text-[10px] font-bold">✕ Cancelled</span>;
      default:
        return <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono text-[10px]">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-wide">
            {isRTL ? 'سجل وإدارة طلبات العملاء' : 'Customer Orders & Fulfillment'}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {isRTL
              ? `إجمالي ${orders.length} طلب مسجل — يمكنك متابعة وتحديث حالة الشحن والدفع.`
              : `Total ${orders.length} orders received from store checkout.`}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-zinc-950 p-4 border border-zinc-800">
        {/* Search */}
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRTL ? 'بحث برقم الطلب، اسم العميل، رقم الهاتف، أو المدينة...' : 'Search by order ID, customer name, phone, or city...'}
            className="w-full bg-zinc-900 border border-zinc-700 pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors"
          >
            <option value="all">{isRTL ? 'جميع الحالات (الكل)' : 'All Order Statuses'}</option>
            <option value="Pending">Pending (جديد)</option>
            <option value="Processing">Processing (قيد التجهيز)</option>
            <option value="Shipped">Shipped (خرج للتوصيل)</option>
            <option value="Delivered">Delivered (تم التسليم)</option>
            <option value="Cancelled">Cancelled (ملغي)</option>
          </select>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 p-6 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <span className="font-mono text-sm font-bold text-white">{selectedOrder.id}</span>
                <div className="text-xs text-zinc-500 font-mono mt-0.5">{selectedOrder.date}</div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded bg-zinc-900"
              >
                ✕
              </button>
            </div>

            {/* Customer & Shipping Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/60 p-4 border border-zinc-800 text-xs">
              <div className="space-y-1.5">
                <div className="font-bold text-white uppercase text-[11px] flex items-center gap-1.5 text-zinc-400">
                  <User className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'بيانات العميل' : 'Customer Info'}</span>
                </div>
                <div className="text-white font-bold">
                  {selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}
                </div>
                <div className="text-zinc-300 font-mono flex items-center gap-1">
                  <Phone className="w-3 h-3 text-zinc-500" />
                  <a href={`tel:${selectedOrder.shippingAddress?.phone}`} className="hover:underline">
                    {selectedOrder.shippingAddress?.phone}
                  </a>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="font-bold text-white uppercase text-[11px] flex items-center gap-1.5 text-zinc-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'عنوان الشحن' : 'Shipping Address'}</span>
                </div>
                <div className="text-zinc-300">
                  {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}
                </div>
                <div className="text-zinc-500 font-mono">
                  {selectedOrder.paymentMethod || 'Cash on Delivery'}
                </div>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{isRTL ? 'القطع المطلوبة' : 'Ordered Items'}</h4>
              <div className="divide-y divide-zinc-800/80 border border-zinc-800 bg-zinc-900/40">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="p-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product?.images?.[0] || 'https://placehold.co/100x120?text=Item'}
                        alt={item.product?.name}
                        className="w-12 h-14 object-cover bg-zinc-950 border border-zinc-800 shrink-0"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">{item.product?.name}</div>
                        <div className="text-[11px] text-zinc-400 font-mono">
                          {item.selectedSize} / {item.selectedColor} × {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-mono font-bold text-white">
                      {formatPrice(item.product ? item.product.price * item.quantity : 0)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Summary */}
            <div className="bg-zinc-900 p-4 border border-zinc-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>{isRTL ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>{isRTL ? 'الشحن' : 'Shipping'}</span>
                <span>{selectedOrder.shipping === 0 ? (isRTL ? 'مجاني' : 'FREE') : formatPrice(selectedOrder.shipping)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>{isRTL ? 'الخصم' : 'Discount'}</span>
                  <span>-{formatPrice(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                <span>{isRTL ? 'الإجمالي الكلي' : 'Total Amount'}</span>
                <span>{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Status Update Actions */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300">
                {isRTL ? 'تحديث حالة الطلب' : 'Update Order Status'}
              </label>
              <div className="flex flex-wrap gap-2">
                {(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as Order['status'][]).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, status);
                      setSelectedOrder({ ...selectedOrder, status });
                    }}
                    className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
                      selectedOrder.status === status
                        ? 'bg-white text-black font-bold'
                        : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>{isRTL ? 'طباعة الفاتورة' : 'Print Slip'}</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-white text-black hover:bg-zinc-200 text-xs font-bold"
              >
                {isRTL ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center bg-zinc-950 border border-zinc-800 p-8">
          <Package className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
          <h3 className="text-base font-bold text-white">{isRTL ? 'لا توجد طلبات مسجلة' : 'No orders found'}</h3>
          <p className="text-xs text-zinc-400 mt-1">
            {isRTL ? 'ستظهر هنا كافة طلبات الشراء التي يقوم الزوار بطلبها.' : 'Incoming checkout orders will be listed here.'}
          </p>
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  <th className="py-3.5 px-4">{isRTL ? 'رقم الطلب والتاريخ' : 'Order ID & Date'}</th>
                  <th className="py-3.5 px-4">{isRTL ? 'العميل والهاتف' : 'Customer & Contact'}</th>
                  <th className="py-3.5 px-4">{isRTL ? 'المدينة' : 'City'}</th>
                  <th className="py-3.5 px-4">{isRTL ? 'الإجمالي' : 'Total'}</th>
                  <th className="py-3.5 px-4">{isRTL ? 'الحالة' : 'Status'}</th>
                  <th className="py-3.5 px-4 text-center">{isRTL ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-white">{order.id}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{order.date}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">
                        {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono">
                        {order.shippingAddress?.phone}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-zinc-300">
                      {order.shippingAddress?.city}
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-white text-sm">{formatPrice(order.total)}</div>
                      <div className="text-[10px] text-zinc-500">{order.items?.length || 0} {isRTL ? 'قطع' : 'items'}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(order.status)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-mono flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isRTL ? 'التفاصيل' : 'Details'}</span>
                        </button>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                          title={isRTL ? 'حذف' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
