import React, { useState, useMemo, useEffect } from 'react';
import { Users, Crown, RefreshCw } from 'lucide-react';
import { useStoreData, useLanguage, EiffelLoader, EmptyState } from '@/shared';
import toast from 'react-hot-toast';
import { customerService } from '@/services/customerService';
import { User } from '@/types';
import { AdminTeamTab } from '../components/team';
import {
  CustomerStatsCards,
  CustomerFiltersBar,
  CustomerTable,
  CustomerPointsModal,
} from '../components/customers';

export const AdminCustomersPage: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<'customers' | 'team'>('customers');
  const { orders, isOrdersLoading, settings } = useStoreData();
  const { isRTL, t } = useLanguage();

  const [backendCustomers, setBackendCustomers] = useState<User[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'vip' | 'member'>('all');
  const [selectedCustomerForPoints, setSelectedCustomerForPoints] = useState<User | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 1. Fetch real customer accounts from backend MongoDB API
  const fetchCustomers = async () => {
    setIsLoadingCustomers(true);
    try {
      const data = await customerService.getAllCustomers();
      setBackendCustomers(data);
    } catch (err) {
      console.error('Failed to load customers from backend API:', err);
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // 2. Synthesize Real Registered Users + Real Order Customers
  const allMergedCustomers = useMemo(() => {
    const custMap: Record<string, User> = {};

    const normalizePhone = (p?: string) => {
      if (!p) return '';
      const digits = p.replace(/\D/g, '');
      return digits.startsWith('20') && digits.length === 12 ? digits.slice(2) : digits;
    };

    // First add real registered MongoDB users
    backendCustomers.forEach((u) => {
      const emailKey = u.email ? u.email.trim().toLowerCase() : '';
      const cleanPhone = normalizePhone(u.phone);
      const primaryKey = emailKey || cleanPhone || String(u.id);

      const userPoints = (u as any).points ?? u.tierPoints ?? 0;
      const isVip = Boolean(u.isVip) || u.tier === 'VIP' || u.tier === 'VIP_PLATINUM';

      const entry: User = {
        ...u,
        email: u.email || '',
        phone: u.phone || '',
        tier: isVip ? 'VIP' : 'MEMBER',
        tierPoints: userPoints,
        points: userPoints,
        completedOrdersCount: u.completedOrdersCount || 0,
        totalSpend: u.totalSpend || 0,
        isVip,
        memberSince: u.memberSince ? new Date(u.memberSince).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US') : '2026',
        orders: u.orders || []
      };

      if (emailKey) custMap[emailKey] = entry;
      if (cleanPhone) custMap[cleanPhone] = entry;
      custMap[primaryKey] = entry;
    });

    // Cross-reference with real orders from database
    orders.forEach((o) => {
      const email = o.customerEmail ? o.customerEmail.trim().toLowerCase() : '';
      const rawPhone = o.customerPhone || o.shippingAddress?.phone || '';
      const cleanPhone = normalizePhone(rawPhone);
      const name = o.customerName || `${o.shippingAddress?.firstName || ''} ${o.shippingAddress?.lastName || ''}`.trim() || 'عميل إيفل';

      const target = (email && custMap[email]) || (cleanPhone && custMap[cleanPhone]);
      const isDelivered = String(o.status || '').toLowerCase() === 'delivered';
      const isNotCancelled = String(o.status || '').toLowerCase() !== 'cancelled';
      const orderAmount = Number(o.total || o.subtotal || 0);

      if (target) {
        const orderExists = target.orders && target.orders.some(existing => existing.id === o.id);
        if (!orderExists) {
          if (!target.orders) target.orders = [];
          target.orders.push(o);

          if (isNotCancelled && (!target.totalSpend || target.totalSpend === 0)) {
            target.totalSpend = (target.totalSpend || 0) + orderAmount;
          }
          if (isDelivered && (!target.completedOrdersCount || target.completedOrdersCount === 0)) {
            target.completedOrdersCount = (target.completedOrdersCount || 0) + 1;
          }
        }
      } else {
        const fallbackKey = email || cleanPhone || o.id;
        const newCust: User = {
          id: `order-cust-${fallbackKey}`,
          name,
          email: email || (cleanPhone ? `${cleanPhone}@eiffel-guest.eg` : 'guest@eiffel.eg'),
          phone: rawPhone || cleanPhone || 'N/A',
          role: 'ROLE_CUSTOMER',
          tier: 'MEMBER',
          tierPoints: o.pointsEarned || 0,
          points: o.pointsEarned || 0,
          completedOrdersCount: isDelivered ? 1 : 0,
          totalSpend: isNotCancelled ? orderAmount : 0,
          isVip: false,
          memberSince: o.createdAt || o.date || new Date().toISOString(),
          addresses: o.shippingAddress ? [o.shippingAddress] : [],
          paymentMethods: [],
          orders: [o]
        };
        if (email) custMap[email] = newCust;
        if (cleanPhone) custMap[cleanPhone] = newCust;
        custMap[fallbackKey] = newCust;
      }
    });

    const uniqueMap = new Map<string, User>();
    Object.values(custMap).forEach((c) => {
      const uid = String(c.id || c.email || c.phone);
      if (!uniqueMap.has(uid)) {
        uniqueMap.set(uid, c);
      }
    });

    return Array.from(uniqueMap.values());
  }, [backendCustomers, orders, settings, isRTL]);

  // 3. Toggle VIP Status
  const handleToggleVip = async (customer: User) => {
    if (!customer.id) return;
    setIsUpdating(true);
    const nextVip = !(customer.tier === 'VIP' || customer.isVip);

    try {
      await customerService.toggleVip(customer.id, nextVip);
      setBackendCustomers((prev) =>
        prev.map((c) => (c.id === customer.id ? { ...c, tier: nextVip ? 'VIP' : 'MEMBER', isVip: nextVip } : c))
      );
      toast.success(
        nextVip ? `${t.adminVipUpgradeSuccess} 👑` : t.adminVipRevokeSuccess,
        { id: `vip-toggle-${customer.id}` }
      );
    } catch (err) {
      toast.error(t.adminVipToggleError);
    } finally {
      setIsUpdating(false);
    }
  };

  // 4. Adjust Points
  const handleSavePoints = async (delta: number) => {
    if (!selectedCustomerForPoints || !selectedCustomerForPoints.id) return;
    setIsUpdating(true);

    try {
      await customerService.adjustPoints(selectedCustomerForPoints.id, delta);
      setBackendCustomers((prev) =>
        prev.map((c) => {
          if (c.id === selectedCustomerForPoints.id) {
            const current = c.tierPoints || 0;
            return { ...c, tierPoints: Math.max(0, current + delta) };
          }
          return c;
        })
      );
      toast.success(
        `${t.adminPointsUpdateSuccess} (${delta > 0 ? '+' : ''}${delta} PTS)`
      );
      setSelectedCustomerForPoints(null);
    } catch (err) {
      toast.error(t.adminPointsAdjustError);
    } finally {
      setIsUpdating(false);
    }
  };

  // 5. Filtered & Searched Customers
  const filteredCustomers = useMemo(() => {
    return allMergedCustomers.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        c.name.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.phone && c.phone.includes(q));

      const isVip = c.tier === 'VIP' || c.isVip;
      if (tierFilter === 'vip' && !isVip) return false;
      if (tierFilter === 'member' && isVip) return false;

      return matchesQuery;
    });
  }, [allMergedCustomers, searchQuery, tierFilter]);

  // Paginated slice
  const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, currentPage, pageSize]);

  // KPIs
  const totalCustomers = allMergedCustomers.length;
  const totalVipCount = allMergedCustomers.filter((c) => c.tier === 'VIP' || c.isVip).length;
  const totalPointsInCirculation = allMergedCustomers.reduce((sum, c) => sum + (c.tierPoints || 0), 0);
  const totalCustomerSpend = allMergedCustomers.reduce((sum, c) => sum + (c.totalSpend || 0), 0);

  const isLoading = isLoadingCustomers || isOrdersLoading;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Header & Main Section Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-wide">
            {t.adminCustomersAndTeam}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {t.adminCustomersAndTeamDesc}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            type="button"
            onClick={fetchCustomers}
            disabled={isLoading}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors disabled:opacity-50 cursor-pointer"
            title={t.refresh}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {/* Tab Switcher */}
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setActiveMainTab('customers')}
              className={`px-4 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMainTab === 'customers'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t.adminCustomersAndLoyaltyTab}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab('team')}
              className={`px-4 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMainTab === 'team'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{t.adminTeamAndStaffTab}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main View Router */}
      {activeMainTab === 'team' ? (
        <AdminTeamTab />
      ) : isLoading ? (
        <div className="py-20">
          <EiffelLoader message={t.loading} />
        </div>
      ) : allMergedCustomers.length === 0 ? (
        <EmptyState
          icon={Users}
          title={t.adminNoCustomersYet}
          description={t.adminNoCustomersDesc}
        />
      ) : (
        <>
          {/* 2. Customer Summary Statistics Cards */}
          <CustomerStatsCards
            totalCustomers={totalCustomers}
            vipCount={totalVipCount}
            totalPoints={totalPointsInCirculation}
            totalSpend={totalCustomerSpend}
          />

          {/* 3. Search & Tier Filter Bar */}
          <CustomerFiltersBar
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              setCurrentPage(1);
            }}
            tierFilter={tierFilter}
            onTierFilterChange={(tier) => {
              setTierFilter(tier);
              setCurrentPage(1);
            }}
            totalCount={allMergedCustomers.length}
            vipCount={totalVipCount}
            memberCount={allMergedCustomers.length - totalVipCount}
          />

          {/* 4. Customer Table & Pagination */}
          <CustomerTable
            customers={paginatedCustomers}
            totalFilteredCount={filteredCustomers.length}
            onToggleVip={handleToggleVip}
            onOpenPointsModal={setSelectedCustomerForPoints}
            isUpdating={isUpdating}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setCurrentPage(1);
            }}
          />
        </>
      )}

      {/* 5. Points Adjustment Modal */}
      <CustomerPointsModal
        customer={selectedCustomerForPoints}
        onClose={() => setSelectedCustomerForPoints(null)}
        onSave={handleSavePoints}
        isUpdating={isUpdating}
      />
    </div>
  );
};
