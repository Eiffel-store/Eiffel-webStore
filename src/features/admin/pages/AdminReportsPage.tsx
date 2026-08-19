import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  PackageCheck,
  AlertTriangle,
  Download,
  Printer,
  Calendar,
  MapPin,
  Layers,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useStoreData, useLanguage, useCurrency, EiffelLoader, EmptyState } from '@/shared';
import { Order, Product } from '@/types';

type ReportPeriod = 'today' | '7d' | '30d' | 'all';

export const AdminReportsPage: React.FC = () => {
  const { orders, products, isOrdersLoading, isProductsLoading } = useStoreData();
  const { isRTL } = useLanguage();
  const { formatPrice } = useCurrency();

  const [period, setPeriod] = useState<ReportPeriod>('all');
  const [isExporting, setIsExporting] = useState(false);

  // 1. Filter orders based on period
  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter((o) => {
      if (!o.createdAt && !o.date) return true;
      const orderDate = new Date(o.createdAt || o.date);
      if (isNaN(orderDate.getTime())) return true;

      if (period === 'today') {
        return (
          orderDate.getDate() === now.getDate() &&
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      } else if (period === '7d') {
        const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
        return diffDays <= 7;
      } else if (period === '30d') {
        const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
        return diffDays <= 30;
      }
      return true;
    });
  }, [orders, period]);

  // 2. Metrics & KPI Calculations
  const metrics = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const nonCancelled = filteredOrders.filter((o) => o.status !== 'Cancelled');
    const totalRevenue = nonCancelled.reduce((sum, o) => sum + (o.total || o.subtotal || 0), 0);
    const deliveredCount = filteredOrders.filter((o) => o.status === 'Delivered').length;
    const processingCount = filteredOrders.filter((o) => o.status === 'Processing' || o.status === 'Shipped').length;
    const pendingCount = filteredOrders.filter((o) => o.status === 'Pending').length;
    const cancelledCount = filteredOrders.filter((o) => o.status === 'Cancelled').length;

    const avgOrderValue = totalOrders > 0 ? totalRevenue / (totalOrders - cancelledCount || 1) : 0;
    const fulfillmentRate = totalOrders > 0 ? Math.round(((totalOrders - cancelledCount) / totalOrders) * 100) : 100;

    // Inventory metrics
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.price || 0) * (p.stock !== undefined ? p.stock : 20), 0);
    const lowStockItems = products.filter((p) => (p.stock !== undefined ? p.stock : 20) <= 5 && (p.stock !== undefined ? p.stock : 20) > 0);
    const outOfStockItems = products.filter((p) => (p.stock !== undefined ? p.stock : 20) === 0 || p.inStock === false);

    return {
      totalOrders,
      totalRevenue,
      deliveredCount,
      processingCount,
      pendingCount,
      cancelledCount,
      avgOrderValue,
      fulfillmentRate,
      totalInventoryValue,
      lowStockItems,
      outOfStockItems
    };
  }, [filteredOrders, products]);

  // 3. Top Selling Products
  const topProducts = useMemo(() => {
    const qtyMap: Record<string, { product?: Product; name: string; qty: number; revenue: number; image?: string }> = {};

    filteredOrders.forEach((o) => {
      if (o.status === 'Cancelled') return;
      o.items?.forEach((item) => {
        const pId = item.productId || item.name;
        if (!qtyMap[pId]) {
          const prod = products.find((p) => p.id === pId);
          qtyMap[pId] = {
            product: prod,
            name: item.name,
            qty: 0,
            revenue: 0,
            image: item.image || prod?.images?.[0]
          };
        }
        qtyMap[pId].qty += item.quantity || 1;
        qtyMap[pId].revenue += (item.price || 0) * (item.quantity || 1);
      });
    });

    return Object.values(qtyMap)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [filteredOrders, products]);

  // 4. Regional Breakdown (Egyptian Governorates)
  const regionalSales = useMemo(() => {
    const govMap: Record<string, { count: number; revenue: number }> = {};

    filteredOrders.forEach((o) => {
      if (o.status === 'Cancelled') return;
      const city = o.shippingAddress?.city?.trim() || (isRTL ? 'القاهرة الكبرى' : 'Greater Cairo');
      if (!govMap[city]) {
        govMap[city] = { count: 0, revenue: 0 };
      }
      govMap[city].count += 1;
      govMap[city].revenue += o.total || o.subtotal || 0;
    });

    return Object.entries(govMap)
      .map(([city, data]) => ({
        city,
        count: data.count,
        revenue: data.revenue,
        percentage: metrics.totalRevenue > 0 ? Math.round((data.revenue / metrics.totalRevenue) * 100) : 0
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
  }, [filteredOrders, metrics.totalRevenue, isRTL]);

  // Export to Excel / CSV with UTF-8 BOM for perfect Arabic display
  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Governorate / City', 'Status', 'Total (EGP)'];
      const rows = filteredOrders.map((o) => [
        `"${o.id}"`,
        `"${new Date(o.createdAt || o.date || Date.now()).toLocaleDateString('ar-EG')}"`,
        `"${o.shippingAddress?.firstName || ''} ${o.shippingAddress?.lastName || ''}"`,
        `"${o.shippingAddress?.phone || ''}"`,
        `"${o.shippingAddress?.city || ''}"`,
        `"${o.status}"`,
        `"${o.total || o.subtotal || 0}"`
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `EIFFEL_Sales_Report_${period}_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isLoading = isOrdersLoading || isProductsLoading;

  return (
    <div className="space-y-8 print:p-0 print:space-y-4">
      {/* 1. Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-wide">
              {isRTL ? 'مركز التقارير والتحليلات المالية' : 'Business Reports & Analytics'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-400/10 text-amber-400 border border-amber-400/20">
              PRO
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {isRTL
              ? 'متابعة حركة المبيعات، مؤشرات الأداء الرئيسية (KPIs)، تحليل المناطق الأكثر طلباً وإدارة المخزون الحرج.'
              : 'Real-time sales velocity, revenue metrics, regional delivery demand, and low-stock diagnostics.'}
          </p>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2.5 print:hidden">
          {/* Period Selector Pills */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded p-1">
            {(
              [
                { id: 'today', labelAr: 'اليوم', labelEn: 'Today' },
                { id: '7d', labelAr: 'آخر 7 أيام', labelEn: '7 Days' },
                { id: '30d', labelAr: 'آخر 30 يوم', labelEn: '30 Days' },
                { id: 'all', labelAr: 'كل الفترات', labelEn: 'All Time' }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPeriod(tab.id)}
                className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-all ${
                  period === tab.id
                    ? 'bg-amber-400 text-black shadow font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                {isRTL ? tab.labelAr : tab.labelEn}
              </button>
            ))}
          </div>

          {/* Export CSV / Excel */}
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={isExporting || filteredOrders.length === 0}
            className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white rounded text-xs font-mono flex items-center gap-2 transition-colors disabled:opacity-50"
            title={isRTL ? 'تصدير شيت إكسيل' : 'Export Excel'}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">{isRTL ? 'تصدير Excel' : 'Export CSV'}</span>
          </button>

          {/* Print Report */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white rounded text-xs font-mono flex items-center gap-2 transition-colors"
            title={isRTL ? 'طباعة التقرير' : 'Print Report'}
          >
            <Printer className="w-4 h-4 text-zinc-400" />
            <span className="hidden sm:inline">{isRTL ? 'طباعة التقرير' : 'Print'}</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <EiffelLoader message={isRTL ? 'جاري تجميع وحساب التقارير والبيانات المالية...' : 'Calculating financial analytics...'} />
      ) : orders.length === 0 ? (
        <EmptyState
          title={isRTL ? 'لا توجد بيانات كافية لإنشاء التقارير' : 'No Data Available for Analytics'}
          description={isRTL ? 'عند تسجيل طلبات جديدة من العملاء وإضافة منتجات، ستظهر هنا التحليلات المالية وتقارير الأداء بشكل فوري.' : 'As new orders and products are registered, analytical charts and reports will populate here.'}
        />
      ) : (
        <>
          {/* 2. Top Executive KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Revenue */}
            <div className="p-5 rounded-lg bg-gradient-to-br from-zinc-900/90 to-zinc-950 border border-zinc-800 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400">{isRTL ? 'إجمالي الإيرادات' : 'Total Revenue'}</span>
                <div className="p-2 rounded bg-amber-400/10 text-amber-400">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-white mt-3">
                {formatPrice(metrics.totalRevenue)}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2 font-mono">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{isRTL ? 'صافي المبيعات المحققة' : 'Net Completed Sales'}</span>
              </div>
            </div>

            {/* Total Orders & Fulfillment */}
            <div className="p-5 rounded-lg bg-gradient-to-br from-zinc-900/90 to-zinc-950 border border-zinc-800 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400">{isRTL ? 'إجمالي الطلبات' : 'Total Orders'}</span>
                <div className="p-2 rounded bg-blue-400/10 text-blue-400">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-white mt-3">
                {metrics.totalOrders} <span className="text-xs text-zinc-500 font-sans">{isRTL ? 'طلب' : 'orders'}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-2 font-mono">
                <span className="text-emerald-400">{metrics.deliveredCount} {isRTL ? 'مكتمل' : 'delivered'}</span>
                <span>•</span>
                <span className="text-amber-400">{metrics.pendingCount + metrics.processingCount} {isRTL ? 'قيد التجهيز' : 'active'}</span>
              </div>
            </div>

            {/* Average Order Value (AOV) */}
            <div className="p-5 rounded-lg bg-gradient-to-br from-zinc-900/90 to-zinc-950 border border-zinc-800 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400">{isRTL ? 'متوسط قيمة الطلب' : 'Average Order Value'}</span>
                <div className="p-2 rounded bg-purple-400/10 text-purple-400">
                  <PackageCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-white mt-3">
                {formatPrice(metrics.avgOrderValue)}
              </div>
              <div className="text-[11px] text-zinc-400 mt-2 font-mono">
                {isRTL ? `معدل إتمام الشراء: ${metrics.fulfillmentRate}%` : `Fulfillment Rate: ${metrics.fulfillmentRate}%`}
              </div>
            </div>

            {/* Inventory Asset Value */}
            <div className="p-5 rounded-lg bg-gradient-to-br from-zinc-900/90 to-zinc-950 border border-zinc-800 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400">{isRTL ? 'قيمة بضاعة المخزون' : 'Inventory Asset Value'}</span>
                <div className="p-2 rounded bg-emerald-400/10 text-emerald-400">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-white mt-3">
                {formatPrice(metrics.totalInventoryValue)}
              </div>
              <div className="flex items-center gap-2 text-[11px] mt-2 font-mono">
                <span className="text-zinc-400">{products.length} {isRTL ? 'موديل' : 'items'}</span>
                {metrics.lowStockItems.length > 0 && (
                  <span className="text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                    {metrics.lowStockItems.length} {isRTL ? 'مخزون منخفض' : 'low stock'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 3. Detailed Visual Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Selling Products */}
            <div className="p-6 rounded-lg bg-zinc-950 border border-zinc-800/80 shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                    {isRTL ? 'المنتجات الأكثر مبيعاً وإيراداً' : 'Top Performing Products'}
                  </h2>
                </div>
                <span className="text-xs font-mono text-zinc-500">
                  {isRTL ? `أعلى ${topProducts.length} قطع` : `Top ${topProducts.length}`}
                </span>
              </div>

              {topProducts.length === 0 ? (
                <p className="text-xs text-zinc-500 font-mono py-8 text-center">
                  {isRTL ? 'لا توجد مبيعات مسجلة في هذه الفترة' : 'No sales recorded in this period'}
                </p>
              ) : (
                <div className="space-y-3">
                  {topProducts.map((p, idx) => (
                    <div
                      key={`top-p-${idx}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-mono font-bold text-amber-400">
                          {idx + 1}
                        </span>
                        {p.image && (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded object-cover border border-zinc-800 bg-zinc-900"
                          />
                        )}
                        <div>
                          <p className="text-xs font-medium text-white line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-zinc-400 font-mono">
                            {p.qty} {isRTL ? 'قطعة مباعة' : 'units sold'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-xs font-bold text-white">{formatPrice(p.revenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Regional Sales (Governorates) */}
            <div className="p-6 rounded-lg bg-zinc-950 border border-zinc-800/80 shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                    {isRTL ? 'توزيع الطلبات حسب المحافظات' : 'Regional Delivery Analytics'}
                  </h2>
                </div>
                <span className="text-xs font-mono text-zinc-500">{isRTL ? 'جمهورية مصر' : 'Egypt'}</span>
              </div>

              {regionalSales.length === 0 ? (
                <p className="text-xs text-zinc-500 font-mono py-8 text-center">
                  {isRTL ? 'لا توجد بيانات شحن لهذه الفترة' : 'No delivery data in this period'}
                </p>
              ) : (
                <div className="space-y-4">
                  {regionalSales.map((reg, idx) => (
                    <div key={`gov-${idx}`} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-zinc-300 font-medium">{reg.city}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-zinc-400">
                            {reg.count} {isRTL ? 'طلب' : 'orders'}
                          </span>
                          <span className="text-white font-bold">{formatPrice(reg.revenue)}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(5, reg.percentage)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 4. Inventory Diagnostics & Urgent Stock Alerts */}
          <div className="p-6 rounded-lg bg-zinc-950 border border-zinc-800/80 shadow-md">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  {isRTL ? 'تنبيهات المخزون الحرج والقطع الموشكة على النفاد' : 'Critical Stock & Replenishment Alerts'}
                </h2>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                {metrics.lowStockItems.length + metrics.outOfStockItems.length} {isRTL ? 'تنبيه' : 'alerts'}
              </span>
            </div>

            {metrics.lowStockItems.length === 0 && metrics.outOfStockItems.length === 0 ? (
              <div className="py-6 text-center text-xs font-mono text-emerald-400 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isRTL ? 'جميع المنتجات متوفرة بمخزون وفير ولا يوجد عجز' : 'All products have healthy inventory levels'}</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[...metrics.outOfStockItems, ...metrics.lowStockItems].map((prod) => {
                  const currentStock = prod.stock !== undefined ? prod.stock : 0;
                  const isOut = currentStock === 0 || !prod.inStock;

                  return (
                    <div
                      key={`alert-${prod.id}`}
                      className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${
                        isOut
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        {prod.images?.[0] && (
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-10 h-10 rounded object-cover border border-zinc-800 bg-zinc-900 shrink-0"
                          />
                        )}
                        <div className="overflow-hidden">
                          <p className="text-xs font-medium text-white truncate">{prod.name}</p>
                          <p className="text-[10px] text-zinc-400 font-mono">{prod.id}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            isOut ? 'bg-rose-500 text-white' : 'bg-amber-400 text-black'
                          }`}
                        >
                          {isOut
                            ? (isRTL ? 'نفد المخزون' : 'Out of Stock')
                            : `${currentStock} ${isRTL ? 'متبقي' : 'left'}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
