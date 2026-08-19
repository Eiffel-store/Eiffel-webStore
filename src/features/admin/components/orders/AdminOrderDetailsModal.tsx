import React from 'react';
import { X } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-zinc-950 border border-zinc-800 w-full max-w-2xl overflow-hidden shadow-2xl p-6 space-y-6">
        <div className="flex justify-between items-start pb-4 border-b border-zinc-800">
          <div>
            <span className="font-mono text-xs text-amber-400">ORDER DETAILS</span>
            <h2 className="text-xl font-bold text-white mt-1">{order.id}</h2>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">{order.date}</p>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 font-medium">{isRTL ? 'حالة الطلب:' : 'Order Status:'}</span>
          <select
            value={order.status}
            onChange={(e) => onUpdateStatus(order.id, e.target.value as any)}
            className="bg-zinc-900 border border-zinc-700 text-white text-xs px-3 py-1.5 focus:outline-none"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Ordered Items */}
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {order.items?.map((it, idx) => {
            const colorObj = it?.product?.colors?.find(c => c.name.toLowerCase() === it.selectedColor.toLowerCase());
            const img = colorObj?.image || it?.product?.images?.[0] || 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop';
            return (
              <div key={idx} className="flex items-center gap-3 p-2 bg-zinc-900 border border-zinc-800">
                <img src={img} alt="" className="w-12 h-14 object-cover" />
                <div className="flex-1 text-xs">
                  <h4 className="font-bold text-white">{it?.product?.name || 'Product'}</h4>
                  <p className="text-zinc-400 font-mono">{it.selectedColor} / {it.selectedSize} × {it.quantity}</p>
                </div>
                <span className="font-mono font-bold text-white text-xs">
                  {formatPrice((it?.product?.price || 0) * it.quantity)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div className="pt-4 border-t border-zinc-800 flex justify-between font-mono font-bold text-white text-sm">
          <span>TOTAL</span>
          <span>{formatPrice(order.total || 0)}</span>
        </div>
      </div>
    </div>
  );
};
