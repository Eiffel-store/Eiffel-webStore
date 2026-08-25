import React from 'react';
import { AdminWelcomeBanner } from '../components/dashboard/AdminWelcomeBanner';
import { AdminStatCards } from '../components/dashboard/AdminStatCards';
import { AdminQuickNav } from '../components/dashboard/AdminQuickNav';
import { AdminRecentOrders } from '../components/dashboard/AdminRecentOrders';
import { AdminCatalogPreview } from '../components/dashboard/AdminCatalogPreview';
import { useStoreData, useLanguage, EiffelLoader } from '@/shared';

export const AdminDashboardPage: React.FC = () => {
  const { isProductsLoading, isOrdersLoading } = useStoreData();
  const { t } = useLanguage();

  if (isProductsLoading && isOrdersLoading) {
    return (
      <div className="py-24">
        <EiffelLoader message={t.adminLoadingDashboard} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Welcome & Quick CTA Banner */}
      <AdminWelcomeBanner />

      {/* 2. Key Metrics & KPIs */}
      <AdminStatCards />

      {/* 3. Quick Navigation Grid */}
      <AdminQuickNav />

      {/* 4. Live Activity: Recent Orders & Catalog Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        <div className="lg:col-span-7">
          <AdminRecentOrders />
        </div>
        <div className="lg:col-span-5">
          <AdminCatalogPreview />
        </div>
      </div>
    </div>
  );
};
