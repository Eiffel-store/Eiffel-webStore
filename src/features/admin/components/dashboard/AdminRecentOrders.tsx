import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';
import { useStoreData, useLanguage, useCurrency } from '@/shared';

export const AdminRecentOrders: React.FC = () => {
  const { orders } = useStoreData();
  const { isRTL } = useLanguage();
  const { formatPrice } = useCurrency();
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div>
          <h2 className="text-base font-bold text-white">{isRTL ? 'أحدث الطلبات الواردة' : 'Recent Customer Orders'}</h2>
          <p className="text-xs text-zinc-500">{isRTL ? 'الطلبات التي تم إجراؤها من صفحة الدفع' : 'Orders received from checkout'}</p>
        </div>
        <Link to="/admin/orders" className="text-xs text-zinc-400 hover:text-white font-mono flex items-center gap-1">
          <span>{isRTL ? 'عرض الكل' : 'View All'}</span>
          <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
        </Link>
      </div>

      {recentOrders.length === 0 ? (
        <div className="py-12 text-center text-zinc-500 text-xs">
          <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>{isRTL ? 'لا توجد طلبات مسجلة حتى الآن.' : 'No customer orders placed yet.'}</p>
          <p className="text-[11px] text-zinc-600 mt-1">{isRTL ? 'ستظهر هنا فور إتمام العميل للطلب في المتجر.' : 'Orders from checkout will appear here live.'}</p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/80">
          {recentOrders.map((order) => (
            <div key={order.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-white">{order.id}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : order.status === 'Processing' || order.status === 'Pending'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 truncate">
                  {order.shippingAddress?.firstName} {order.shippingAddress?.lastName} — {order.shippingAddress?.city}
                </p>
              </div>

              <div className="text-right rtl:text-left shrink-0">
                <div className="font-mono text-xs font-bold text-white">{formatPrice(order.total)}</div>
                <div className="text-[10px] text-zinc-500 font-mono">{order.items?.length || 0} {isRTL ? 'قطع' : 'items'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
