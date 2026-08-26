import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Layers,
  MapPin,
  Users,
  Printer,
  Download,
  FileSpreadsheet,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useStoreData, useLanguage, useCurrency, AdminTableSkeleton, EmptyState } from '@/shared';
import { AdminReportOverviewTab } from '../components/reports/AdminReportOverviewTab';
import { AdminReportSalesTab } from '../components/reports/AdminReportSalesTab';
import { AdminReportProductsTab } from '../components/reports/AdminReportProductsTab';
import { AdminReportLogisticsTab } from '../components/reports/AdminReportLogisticsTab';
import { AdminReportCustomersTab } from '../components/reports/AdminReportCustomersTab';
import { AdminReportExportModal } from '../components/reports/AdminReportExportModal';

type ReportTab = 'overview' | 'sales' | 'products' | 'logistics' | 'customers';
type ReportPeriod = 'today' | '7d' | '30d' | 'all';

export const AdminReportsPage: React.FC = () => {
  const { orders, products, categories, coupons, isOrdersLoading, isProductsLoading } = useStoreData();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  const [activeTab, setActiveTab] = useState<ReportTab>('overview');
  const [period, setPeriod] = useState<ReportPeriod>('all');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Period filtering
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

  const isLoading = isOrdersLoading || isProductsLoading;

  const tabs = [
    { id: 'overview', label: t.adminExecutiveSummary, icon: BarChart3 },
    { id: 'sales', label: t.adminSalesAndCoupons, icon: DollarSign },
    { id: 'products', label: t.adminProductsAndSizing, icon: Layers },
    { id: 'logistics', label: t.adminLogisticsAndRegions, icon: MapPin },
    { id: 'customers', label: t.adminVipClients, icon: Users }
  ] as const;

  return (
    <div className="space-y-8">
      {/* 1. Header & Navigation Hub */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-wide">
              {t.adminReportsTitle}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-400/10 text-amber-400 border border-amber-400/20 font-bold">
              ENTERPRISE
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {t.adminReportsDesc}
          </p>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Period Selector Pills */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded p-1">
            {(
              [
                { id: 'today', label: t.adminPeriodToday },
                { id: '7d', label: t.adminPeriod7d },
                { id: '30d', label: t.adminPeriod30d },
                { id: 'all', label: t.adminPeriodAll }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPeriod(tab.id)}
                className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
                  period === tab.id
                    ? 'bg-amber-400 text-black shadow font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Export Report Builder Button */}
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white rounded text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer"
            title={t.adminExportExcel}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>{t.adminExportExcel}</span>
          </button>

          {/* Print Report */}
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white rounded text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer"
            title={t.adminPrint}
          >
            <Printer className="w-4 h-4 text-zinc-400" />
            <span>{t.adminPrint}</span>
          </button>
        </div>
      </div>

      {/* 2. Specialized Module Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800/60 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as ReportTab)}
              className={`px-4 py-2.5 rounded-lg text-xs font-mono font-medium flex items-center gap-2.5 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-black font-bold shadow-lg shadow-amber-400/10'
                  : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents with Dynamic States */}
      {isLoading && orders.length === 0 ? (
        <AdminTableSkeleton rows={5} />
      ) : orders.length === 0 ? (
        <EmptyState
          title={t.adminNoAnalyticsData}
          description={t.adminNoAnalyticsDataDesc}
        />
      ) : (
        <div>
          {activeTab === 'overview' && (
            <AdminReportOverviewTab orders={filteredOrders} products={products} period={period} />
          )}

          {activeTab === 'sales' && (
            <AdminReportSalesTab
              orders={filteredOrders}
              products={products}
              categories={categories}
              coupons={coupons}
            />
          )}

          {activeTab === 'products' && (
            <AdminReportProductsTab orders={filteredOrders} products={products} />
          )}

          {activeTab === 'logistics' && (
            <AdminReportLogisticsTab orders={filteredOrders} />
          )}

          {activeTab === 'customers' && (
            <AdminReportCustomersTab orders={filteredOrders} />
          )}
        </div>
      )}

      {/* Custom Report Exporter Modal */}
      <AdminReportExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        orders={orders}
        products={products}
      />
    </div>
  );
};
