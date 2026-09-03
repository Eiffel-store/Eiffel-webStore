import React, { useMemo } from 'react';
import {
  RotateCcw,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  Layers,
  MapPin,
  TrendingDown,
  AlertTriangle,
  Shirt
} from 'lucide-react';
import { ExchangeRequest } from '@/types';
import { useLanguage } from '@/shared';

interface AdminExchangesOverviewCardsProps {
  requests: ExchangeRequest[];
  onStatusFilter?: (status: string) => void;
  activeStatus?: string;
}

export const AdminExchangesOverviewCards: React.FC<AdminExchangesOverviewCardsProps> = ({
  requests,
  onStatusFilter,
  activeStatus = 'ALL',
}) => {
  const { isRTL, t } = useLanguage();

  const metrics = useMemo(() => {
    const total = requests.length;
    if (total === 0) {
      return {
        total: 0,
        pendingCount: 0,
        pendingRate: '0%',
        approvedCount: 0,
        inTransitCount: 0,
        completedCount: 0,
        resolutionRate: '0%',
        rejectedCount: 0,
        reasonsBreakdown: [] as { type: string; label: string; count: number; pct: string; color: string }[],
        topProducts: [] as { name: string; count: number }[],
        topCities: [] as { city: string; count: number }[],
      };
    }

    let pendingCount = 0;
    let approvedCount = 0;
    let inTransitCount = 0;
    let completedCount = 0;
    let rejectedCount = 0;

    const reasonsCount: Record<string, number> = {
      EXCHANGE_SIZE: 0,
      EXCHANGE_COLOR: 0,
      DEFECT: 0,
      RETURN_REFUND: 0,
    };

    const productCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};

    requests.forEach((req) => {
      // Status
      if (req.status === 'PENDING') pendingCount++;
      else if (req.status === 'APPROVED') approvedCount++;
      else if (req.status === 'IN_TRANSIT') inTransitCount++;
      else if (req.status === 'COMPLETED') completedCount++;
      else if (req.status === 'REJECTED') rejectedCount++;

      // Reason type
      const typeKey = req.requestType || 'EXCHANGE_SIZE';
      reasonsCount[typeKey] = (reasonsCount[typeKey] || 0) + 1;

      // Product
      const prodName = req.productName || 'قطعة أزياء';
      productCounts[prodName] = (productCounts[prodName] || 0) + 1;

      // City
      const city = req.pickupCity || 'أخرى';
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    });

    const pendingRate = ((pendingCount / total) * 100).toFixed(0) + '%';
    const resolutionRate = (((completedCount + approvedCount) / total) * 100).toFixed(1) + '%';

    const reasonsBreakdown = [
      {
        type: 'EXCHANGE_SIZE',
        label: isRTL ? 'استبدال مقاس' : 'Size Exchange',
        count: reasonsCount.EXCHANGE_SIZE || 0,
        pct: (((reasonsCount.EXCHANGE_SIZE || 0) / total) * 100).toFixed(0) + '%',
        color: 'bg-amber-400',
      },
      {
        type: 'EXCHANGE_COLOR',
        label: isRTL ? 'استبدال لون' : 'Color Exchange',
        count: reasonsCount.EXCHANGE_COLOR || 0,
        pct: (((reasonsCount.EXCHANGE_COLOR || 0) / total) * 100).toFixed(0) + '%',
        color: 'bg-blue-400',
      },
      {
        type: 'DEFECT',
        label: isRTL ? 'عيب صناعة' : 'Defect Report',
        count: reasonsCount.DEFECT || 0,
        pct: (((reasonsCount.DEFECT || 0) / total) * 100).toFixed(0) + '%',
        color: 'bg-red-400',
      },
      {
        type: 'RETURN_REFUND',
        label: isRTL ? 'استرجاع واسترداد' : 'Return & Refund',
        count: reasonsCount.RETURN_REFUND || 0,
        pct: (((reasonsCount.RETURN_REFUND || 0) / total) * 100).toFixed(0) + '%',
        color: 'bg-purple-400',
      },
    ].filter(r => r.count > 0);

    const topProducts = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));

    const topCities = Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([city, count]) => ({ city, count }));

    return {
      total,
      pendingCount,
      pendingRate,
      approvedCount,
      inTransitCount,
      completedCount,
      resolutionRate,
      rejectedCount,
      reasonsBreakdown,
      topProducts,
      topCities,
    };
  }, [requests, isRTL]);

  return (
    <div className="mt-8 pt-6 border-t border-zinc-800/80 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
            {isRTL ? 'تحليلات وإحصائيات طلبات الاستبدال الميدانية' : 'Exchange & Returns Operational Insights'}
          </h2>
        </div>
        <p className="text-[11px] text-zinc-500">
          {isRTL
            ? 'متابعة أسباب التبديل وسرعة الاستجابة لخدمة العملاء'
            : 'Operational overview of reasons, resolution rates & top items'}
        </p>
      </div>

      {/* KPI 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Pending Action */}
        <div
          onClick={() => onStatusFilter && onStatusFilter('PENDING')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
            activeStatus === 'PENDING'
              ? 'bg-gradient-to-b from-amber-950/30 to-zinc-950 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40'
              : 'bg-zinc-950/60 border-zinc-850 hover:border-amber-500/40 hover:bg-zinc-900/40'
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium text-zinc-300">
              {isRTL ? 'معلق بانتظار الموافقة' : 'Pending Review'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-amber-400 tracking-tight">
            {metrics.pendingCount}{' '}
            <span className="text-xs font-normal text-zinc-400">{isRTL ? 'طلب' : 'requests'}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-800/60 pt-2">
            <span>{isRTL ? 'نسبة المعلق:' : 'Pending Ratio:'}</span>
            <span className="font-mono text-amber-400/90 font-semibold">{metrics.pendingRate}</span>
          </div>
        </div>

        {/* 2. Active in Fulfillment / Transit */}
        <div
          onClick={() => onStatusFilter && onStatusFilter('IN_TRANSIT')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
            activeStatus === 'IN_TRANSIT'
              ? 'bg-gradient-to-b from-purple-950/30 to-zinc-950 border-purple-500/60 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/40'
              : 'bg-zinc-950/60 border-zinc-850 hover:border-purple-500/40 hover:bg-zinc-900/40'
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium text-zinc-300">
              {isRTL ? 'مع مندوب الشحن (بوسطة)' : 'In Transit Courier'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-purple-400 tracking-tight">
            {metrics.inTransitCount}{' '}
            <span className="text-xs font-normal text-zinc-400">{isRTL ? 'طلب' : 'requests'}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-800/60 pt-2">
            <span>{isRTL ? 'طلبات مقبولة مسبقاً:' : 'Approved Prior:'}</span>
            <span className="font-mono text-purple-400/90 font-semibold">{metrics.approvedCount}</span>
          </div>
        </div>

        {/* 3. Completed & Resolved */}
        <div
          onClick={() => onStatusFilter && onStatusFilter('COMPLETED')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
            activeStatus === 'COMPLETED'
              ? 'bg-gradient-to-b from-emerald-950/30 to-zinc-950 border-emerald-500/60 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40'
              : 'bg-zinc-950/60 border-zinc-850 hover:border-emerald-500/40 hover:bg-zinc-900/40'
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium text-zinc-300">
              {isRTL ? 'تم التبديل بنجاح' : 'Completed Successfully'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 tracking-tight">
            {metrics.completedCount}{' '}
            <span className="text-xs font-normal text-zinc-400">{isRTL ? 'طلب' : 'resolved'}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-800/60 pt-2">
            <span>{isRTL ? 'نسبة الرضا والإنجاز:' : 'Resolution Rate:'}</span>
            <span className="font-mono text-emerald-400/90 font-semibold">{metrics.resolutionRate}</span>
          </div>
        </div>

        {/* 4. Rejected */}
        <div
          onClick={() => onStatusFilter && onStatusFilter('REJECTED')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
            activeStatus === 'REJECTED'
              ? 'bg-gradient-to-b from-red-950/30 to-zinc-950 border-red-500/60 shadow-lg shadow-red-500/10 ring-1 ring-red-500/40'
              : 'bg-zinc-950/60 border-zinc-850 hover:border-red-500/40 hover:bg-zinc-900/40'
          }`}
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium text-zinc-300">
              {isRTL ? 'طلبات تم رفضها' : 'Rejected Requests'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-red-400 tracking-tight">
            {metrics.rejectedCount}{' '}
            <span className="text-xs font-normal text-zinc-400">{isRTL ? 'طلب' : 'rejected'}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-800/60 pt-2">
            <span>{isRTL ? 'نسبة الرفض:' : 'Rejection Rate:'}</span>
            <span className="font-mono text-red-400/90 font-semibold">
              {metrics.total > 0 ? ((metrics.rejectedCount / metrics.total) * 100).toFixed(1) + '%' : '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* Deep Operational Insights (Reasons Breakdown & Top Items) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Reasons Progress Bars */}
        <div className="p-4 bg-zinc-950/50 border border-zinc-800/80 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              {isRTL ? 'أسباب طلبات الاستبدال الأكثر شيوعاً:' : 'Exchange Reasons Breakdown:'}
            </span>
            <span className="text-[11px] font-normal text-zinc-500">
              {metrics.total} {isRTL ? 'طلب مسجل' : 'total requests'}
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {metrics.reasonsBreakdown.length === 0 ? (
              <p className="text-xs text-zinc-500 italic">{isRTL ? 'لا توجد طلبات كافية للتحليل' : 'No exchange data available'}</p>
            ) : (
              metrics.reasonsBreakdown.map((r) => (
                <div key={r.type} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-300 font-medium">{r.label}</span>
                    <span className="font-mono text-zinc-400">
                      {r.count} <span className="text-zinc-500">({r.pct})</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${r.color}`}
                      style={{ width: r.pct }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Exchanged Items & Geographic Hotspots */}
        <div className="p-4 bg-zinc-950/50 border border-zinc-800/80 rounded-2xl flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold mb-2.5">
              <Shirt className="w-3.5 h-3.5 text-amber-400" />
              <span>{isRTL ? 'أكثر المنتجات طلباً للتبديل (لمراجعة المقاسات):' : 'Top Items Requested for Exchange:'}</span>
            </div>

            {metrics.topProducts.length === 0 ? (
              <p className="text-xs text-zinc-500 italic">{isRTL ? 'لا توجد طلبات استبدال حتى الآن' : 'No exchange data'}</p>
            ) : (
              <div className="space-y-1.5">
                {metrics.topProducts.map((p, i) => (
                  <div
                    key={p.name}
                    className="flex items-center justify-between text-xs px-2.5 py-1.5 bg-zinc-900/60 border border-zinc-800/60 rounded-xl"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-4 h-4 rounded-full bg-amber-400/10 text-amber-400 text-[10px] font-mono flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-zinc-300 truncate">{p.name}</span>
                    </div>
                    <span className="font-mono text-amber-400/90 font-medium shrink-0 ml-2">
                      {p.count} {isRTL ? 'مرات' : 'times'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {metrics.topCities.length > 0 && (
            <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{isRTL ? 'أعلى المدن للاستلام:' : 'Top Cities:'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {metrics.topCities.map((c) => (
                  <span key={c.city} className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300">
                    {c.city} ({c.count})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
