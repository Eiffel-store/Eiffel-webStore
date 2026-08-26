import React, { useState, useMemo, useEffect } from 'react';
import { useStoreData, useLanguage, AdminTableSkeleton, EmptyState, Pagination } from '@/shared';
import { Order } from '@/types';
import { AdminOrderFilterBar } from '../components/orders/AdminOrderFilterBar';
import { AdminOrdersTable } from '../components/orders/AdminOrdersTable';
import { AdminOrderDetailsModal } from '../components/orders/AdminOrderDetailsModal';

export const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder, isOrdersLoading } = useStoreData();
  const { t } = useLanguage();

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      const q = (searchQuery || '').toLowerCase();
      const matchesSearch =
        (o.id || '').toLowerCase().includes(q) ||
        (o.customerName && o.customerName.toLowerCase().includes(q)) ||
        (o.customerEmail && o.customerEmail.toLowerCase().includes(q)) ||
        (o.customerPhone && o.customerPhone.includes(searchQuery)) ||
        (o.shippingAddress?.firstName && o.shippingAddress.firstName.toLowerCase().includes(q)) ||
        (o.shippingAddress?.lastName && o.shippingAddress.lastName.toLowerCase().includes(q)) ||
        (o.shippingAddress?.phone && o.shippingAddress.phone.includes(searchQuery)) ||
        (o.shippingAddress?.city && o.shippingAddress.city.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  const handleUpdateStatus = (id: string, status: Order['status']) => {
    updateOrderStatus(id, status);
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder(prev => prev ? { ...prev, status } : null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-wide">
            {t.adminCustomerOrdersManagement}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {orders.length} {t.orders}
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

      {/* Loading / Empty / Table */}
      {isOrdersLoading && orders.length === 0 ? (
        <AdminTableSkeleton rows={5} />
      ) : orders.length === 0 ? (
        <EmptyState
          title={t.adminNoOrdersYet}
          description={t.adminOrdersAppearHere}
        />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          title={t.noMatchingPieces}
          description={t.noPiecesFoundDesc}
          actionText={t.resetFilters}
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('all');
          }}
        />
      ) : (
        /* Orders Table & Pagination */
        <div className="space-y-4">
          <AdminOrdersTable
            orders={paginatedOrders}
            onSelectOrder={setSelectedOrder}
            onUpdateStatus={handleUpdateStatus}
            onDeleteOrder={deleteOrder}
          />

          {filteredOrders.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredOrders.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(s) => {
                setPageSize(s);
                setCurrentPage(1);
              }}
              pageSizeOptions={[5, 10, 25, 50]}
            />
          )}
        </div>
      )}

      {/* Order Details & Printing Modal */}
      <AdminOrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};
