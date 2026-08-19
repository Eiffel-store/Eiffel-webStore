import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Layers,
  Truck,
  Users,
  DollarSign
} from 'lucide-react';
import { useLanguage, useCurrency } from '@/shared';
import { Order, Product } from '@/types';

interface AdminReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  products: Product[];
}

type ReportPreset = 'financial' | 'inventory' | 'logistics' | 'vip_customers';

export const AdminReportExportModal: React.FC<AdminReportExportModalProps> = ({
  isOpen,
  onClose,
  orders,
  products
}) => {
  const { isRTL } = useLanguage();
  const { formatPrice } = useCurrency();

  const [preset, setPreset] = useState<ReportPreset>('financial');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  if (!isOpen) return null;

  // Filter orders by date & status
  const getFilteredData = () => {
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      const orderDate = new Date(o.createdAt || o.date || Date.now());
      if (startDate && orderDate < new Date(startDate)) return false;
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59);
        if (orderDate > end) return false;
      }
      return true;
    });
  };

  const handleExportCSV = () => {
    const filteredOrders = getFilteredData();
    let csvRows: string[][] = [];
    let filename = `EIFFEL_Report_${preset}_${new Date().toISOString().slice(0, 10)}.csv`;

    if (preset === 'financial') {
      const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'City', 'Status', 'Subtotal (EGP)', 'Shipping (EGP)', 'Discount (EGP)', 'Total (EGP)'];
      csvRows = [
        headers,
        ...filteredOrders.map((o) => [
          `"${o.id}"`,
          `"${new Date(o.createdAt || o.date || Date.now()).toLocaleDateString('ar-EG')}"`,
          `"${o.shippingAddress?.firstName || ''} ${o.shippingAddress?.lastName || ''}"`,
          `"${o.shippingAddress?.phone || ''}"`,
          `"${o.shippingAddress?.city || ''}"`,
          `"${o.status}"`,
          `"${o.subtotal || 0}"`,
          `"${o.shipping || 0}"`,
          `"${o.discount || 0}"`,
          `"${o.total || 0}"`
        ])
      ];
    } else if (preset === 'inventory') {
      const headers = ['Product ID', 'Product Name', 'Category', 'Price (EGP)', 'Stock Remaining', 'In Stock Status', 'Total Stock Value (EGP)'];
      csvRows = [
        headers,
        ...products.map((p) => {
          const stock = p.stock !== undefined ? p.stock : 20;
          return [
            `"${p.id}"`,
            `"${p.name}"`,
            `"${p.category}"`,
            `"${p.price || 0}"`,
            `"${stock}"`,
            `"${stock > 0 && p.inStock ? 'Available' : 'Out of Stock'}"`,
            `"${(p.price || 0) * stock}"`
          ];
        })
      ];
    } else if (preset === 'logistics') {
      const headers = ['Order ID', 'Recipient Name', 'Recipient Phone', 'Governorate / City', 'Delivery Address', 'Payment Mode', 'COD Amount to Collect (EGP)', 'Current Status'];
      csvRows = [
        headers,
        ...filteredOrders.map((o) => [
          `"${o.id}"`,
          `"${o.shippingAddress?.firstName || ''} ${o.shippingAddress?.lastName || ''}"`,
          `"${o.shippingAddress?.phone || ''}"`,
          `"${o.shippingAddress?.city || ''}"`,
          `"${o.shippingAddress?.streetAddress || ''} ${o.shippingAddress?.apartment || ''}"`,
          `"Cash On Delivery"`,
          `"${o.total || 0}"`,
          `"${o.status}"`
        ])
      ];
    } else if (preset === 'vip_customers') {
      const headers = ['Client Name', 'Phone', 'Governorate', 'Total Orders Count', 'Total Lifetime Spend (EGP)'];
      const custMap: Record<string, { name: string; phone: string; city: string; count: number; spend: number }> = {};

      orders.forEach((o) => {
        const phone = o.shippingAddress?.phone || o.customerPhone || 'N/A';
        const name = `${o.shippingAddress?.firstName || ''} ${o.shippingAddress?.lastName || ''}`.trim() || 'Client';
        const city = o.shippingAddress?.city || 'Cairo';

        if (!custMap[phone]) custMap[phone] = { name, phone, city, count: 0, spend: 0 };
        custMap[phone].count += 1;
        if (o.status !== 'Cancelled') custMap[phone].spend += o.total || 0;
      });

      csvRows = [
        headers,
        ...Object.values(custMap)
          .sort((a, b) => b.spend - a.spend)
          .map((c) => [
            `"${c.name}"`,
            `"${c.phone}"`,
            `"${c.city}"`,
            `"${c.count}"`,
            `"${c.spend}"`
          ])
      ];
    }

    const csvContent = '\uFEFF' + csvRows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl animate-fade-in text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                {isRTL ? 'مركز تخصيص واستخراج التقارير' : 'Custom Report Export Hub'}
              </h2>
              <p className="text-xs text-zinc-400 font-light">
                {isRTL ? 'اختر نوع التقرير والفترة الزمنية للتصدير إلى Excel/CSV' : 'Select preset template & parameters'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Preset Selector */}
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-2">
              {isRTL ? '1. اختر نموذج التقرير المطلوب:' : '1. Select Report Template:'}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'financial', labelAr: 'تقرير المبيعات والتدفقات المالية', labelEn: 'Financial & Revenue', icon: DollarSign },
                { id: 'inventory', labelAr: 'تقرير المخزون للمشغل والمصنع', labelEn: 'Inventory & Stock Value', icon: Layers },
                { id: 'logistics', labelAr: 'مانفست شحنات شركة الشحن (COD)', labelEn: 'Logistics & Shipping Manifest', icon: Truck },
                { id: 'vip_customers', labelAr: 'سجل العملاء المميزين VIP', labelEn: 'VIP Clients Directory', icon: Users }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = preset === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPreset(item.id as ReportPreset)}
                    className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all ${
                      isSelected
                        ? 'bg-amber-400/10 border-amber-400 text-amber-300 shadow-md'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`} />
                    <div>
                      <p className="text-xs font-mono font-bold leading-tight">
                        {isRTL ? item.labelAr : item.labelEn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range & Status Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-800/80">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                {isRTL ? 'من تاريخ:' : 'From Date:'}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                {isRTL ? 'إلى تاريخ:' : 'To Date:'}
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {preset !== 'inventory' && (
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                {isRTL ? 'تصفية حسب حالة الطلب:' : 'Order Status:'}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="all">{isRTL ? 'جميع الحالات' : 'All Statuses'}</option>
                <option value="Delivered">{isRTL ? 'تم التسليم فقط' : 'Delivered Only'}</option>
                <option value="Processing">{isRTL ? 'قيد التجهيز والشحن' : 'Processing / In Transit'}</option>
                <option value="Pending">{isRTL ? 'قيد المراجعة' : 'Pending'}</option>
                <option value="Cancelled">{isRTL ? 'الملغي والمرتجع' : 'Cancelled'}</option>
              </select>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-zinc-800 bg-zinc-900/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            {isRTL ? 'إلغاء' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-5 py-2 rounded bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-400/20 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{isRTL ? 'تنزيل التقرير (Excel / CSV)' : 'Download CSV Report'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
