import React, { useMemo } from 'react';
import {
  TrendingUp,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  MapPin,
  Package,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { Order } from '@/types';
import { useLanguage } from '@/shared';

interface AdminOrdersOverviewCardsProps {
  orders: Order[];
  onStatusFilter?: (status: string) => void;
  activeStatus?: string;
}

export const AdminOrdersOverviewCards: React.FC<AdminOrdersOverviewCardsProps> = ({
  orders,
  onStatusFilter,
  activeStatus = 'all',
}) => {
  const { isRTL, t } = useLanguage();

  const metrics = useMemo(() => {
    const totalCount = orders.length;
    if (totalCount === 0) {
      return {
        totalRevenue: 0,
        confirmedRevenue: 0,
        aov: 0,
        totalItems: 0,
        awaitingConfirmationCount: 0,
        awaitingConfirmationRate: '0%',
        inFulfillmentCount: 0,
        inFulfillmentRate: '0%',
        deliveredCount: 0,
        deliveryRate: '0%',
        cancelledCount: 0,
        cancelledRate: '0%',
        topCities: [] as { city: string; count: number; pct: string }[],
      };
    }

    let totalRevenue = 0;
    let confirmedRevenue = 0;
    let totalItems = 0;
    let awaitingConfirmationCount = 0;
    let inFulfillmentCount = 0; // Confirmed, Processing, Shipped
    let deliveredCount = 0;
    let cancelledCount = 0;
    const cityCounts: Record<string, number> = {};

    orders.forEach((o) => {
      const orderTotal = Number(o.total) || 0;
      totalRevenue += orderTotal;

      // Count items
      if (Array.isArray(o.items)) {
        o.items.forEach((item) => {
          totalItems += item.quantity || 1;
        });
      }

      // Status breakdown
      if (o.status === 'Awaiting_Confirmation' || o.status === 'Pending') {
        awaitingConfirmationCount++;
      } else if (o.status === 'Confirmed' || o.status === 'Processing' || o.status === 'Shipped') {
        inFulfillmentCount++;
        confirmedRevenue += orderTotal;
      } else if (o.status === 'Delivered') {
        deliveredCount++;
        confirmedRevenue += orderTotal;
      } else if (o.status === 'Cancelled') {
        cancelledCount++;
      }

      // City analytics
      const rawCity = o.shippingAddress?.city || o.shippingAddress?.state || 'أخرى';
      const cleanCity = rawCity.split('(')[0].trim() || 'أخرى';
      cityCounts[cleanCity] = (cityCounts[cleanCity] || 0) + 1;
    });

    const aov = totalCount > 0 ? Math.round(totalRevenue / totalCount) : 0;
    const awaitingConfirmationRate = ((awaitingConfirmationCount / totalCount) * 100).toFixed(1) + '%';
    const inFulfillmentRate = ((inFulfillmentCount / totalCount) * 100).toFixed(1) + '%';
    const deliveryRate = ((deliveredCount / totalCount) * 100).toFixed(1) + '%';
    const cancelledRate = ((cancelledCount / totalCount) * 100).toFixed(1) + '%';

    const topCities = Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([city, count]) => ({
        city,
        count,
        pct: ((count / totalCount) * 100).toFixed(0) + '%',
      }));

    return {
      totalRevenue,
      confirmedRevenue,
      aov,
      totalItems,
      awaitingConfirmationCount,
      awaitingConfirmationRate,
      inFulfillmentCount,
      inFulfillmentRate,
      deliveredCount,
      deliveryRate,
      cancelledCount,
      cancelledRate,
      topCities,
    };
  }, [orders]);

  return (
    <div className="mt-8 pt-6 border-t border-zinc-800/80 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
            {isRTL ? 'لوحة مؤشرات وأداء الطلبات المباشرة' : 'Live Orders Performance Insights'}
          </h2>
        </div>
        <p className="text-[11px] text-zinc-500">
          {isRTL
            ? 'اضغط على أي كارت للتصفية المباشرة في الجدول'
            : 'Click any card to filter table view'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* 1. Total Revenue Card */}
        <div
          onClick={() => onStatusFilter && onStatusFilter('all')}
          className={`relative overflow-hidden p-4 rounded-2xl border transition-all cursor-pointer group ${
            activeStatus === 'all'
              ? 'bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border-amber-500/50 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/30'
              : 'bg-zinc-950/60 border-zinc-850 hover:border-zinc-700 hover:bg-zinc-900/40'
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium text-zinc-400">
              {isRTL ? 'إجمالي قيمة المبيعات' : 'Total Revenue'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-white tracking-tight">
            {metrics.totalRevenue.toLocaleString()}{' '}
            <span className="text-xs font-normal text-amber-400/80">{isRTL ? 'ج.م' : 'EGP'}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-800/60 pt-2">
            <span>{isRTL ? 'متوسط السلة (AOV):' : 'AOV:'}</span>
            <span className="font-mono text-zinc-300 font-semibold">{metrics.aov} {isRTL ? 'ج.م' : 'EGP'}</span>
          </div>
        </div>

        {/* 2. Awaiting Confirmation Card */}
        <div
          onClick={() => onStatusFilter && onStatusFilter('Awaiting_Confirmation')}
          className={`relative overflow-hidden p-4 rounded-2xl border transition-all cursor-pointer group ${
            activeStatus === 'Awaiting_Confirmation'
              ? 'bg-gradient-to-b from-amber-950/30 to-zinc-950 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40'
              : 'bg-zinc-950/60 border-zinc-850 hover:border-amber-500/40 hover:bg-zinc-900/40'
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-medium text-zinc-300">
                {isRTL ? 'بانتظار التأكيد' : 'Awaiting Confirmation'}
              </span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-amber-400 tracking-tight">
            {metrics.awaitingConfirmationCount}{' '}
            <span className="text-xs font-normal text-zinc-400">{isRTL ? 'طلب' : 'orders'}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-800/60 pt-2">
            <span>{isRTL ? 'نسبة الجديد:' : 'Share of Total:'}</span>
            <span className="font-mono text-amber-400/90 font-semibold">{metrics.awaitingConfirmationRate}</span>
          </div>
        </div>

        {/* 3. In Fulfillment / Shipped Card */}
        <div
          onClick={() => onStatusFilter && onStatusFilter('Shipped')}
          className={`relative overflow-hidden p-4 rounded-2xl border transition-all cursor-pointer group ${
            activeStatus === 'Shipped' || activeStatus === 'Processing'
              ? 'bg-gradient-to-b from-blue-950/30 to-zinc-950 border-blue-500/60 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40'
              : 'bg-zinc-950/60 border-zinc-850 hover:border-blue-500/40 hover:bg-zinc-900/40'
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium text-zinc-300">
              {isRTL ? 'قيد التجهيز والشحن' : 'In Fulfillment'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-blue-400 tracking-tight">
            {metrics.inFulfillmentCount}{' '}
            <span className="text-xs font-normal text-zinc-400">{isRTL ? 'طلب' : 'orders'}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-800/60 pt-2">
            <span>{isRTL ? 'مع بوسطة والشحن:' : 'In Transit Rate:'}</span>
            <span className="font-mono text-blue-400/90 font-semibold">{metrics.inFulfillmentRate}</span>
          </div>
        </div>

        {/* 4. Delivered Card */}
        <div
          onClick={() => onStatusFilter && onStatusFilter('Delivered')}
          className={`relative overflow-hidden p-4 rounded-2xl border transition-all cursor-pointer group ${
            activeStatus === 'Delivered'
              ? 'bg-gradient-to-b from-emerald-950/30 to-zinc-950 border-emerald-500/60 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40'
              : 'bg-zinc-950/60 border-zinc-850 hover:border-emerald-500/40 hover:bg-zinc-900/40'
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium text-zinc-300">
              {isRTL ? 'تم التسليم بنجاح' : 'Delivered & Paid'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 tracking-tight">
            {metrics.deliveredCount}{' '}
            <span className="text-xs font-normal text-zinc-400">{isRTL ? 'طلب' : 'orders'}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-800/60 pt-2">
            <span>{isRTL ? 'نسبة نجاح التسليم:' : 'Delivery Rate:'}</span>
            <span className="font-mono text-emerald-400/90 font-semibold">{metrics.deliveryRate}</span>
          </div>
        </div>

        {/* 5. Cancelled Card */}
        <div
          onClick={() => onStatusFilter && onStatusFilter('Cancelled')}
          className={`relative overflow-hidden p-4 rounded-2xl border transition-all cursor-pointer group ${
            activeStatus === 'Cancelled'
              ? 'bg-gradient-to-b from-red-950/30 to-zinc-950 border-red-500/60 shadow-lg shadow-red-500/10 ring-1 ring-red-500/40'
              : 'bg-zinc-950/60 border-zinc-850 hover:border-red-500/40 hover:bg-zinc-900/40'
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium text-zinc-300">
              {isRTL ? 'طلبات ملغاة' : 'Cancelled Orders'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-red-400 tracking-tight">
            {metrics.cancelledCount}{' '}
            <span className="text-xs font-normal text-zinc-400">{isRTL ? 'طلب' : 'orders'}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-800/60 pt-2">
            <span>{isRTL ? 'معدل الإلغاء:' : 'Cancel Rate:'}</span>
            <span className="font-mono text-red-400/90 font-semibold">{metrics.cancelledRate}</span>
          </div>
        </div>
      </div>

      {/* Logistics & Geographic Quick Distribution */}
      {metrics.topCities.length > 0 && (
        <div className="p-3.5 bg-zinc-950/40 border border-zinc-800/70 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-400 font-medium">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{isRTL ? 'أعلى المحافظات طلباً للشحن:' : 'Top Shipping Destinations:'}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {metrics.topCities.map((c, idx) => (
              <span
                key={c.city}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="font-medium">{c.city}</span>
                <span className="font-mono text-zinc-400">({c.count} • {c.pct})</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
