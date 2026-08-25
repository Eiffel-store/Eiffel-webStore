import React from 'react';
import {
  Tag,
  DollarSign,
  PieChart,
  Percent,
  Layers,
  Banknote,
  Receipt
} from 'lucide-react';
import { useLanguage, useCurrency } from '@/shared';
import { Order, Product, CategoryItem, Coupon } from '@/types';

interface AdminReportSalesTabProps {
  orders: Order[];
  products: Product[];
  categories: CategoryItem[];
  coupons: Coupon[];
}

export const AdminReportSalesTab: React.FC<AdminReportSalesTabProps> = ({
  orders,
  categories,
  coupons
}) => {
  const { isRTL, t } = useLanguage();
  const { formatPrice } = useCurrency();

  const nonCancelledOrders = orders.filter((o) => o.status !== 'Cancelled');
  const grossSales = nonCancelledOrders.reduce((sum, o) => sum + (o.subtotal || o.total || 0), 0);
  const totalShippingCollected = nonCancelledOrders.reduce((sum, o) => sum + (o.shipping || 0), 0);
  const totalDiscountsGiven = nonCancelledOrders.reduce((sum, o) => sum + (o.discount || 0), 0);
  const netRevenue = grossSales + totalShippingCollected - totalDiscountsGiven;

  // 1. Sales by Category
  const categorySales = React.useMemo(() => {
    const catMap: Record<string, { name: string; nameEn: string; count: number; revenue: number }> = {};

    categories.forEach((c) => {
      catMap[c.id] = { name: c.name, nameEn: c.nameEn || c.name, count: 0, revenue: 0 };
    });

    nonCancelledOrders.forEach((o) => {
      o.items?.forEach((item) => {
        const prod = item.product || (item as any);
        const catKey = prod?.category || 'men';
        if (!catMap[catKey]) {
          catMap[catKey] = { name: 'تشكيلة الرجال', nameEn: "Men's Collection", count: 0, revenue: 0 };
        }
        const qty = item.quantity || 1;
        const price = prod?.price || (item as any)?.price || 0;
        catMap[catKey].count += qty;
        catMap[catKey].revenue += price * qty;
      });
    });

    const totalCatRevenue = Object.values(catMap).reduce((sum, c) => sum + c.revenue, 0) || 1;

    return Object.values(catMap).map((c) => ({
      ...c,
      percentage: Math.round((c.revenue / totalCatRevenue) * 100)
    }));
  }, [nonCancelledOrders, categories]);

  // 2. Order Value Tiers
  const orderTiers = React.useMemo(() => {
    let tier1 = 0; // < 500 EGP
    let tier2 = 0; // 500 - 1500 EGP
    let tier3 = 0; // 1500 - 3000 EGP
    let tier4 = 0; // > 3000 EGP

    nonCancelledOrders.forEach((o) => {
      const val = o.total || o.subtotal || 0;
      if (val < 500) tier1++;
      else if (val <= 1500) tier2++;
      else if (val <= 3000) tier3++;
      else tier4++;
    });

    const total = nonCancelledOrders.length || 1;
    return [
      { labelAr: 'أقل من 500 ج.م', labelEn: '< 500 EGP', count: tier1, percent: Math.round((tier1 / total) * 100) },
      { labelAr: '500 – 1,500 ج.م', labelEn: '500 – 1,500 EGP', count: tier2, percent: Math.round((tier2 / total) * 100) },
      { labelAr: '1,500 – 3,000 ج.م', labelEn: '1,500 – 3,000 EGP', count: tier3, percent: Math.round((tier3 / total) * 100) },
      { labelAr: 'أكثر من 3,000 ج.م', labelEn: '> 3,000 EGP', count: tier4, percent: Math.round((tier4 / total) * 100) }
    ];
  }, [nonCancelledOrders]);

  return (
    <div className="space-y-6">
      {/* 1. Financial Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Sales */}
        <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">{t.adminGrossSales}</span>
            <Receipt className="w-4 h-4 text-zinc-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-white mt-2">{formatPrice(grossSales)}</p>
          <p className="text-[11px] text-zinc-500 font-mono mt-1">{t.adminBeforeDiscountsShipping}</p>
        </div>

        {/* Shipping Revenue */}
        <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">{t.adminShippingRevenueCollected}</span>
            <Banknote className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-white mt-2">{formatPrice(totalShippingCollected)}</p>
          <p className="text-[11px] text-zinc-500 font-mono mt-1">{t.adminExpressCourierDelivery}</p>
        </div>

        {/* Discounts Impact */}
        <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">{t.adminDiscountsGivenTotal}</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-amber-400 mt-2">-{formatPrice(totalDiscountsGiven)}</p>
          <p className="text-[11px] text-zinc-500 font-mono mt-1">{t.adminCouponsPromosSavings}</p>
        </div>

        {/* Net Revenue */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-amber-400/10 to-zinc-950 border border-amber-400/30 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-400 font-bold">{t.adminNetCashRealized}</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-white mt-2">{formatPrice(netRevenue)}</p>
          <p className="text-[11px] text-emerald-400 font-mono mt-1">{t.cod}</p>
        </div>
      </div>

      {/* 2. Category Performance & Order Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category */}
        <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 shadow-lg">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                {t.adminSalesByCategoryBreakdown}
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">{categories.length} {t.adminCategoriesCountUnit}</span>
          </div>

          <div className="space-y-4">
            {categorySales.map((cat, idx) => (
              <div key={`cat-sale-${idx}`} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-200 font-medium">{isRTL ? cat.name : cat.nameEn}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-400">{cat.count} {t.items}</span>
                    <span className="text-white font-bold">{formatPrice(cat.revenue)}</span>
                    <span className="text-amber-400 font-bold w-10 text-right">{cat.percentage}%</span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, cat.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Value Tiers */}
        <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 shadow-lg">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                {t.adminOrderBasketSizeDistribution}
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">{nonCancelledOrders.length} {t.orders}</span>
          </div>

          <div className="space-y-4">
            {orderTiers.map((tier, idx) => (
              <div key={`tier-${idx}`} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-200 font-medium">{isRTL ? tier.labelAr : tier.labelEn}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-400">{tier.count} {t.orders}</span>
                    <span className="text-purple-400 font-bold w-10 text-right">{tier.percent}%</span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, tier.percent)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Coupons Performance Matrix */}
      <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 shadow-lg">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              {t.adminPromotionalCouponPerformance}
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">{coupons.length} {t.adminActiveCodesUnit}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-amber-400 text-black font-mono font-bold text-xs tracking-wider">
                  {coupon.code}
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {coupon.discountPercentage}% {t.adminBadgeSale}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                {`${t.adminMinSpend}: ${formatPrice(coupon.minOrderAmount || 0)}`}
              </p>
              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>{t.adminProductTableStatus}</span>
                <span className={coupon.isActive ? 'text-emerald-400' : 'text-zinc-500'}>
                  {coupon.isActive ? t.adminActiveStatus : t.adminInactiveStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
