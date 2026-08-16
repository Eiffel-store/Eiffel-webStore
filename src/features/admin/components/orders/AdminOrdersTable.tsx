import React from 'react';
import { Package, Eye, Trash2 } from 'lucide-react';
import { Order } from '@/types';
import { useLanguage, useCurrency } from '@/shared';

interface AdminOrdersTableProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onUpdateStatus: (id: string, status: Order['status']) => void;
  onDeleteOrder: (id: string) => void;
}

export const AdminOrdersTable: React.FC<AdminOrdersTableProps> = ({
  orders,
  onSelectOrder,
  onUpdateStatus,
  onDeleteOrder
}) => {
  const { isRTL } = useLanguage();
  const { formatPrice } = useCurrency();

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

  if (orders.length === 0) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 p-12 text-center text-zinc-500">
        <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm font-medium">{isRTL ? 'لا توجد طلبات مطابقة.' : 'No orders found matching criteria.'}</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 overflow-x-auto shadow-xl">
      <table className="w-full text-left rtl:text-right border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/60 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
            <th className="py-3.5 px-4">{isRTL ? 'رقم الطلب والتاريخ' : 'Order ID & Date'}</th>
            <th className="py-3.5 px-4">{isRTL ? 'العميل' : 'Customer'}</th>
            <th className="py-3.5 px-4">{isRTL ? 'المنتجات' : 'Items'}</th>
            <th className="py-3.5 px-4">{isRTL ? 'الإجمالي' : 'Total'}</th>
            <th className="py-3.5 px-4">{isRTL ? 'حالة الطلب' : 'Status'}</th>
            <th className="py-3.5 px-4 text-right rtl:text-left">{isRTL ? 'إجراءات' : 'Actions'}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60 text-xs">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-zinc-900/40 transition-colors">
              <td className="py-3.5 px-4 font-mono">
                <div className="font-bold text-white">{order.id}</div>
                <div className="text-[10px] text-zinc-500">{order.date}</div>
              </td>

              <td className="py-3.5 px-4">
                <div className="font-bold text-white">
                  {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                </div>
                <div className="text-[11px] text-zinc-400 font-mono">
                  {order.shippingAddress?.phone}
                </div>
                <div className="text-[10px] text-zinc-500">
                  {order.shippingAddress?.city}
                </div>
              </td>

              <td className="py-3.5 px-4">
                <div className="font-mono text-zinc-300">
                  {order.items?.length || 0} {isRTL ? 'قطع' : 'items'}
                </div>
                <div className="text-[10px] text-zinc-500 truncate max-w-[160px]">
                  {order.items?.map(i => i.product.name).join(', ')}
                </div>
              </td>

              <td className="py-3.5 px-4 font-mono">
                <div className="font-bold text-white">{formatPrice(order.total)}</div>
                <div className="text-[10px] text-zinc-500">{order.paymentMethod}</div>
              </td>

              <td className="py-3.5 px-4">
                <div className="space-y-1">
                  {getStatusBadge(order.status)}
                  <div>
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value as any)}
                      className="bg-zinc-900 border border-zinc-700 text-[10px] text-zinc-300 px-2 py-0.5 rounded focus:outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </td>

              <td className="py-3.5 px-4 text-right rtl:text-left">
                <div className="flex items-center justify-end rtl:justify-start gap-2">
                  <button
                    onClick={() => onSelectOrder(order)}
                    className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-colors"
                    title={isRTL ? 'عرض تفاصيل الطلب والفاتورة' : 'View Order Details'}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteOrder(order.id)}
                    className="p-1.5 bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-400 border border-zinc-700 transition-colors"
                    title={isRTL ? 'حذف السجل' : 'Delete Order'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
