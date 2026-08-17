import React from 'react';
import { Truck } from 'lucide-react';
import { useCurrency, useLanguage } from '@/shared';
import { Order } from '@/types';

interface AccountOrdersTabProps {
  orders: Order[];
}

export const AccountOrdersTab: React.FC<AccountOrdersTabProps> = ({ orders = [] }) => {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  if (!orders || orders.length === 0) {
    return (
      <div className="p-12 text-center bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800">
        <p className="text-xs text-secondary">{t.noOrdersYet}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {orders.map((order) => {
        const items = order?.items || [];
        return (
          <div
            key={order.id}
            className="p-6 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-container dark:border-zinc-800 gap-2">
              <div>
                <span className="font-mono text-sm font-bold text-primary dark:text-white">{order.id}</span>
                <p className="text-xs font-mono text-secondary dark:text-zinc-400 mt-0.5">
                  {order.date} • {t.trackingId} <strong className="text-primary dark:text-white">{order.trackingNumber || 'BOUSTA-EFL'}</strong>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-label-bold px-3 py-1 bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 uppercase">
                  {order.status}
                </span>
                <span className="font-mono text-base font-bold text-primary dark:text-white">
                  {formatPrice(order.total || 0)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {items.map((it, idx) => {
                const img = it?.product?.images?.[0] || 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop';
                return (
                  <div key={idx} className="flex gap-3 p-3 bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-800">
                    <img src={img} alt={it?.product?.name || 'Item'} className="w-14 h-16 object-cover" />
                    <div className="flex-1">
                      <h4 className="font-editorial text-base text-primary dark:text-white line-clamp-1">{it?.product?.name || 'Product'}</h4>
                      <p className="text-[11px] text-secondary font-mono">{it?.selectedSize || 'M'} • {it?.selectedColor || 'Standard'}</p>
                      <span className="font-mono text-xs font-bold text-primary dark:text-white">{formatPrice(it?.product?.price || 0)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {order.shippingAddress && (
              <div className="pt-4 border-t border-surface-container dark:border-zinc-800 flex justify-between items-center text-xs font-mono text-secondary">
                <span>{t.destination} {order.shippingAddress.street}, {order.shippingAddress.city}</span>
                <span className="flex items-center gap-1 text-primary dark:text-white">
                  <Truck className="w-3.5 h-3.5" />
                  <span>{t.estimatedDelivery} {order.estimatedDelivery || '24–48 Hours'}</span>
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
