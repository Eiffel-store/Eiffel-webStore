import React, { useState } from 'react';
import { useStoreData, useLanguage } from '@/shared';
import { Order } from '@/types';
import { AdminOrderFilterBar } from '../components/orders/AdminOrderFilterBar';
import { AdminOrdersTable } from '../components/orders/AdminOrdersTable';
import { AdminOrderDetailsModal } from '../components/orders/AdminOrderDetailsModal';

export const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder } = useStoreData();
  const { isRTL } = useLanguage();

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.shippingAddress?.firstName && o.shippingAddress.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.shippingAddress?.lastName && o.shippingAddress.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.shippingAddress?.phone && o.shippingAddress.phone.includes(searchQuery)) ||
      (o.shippingAddress?.city && o.shippingAddress.city.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-wide">
            {isRTL ? 'سجل وإدارة طلبات العملاء' : 'Customer Orders & Fulfillment'}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {isRTL
              ? `إجمالي ${orders.length} طلب مسجل — يمكنك متابعة وتحديث حالة الشحن والدفع.`
              : `Total ${orders.length} orders received from store checkout.`}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <AdminOrderFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Orders Table */}
      <AdminOrdersTable
        orders={filteredOrders}
        onSelectOrder={setSelectedOrder}
        onUpdateStatus={updateOrderStatus}
        onDeleteOrder={deleteOrder}
      />

      {/* Order Details & Printing Modal */}
      <AdminOrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={updateOrderStatus}
      />
    </div>
  );
};
