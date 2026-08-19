import React, { useState, useMemo, useEffect } from 'react';
import { useStoreData, useLanguage, EiffelLoader, EmptyState, Pagination } from '@/shared';
import { Order } from '@/types';
import { AdminOrderFilterBar } from '../components/orders/AdminOrderFilterBar';
import { AdminOrdersTable } from '../components/orders/AdminOrdersTable';
import { AdminOrderDetailsModal } from '../components/orders/AdminOrderDetailsModal';

export const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder, isOrdersLoading } = useStoreData();
  const { isRTL } = useLanguage();

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      const matchesSearch =
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.shippingAddress?.firstName && o.shippingAddress.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (o.shippingAddress?.lastName && o.shippingAddress.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (o.shippingAddress?.phone && o.shippingAddress.phone.includes(searchQuery)) ||
        (o.shippingAddress?.city && o.shippingAddress.city.toLowerCase().includes(searchQuery.toLowerCase()));

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
            {isRTL ? 'سجل وإدارة طلبات العملاء' : 'Customer Orders & Fulfillment'}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {isRTL
              ? `إجمالي ${orders.length} طلب مسجل — يمكنك متابعة وتحديث حالة الشحن والدفع وتغيير الحالة مباشرة.`
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

      {/* Loading / Empty / Table */}
      {isOrdersLoading ? (
        <EiffelLoader message={isRTL ? 'جاري جلب سجل الطلبات من قاعدة البيانات...' : 'Fetching orders from database...'} />
      ) : orders.length === 0 ? (
        <EmptyState
          title={isRTL ? 'لا توجد طلبات مسجلة حتى الآن' : 'No Orders Recorded Yet'}
          description={isRTL ? 'عند قيام العملاء بإجراء طلبات عبر المتجر، ستظهر تلقائياً هنا مع تفاصيل الشحن والمبلغ المطلوب كاش والتواصل واتساب.' : 'Customer orders placed on the store will automatically appear here.'}
        />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          title={isRTL ? 'لا توجد طلبات مطابقة لمعايير البحث' : 'No Matching Orders'}
          description={isRTL ? 'يرجى مراجعة رقم الطلب أو اسم العميل أو ضبط فلتر الحالة.' : 'Please adjust your search keywords or status filter.'}
          actionText={isRTL ? 'عرض جميع الطلبات' : 'Show All Orders'}
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

          {totalPages > 1 && (
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
              pageSizeOptions={[10, 25, 50]}
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
