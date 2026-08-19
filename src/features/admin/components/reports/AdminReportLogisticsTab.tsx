import React from 'react';
import {
  MapPin,
  Truck,
  CheckCircle2,
  XCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useLanguage, useCurrency } from '@/shared';
import { Order } from '@/types';

interface AdminReportLogisticsTabProps {
  orders: Order[];
}

export const AdminReportLogisticsTab: React.FC<AdminReportLogisticsTabProps> = ({ orders }) => {
  const { isRTL } = useLanguage();
  const { formatPrice } = useCurrency();

  // 1. Regional Statistics
  const regionalData = React.useMemo(() => {
    const govMap: Record<
      string,
      {
        city: string;
        totalOrders: number;
        deliveredOrders: number;
        cancelledOrders: number;
        totalRevenue: number;
        shippingRevenue: number;
      }
    > = {};

    orders.forEach((o) => {
      const city = o.shippingAddress?.city?.trim() || (isRTL ? 'القاهرة الكبرى' : 'Greater Cairo');
      if (!govMap[city]) {
        govMap[city] = {
          city,
          totalOrders: 0,
          deliveredOrders: 0,
          cancelledOrders: 0,
          totalRevenue: 0,
          shippingRevenue: 0
        };
      }

      govMap[city].totalOrders += 1;
      if (o.status === 'Delivered') govMap[city].deliveredOrders += 1;
      if (o.status === 'Cancelled') govMap[city].cancelledOrders += 1;
      else {
        govMap[city].totalRevenue += o.total || o.subtotal || 0;
        govMap[city].shippingRevenue += o.shipping || 0;
      }
    });

    return Object.values(govMap).sort((a, b) => b.totalOrders - a.totalOrders);
  }, [orders, isRTL]);

  const totalDelivered = orders.filter((o) => o.status === 'Delivered').length;
  const totalCancelled = orders.filter((o) => o.status === 'Cancelled').length;
  const overallSuccessRate = orders.length > 0 ? Math.round((totalDelivered / (orders.length - totalCancelled || 1)) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* 1. Logistics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">{isRTL ? 'تغطية الشحن بالمحافظات' : 'Governorates Active'}</span>
            <MapPin className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-white mt-2">{regionalData.length} {isRTL ? 'محافظة' : 'cities'}</p>
          <p className="text-[11px] text-zinc-500 font-mono mt-1">{isRTL ? 'شحن فوري لباب المنزل' : 'Express courier delivery'}</p>
        </div>

        <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">{isRTL ? 'معدل نجاح التسليم (COD)' : 'Delivery Success Rate'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-emerald-400 mt-2">{overallSuccessRate}%</p>
          <p className="text-[11px] text-zinc-500 font-mono mt-1">{totalDelivered} {isRTL ? 'طلب مستلم بنجاح' : 'orders delivered'}</p>
        </div>

        <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">{isRTL ? 'نسبة المرتجعات / الإلغاء' : 'Cancellation & Returns'}</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-rose-400 mt-2">
            {orders.length > 0 ? Math.round((totalCancelled / orders.length) * 100) : 0}%
          </p>
          <p className="text-[11px] text-zinc-500 font-mono mt-1">{totalCancelled} {isRTL ? 'طلب تم إلغاؤه' : 'cancelled orders'}</p>
        </div>
      </div>

      {/* 2. Governorates Delivery Performance Table */}
      <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 shadow-lg">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              {isRTL ? 'سجل وكفاءة الشحن والتوزيع عبر محافظات مصر' : 'Egyptian Governorates Delivery Performance'}
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">{regionalData.length} {isRTL ? 'محافظات مسجلة' : 'regions'}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400">
              <tr>
                <th className={`p-3 ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? 'المحافظة / المدينة' : 'Governorate'}</th>
                <th className="p-3 text-center">{isRTL ? 'إجمالي الطلبات' : 'Total Orders'}</th>
                <th className="p-3 text-center">{isRTL ? 'مكتمل' : 'Delivered'}</th>
                <th className="p-3 text-center">{isRTL ? 'مرتجع / ملغي' : 'Cancelled'}</th>
                <th className="p-3 text-center">{isRTL ? 'معدل النجاح' : 'Success Rate'}</th>
                <th className={`p-3 ${isRTL ? 'text-left' : 'text-right'}`}>{isRTL ? 'إجمالي الإيرادات' : 'Total Revenue'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {regionalData.map((reg, idx) => {
                const rate = reg.totalOrders > 0 ? Math.round((reg.deliveredOrders / (reg.totalOrders - reg.cancelledOrders || 1)) * 100) : 100;

                return (
                  <tr key={`log-row-${idx}`} className="hover:bg-zinc-900/40 transition-colors">
                    <td className={`p-3 font-medium text-white flex items-center gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{reg.city}</span>
                    </td>
                    <td className="p-3 text-center font-bold text-white">{reg.totalOrders}</td>
                    <td className="p-3 text-center text-emerald-400">{reg.deliveredOrders}</td>
                    <td className="p-3 text-center text-rose-400">{reg.cancelledOrders}</td>
                    <td className="p-3 text-center font-bold">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          rate >= 80 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {rate}%
                      </span>
                    </td>
                    <td className={`p-3 font-bold text-white ${isRTL ? 'text-left' : 'text-right'}`}>
                      {formatPrice(reg.totalRevenue)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
