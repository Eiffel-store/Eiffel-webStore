import React from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '@/shared';

interface AdminOrderFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusChange: (st: string) => void;
}

export const AdminOrderFilterBar: React.FC<AdminOrderFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange
}) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-zinc-950 p-4 border border-zinc-800">
      <div className="sm:col-span-8 relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.adminSearchOrdersPlaceholder}
          className="w-full bg-zinc-900 border border-zinc-700 pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white transition-colors"
        />
      </div>

      <div className="sm:col-span-4">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors"
        >
          <option value="all">{t.adminAllStatuses}</option>
          <option value="Awaiting_Confirmation">📞 {t.adminAwaitingConfirmation}</option>
          <option value="Confirmed">✅ {t.adminConfirmedStatus}</option>
          <option value="Pending">⏳ {t.adminPendingStatus}</option>
          <option value="Processing">📦 {t.adminProcessingStatus}</option>
          <option value="Shipped">🚚 {t.adminShippedStatus}</option>
          <option value="Delivered">✓ {t.adminDeliveredStatus}</option>
          <option value="Cancelled">✕ {t.adminCancelledStatus}</option>
        </select>
      </div>
    </div>
  );
};
