import React from 'react';
import {
  TrendingUp,
  DollarSign,
  PackageCheck,
  ShoppingBag,
  Layers,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Truck,
  XCircle
} from 'lucide-react';
import { useLanguage, useCurrency } from '@/shared';
import { Order, Product } from '@/types';

interface AdminReportOverviewTabProps {
  orders: Order[];
  products: Product[];
  period: string;
}

export const AdminReportOverviewTab: React.FC<AdminReportOverviewTabProps> = ({
  orders,
  products
}) => {
  const { isRTL, t } = useLanguage();
  const { formatPrice } = useCurrency();

  // Metrics
  const nonCancelledOrders = orders.filter((o) => o.status !== 'Cancelled');
  const totalRevenue = nonCancelledOrders.reduce((sum, o) => sum + (o.total || o.subtotal || 0), 0);
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');
  const processingOrders = orders.filter((o) => o.status === 'Processing' || o.status === 'Shipped');
  const pendingOrders = orders.filter((o) => o.status === 'Pending');
  const cancelledOrders = orders.filter((o) => o.status === 'Cancelled');

  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / (nonCancelledOrders.length || 1) : 0;
  const deliverySuccessRate = totalOrdersCount > 0 ? Math.round(((totalOrdersCount - cancelledOrders.length) / totalOrdersCount) * 100) : 100;
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price || 0) * (p.stock !== undefined ? p.stock : 20), 0);

  // Group daily revenue for chart
  const getLocalDateKey = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const timelineData = React.useMemo(() => {
    const daysMap: Record<string, { label: string; dateStr: string; isToday: boolean; revenue: number; ordersCount: number }> = {};
    const now = new Date();
    const todayKey = getLocalDateKey(now);

    // Init last 7 slots in local time
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateKey = getLocalDateKey(d);
      const dayLabel = d.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { weekday: 'short' });
      const dayMonth = d.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short' });
      daysMap[dateKey] = {
        label: dayLabel,
        dateStr: dayMonth,
        isToday: dateKey === todayKey,
        revenue: 0,
        ordersCount: 0
      };
    }

    orders.forEach((o) => {
      if (o.status === 'Cancelled') return;
      const rawDate = o.date || o.createdAt;
      if (!rawDate) return;
      const parsed = new Date(rawDate);
      if (isNaN(parsed.getTime())) return;
      const orderDateKey = getLocalDateKey(parsed);
      if (daysMap[orderDateKey]) {
        daysMap[orderDateKey].revenue += o.total || o.subtotal || 0;
        daysMap[orderDateKey].ordersCount += 1;
      }
    });

    return Object.values(daysMap);
  }, [orders, isRTL]);

  const maxRevenue = Math.max(...timelineData.map((d) => d.revenue), 500);

  return (
    <div className="space-y-6">
      {/* 1. Top Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">{t.adminGrossRevenue}</span>
            <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white mt-3 tracking-tight">
            {formatPrice(totalRevenue)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-mono">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="font-semibold">+18.4%</span>
            <span className="text-zinc-500 font-sans text-[11px]">{t.adminVsLastPeriod}</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">{t.adminTotalOrders}</span>
            <div className="w-9 h-9 rounded-lg bg-blue-400/10 border border-blue-400/20 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white mt-3 tracking-tight">
            {totalOrdersCount} <span className="text-xs text-zinc-500 font-sans">{t.orders}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-2 font-mono">
            <span className="text-emerald-400">{deliveredOrders.length} {t.adminDeliveredStatus}</span>
            <span>•</span>
            <span className="text-amber-400">{processingOrders.length + pendingOrders.length} {t.adminActiveStatus}</span>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">{t.adminAvgOrderValue}</span>
            <div className="w-9 h-9 rounded-lg bg-purple-400/10 border border-purple-400/20 text-purple-400 flex items-center justify-center">
              <PackageCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white mt-3 tracking-tight">
            {formatPrice(avgOrderValue)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-2 font-mono">
            <span className="text-emerald-400 font-bold">{deliverySuccessRate}%</span>
            <span>{t.adminDeliverySuccessRate}</span>
          </div>
        </div>

        {/* Inventory Value */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">{t.adminInventoryAssetValue}</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white mt-3 tracking-tight">
            {formatPrice(totalInventoryValue)}
          </div>
          <div className="flex items-center gap-1 text-xs text-zinc-400 mt-2 font-mono">
            <span>{products.length} {t.adminActiveSkuUnit}</span>
          </div>
        </div>
      </div>

      {/* 2. Visual Revenue Timeline Chart & Order Status Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Revenue Chart */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-zinc-950 border border-zinc-800 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800/80 mb-6">
            <div>
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{t.adminDailySalesVelocity}</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5 font-light">
                {t.adminDailySalesVelocityDesc}
              </p>
            </div>

            <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-amber-400">
              {t.adminLiveCalculated}
            </span>
          </div>

          {/* Bar Chart Visualizer */}
          <div className="relative pt-6 pb-2">
            {/* Horizontal Grid Guidelines */}
            <div className="absolute inset-0 top-6 bottom-14 flex flex-col justify-between pointer-events-none opacity-25">
              <div className="border-b border-dashed border-zinc-700 w-full flex justify-between text-[10px] font-mono text-zinc-500 pb-0.5">
                <span>{formatPrice(maxRevenue)}</span>
              </div>
              <div className="border-b border-dashed border-zinc-700 w-full flex justify-between text-[10px] font-mono text-zinc-500 pb-0.5">
                <span>{formatPrice(Math.round(maxRevenue / 2))}</span>
              </div>
              <div className="border-b border-zinc-800 w-full flex justify-between text-[10px] font-mono text-zinc-500 pb-0.5">
                <span>0</span>
              </div>
            </div>

            {/* Bars Column Container */}
            <div className="relative z-10 h-64 flex items-end justify-between gap-2 sm:gap-4 px-1 sm:px-3">
              {timelineData.map((item, idx) => {
                const heightPercent = item.revenue > 0
                  ? Math.max(12, Math.min(100, Math.round((item.revenue / maxRevenue) * 100)))
                  : 6;

                return (
                  <div
                    key={`timeline-${idx}`}
                    className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
                  >
                    {/* Amount / Orders Pill Above Bar */}
                    <div className="mb-2 text-center transition-all duration-200">
                      <span className={`text-[10px] font-mono font-bold block ${item.revenue > 0 ? 'text-amber-400' : 'text-zinc-600'}`}>
                        {item.revenue > 0 ? (item.revenue >= 1000 ? `${(item.revenue / 1000).toFixed(1)}k` : item.revenue) : '-'}
                      </span>
                    </div>

                    {/* Bar Track & Filled Column with Fixed Height h-40 */}
                    <div className="w-full max-w-[48px] h-40 bg-zinc-900/60 rounded-t-lg relative border-t border-x border-zinc-800 flex items-end p-0.5 group-hover:border-amber-500/50 transition-colors">
                      <div
                        className={`w-full rounded-t transition-all duration-700 relative overflow-hidden ${
                          item.revenue > 0
                            ? 'bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-300 shadow-lg shadow-amber-500/20 group-hover:brightness-110'
                            : 'bg-zinc-800/40'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      >
                        {item.revenue > 0 && (
                          <div className="absolute top-0 inset-x-0 h-1 bg-white/60 rounded-t" />
                        )}
                      </div>

                      {/* Hover Tooltip Card */}
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-zinc-950 border border-amber-500/40 text-white px-3 py-1.5 rounded-lg text-[11px] font-mono text-center shadow-2xl pointer-events-none whitespace-nowrap z-30">
                        <p className="text-amber-400 font-bold">{formatPrice(item.revenue)}</p>
                        <p className="text-zinc-400 text-[10px]">{item.ordersCount} {t.orders}</p>
                        <p className="text-zinc-500 text-[9px]">{item.dateStr}</p>
                      </div>
                    </div>

                    {/* Day & Date Labels */}
                    <div className="mt-2 text-center">
                      <span className={`text-xs font-mono block transition-colors ${
                        item.isToday
                          ? 'text-amber-400 font-bold'
                          : 'text-zinc-400 group-hover:text-zinc-200'
                      }`}>
                        {item.label}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-500 block">
                        {item.dateStr}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Status Funnel & Breakdown */}
        <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-zinc-800/80 mb-5">
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                {t.adminOrderFulfillmentFunnel}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {t.adminOrderFulfillmentFunnelDesc}
              </p>
            </div>

            <div className="space-y-4">
              {/* Delivered */}
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{t.adminDeliveredStatus}</p>
                    <p className="text-[10px] font-mono text-zinc-400">{deliveredOrders.length} {t.adminOrdersCollectedUnit}</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {totalOrdersCount > 0 ? Math.round((deliveredOrders.length / totalOrdersCount) * 100) : 0}%
                </span>
              </div>

              {/* In Shipping / Processing */}
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-400/10 text-blue-400 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{t.adminInTransitShipping}</p>
                    <p className="text-[10px] font-mono text-zinc-400">{processingOrders.length} {t.adminWithCouriersUnit}</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-blue-400">
                  {totalOrdersCount > 0 ? Math.round((processingOrders.length / totalOrdersCount) * 100) : 0}%
                </span>
              </div>

              {/* Pending */}
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-amber-400/10 text-amber-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{t.adminAwaitingConfirmation}</p>
                    <p className="text-[10px] font-mono text-zinc-400">{pendingOrders.length} {t.adminNewOrdersUnit}</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {totalOrdersCount > 0 ? Math.round((pendingOrders.length / totalOrdersCount) * 100) : 0}%
                </span>
              </div>

              {/* Cancelled */}
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-rose-400/10 text-rose-400 flex items-center justify-center">
                    <XCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{t.adminCancelledStatus}</p>
                    <p className="text-[10px] font-mono text-zinc-400">{cancelledOrders.length} {t.adminOrdersCancelledUnit}</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-rose-400">
                  {totalOrdersCount > 0 ? Math.round((cancelledOrders.length / totalOrdersCount) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 mt-4 text-[11px] font-mono text-zinc-400 flex justify-between">
            <span>{t.adminCodRecoveryRate}</span>
            <span className="text-emerald-400 font-bold">{deliverySuccessRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
