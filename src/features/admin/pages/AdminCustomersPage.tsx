import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Crown,
  Sparkles,
  Coins,
  Search,
  Plus,
  Minus,
  MessageCircle,
  Phone,
  CheckCircle2,
  Award,
  RefreshCw,
  ShoppingBag,
  User as UserIcon
} from 'lucide-react';
import { useStoreData, useLanguage, useCurrency, EiffelLoader, EmptyState } from '@/shared';
import toast from 'react-hot-toast';
import { customerService } from '@/services/customerService';
import { User, Order } from '@/types';

export const AdminCustomersPage: React.FC = () => {
  const { orders, isOrdersLoading, settings } = useStoreData();
  const { isRTL } = useLanguage();
  const { formatPrice } = useCurrency();

  const [backendCustomers, setBackendCustomers] = useState<User[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'vip' | 'member'>('all');
  const [selectedCustomerForPoints, setSelectedCustomerForPoints] = useState<User | null>(null);
  const [pointsInput, setPointsInput] = useState<number>(50);
  const [pointsAction, setPointsAction] = useState<'add' | 'deduct'>('add');

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

  // 2. Synthesize Real Registered Users + Real Order Customers (No fake mockups)
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
      const isVip = Boolean(u.isVip) || u.tier === 'VIP' || u.tier === 'VIP_PLATINUM' || userPoints >= (settings?.vipRequiredPoints || 500);

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

    // Then cross-reference with real actual orders from the database
    orders.forEach((o) => {
      const email = o.customerEmail ? o.customerEmail.trim().toLowerCase() : '';
      const rawPhone = o.customerPhone || o.shippingAddress?.phone || '';
      const cleanPhone = normalizePhone(rawPhone);
      const name = o.customerName || `${o.shippingAddress?.firstName || ''} ${o.shippingAddress?.lastName || ''}`.trim() || 'عميل إيفل';

      // Find existing registered user by email or normalized phone
      const target = (email && custMap[email]) || (cleanPhone && custMap[cleanPhone]);

      const isDelivered = String(o.status || '').toLowerCase() === 'delivered';
      const isNotCancelled = String(o.status || '').toLowerCase() !== 'cancelled';
      const orderAmount = Number(o.total || o.subtotal || 0);

      if (target) {
        // If target already has this order in its orders array, avoid double counting
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
        if (
          (target.completedOrdersCount || 0) >= (settings?.vipRequiredOrders || 3) ||
          (target.tierPoints || 0) >= (settings?.vipRequiredPoints || 500)
        ) {
          target.tier = 'VIP';
          target.isVip = true;
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
        if (
          (newCust.completedOrdersCount || 0) >= (settings?.vipRequiredOrders || 3) ||
          (newCust.tierPoints || 0) >= (settings?.vipRequiredPoints || 500)
        ) {
          newCust.tier = 'VIP';
          newCust.isVip = true;
        }
        if (email) custMap[email] = newCust;
        if (cleanPhone) custMap[cleanPhone] = newCust;
        custMap[fallbackKey] = newCust;
      }
    });

    // Deduplicate by ID / unique customer identity
    const uniqueMap = new Map<string, User>();
    Object.values(custMap).forEach((c) => {
      const uid = String(c.id || c.email || c.phone);
      if (!uniqueMap.has(uid)) {
        uniqueMap.set(uid, c);
      }
    });

    return Array.from(uniqueMap.values());
  }, [backendCustomers, orders, settings, isRTL]);

  // 3. Toggle VIP Status (Calls backend API & updates state)
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
        isRTL
          ? (nextVip ? `تمت ترقية ${customer.name || 'العميل'} إلى VIP 👑` : `تم إلغاء عضوية VIP عن ${customer.name || 'العميل'}`)
          : (nextVip ? `Customer upgraded to VIP 👑` : `VIP revoked`),
        { id: `vip-toggle-${customer.id}` }
      );
    } catch (err) {
      toast.error(isRTL ? 'فشل تعديل حالة VIP' : 'Failed to update VIP status');
    } finally {
      setIsUpdating(false);
    }
  };

  // 4. Adjust Points (Calls backend API & updates state)
  const handleSavePoints = async () => {
    if (!selectedCustomerForPoints || !selectedCustomerForPoints.id) return;
    setIsUpdating(true);
    const delta = pointsAction === 'add' ? pointsInput : -pointsInput;

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
        isRTL
          ? `تم تحديث رصيد النقاط بنجاح (${delta > 0 ? '+' : ''}${delta} PTS)`
          : `Points updated successfully (${delta > 0 ? '+' : ''}${delta} PTS)`
      );
    } catch (err) {
      toast.error(isRTL ? 'فشل تعديل النقاط' : 'Failed to adjust points');
    } finally {
      setIsUpdating(false);
      setSelectedCustomerForPoints(null);
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

  // KPIs
  const totalCustomers = allMergedCustomers.length;
  const totalVipCount = allMergedCustomers.filter((c) => c.tier === 'VIP' || c.isVip).length;
  const totalPointsInCirculation = allMergedCustomers.reduce((sum, c) => sum + (c.tierPoints || 0), 0);
  const totalCustomerSpend = allMergedCustomers.reduce((sum, c) => sum + (c.totalSpend || 0), 0);

  const isLoading = isLoadingCustomers || isOrdersLoading;

  return (
    <div className="space-y-8">
      {/* 1. Header & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-wide">
              {isRTL ? 'إدارة العملاء ونظام نقاط الولاء وعضوية VIP' : 'Customer CRM & VIP Loyalty Manager'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-400/10 text-amber-400 border border-amber-400/20 font-bold flex items-center gap-1">
              <Crown className="w-3 h-3" />
              <span>LIVE SYNC</span>
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {isRTL
              ? 'البيانات الحقيقية المباشرة للعملاء المسجلين والطلبات الواردة من قاعدة البيانات (MongoDB).'
              : 'Live customer profiles synchronized with MongoDB and active store orders.'}
          </p>
        </div>

        {/* Refresh & Preset Info */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchCustomers}
            disabled={isLoading}
            className="p-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg text-xs font-mono transition-colors"
            title={isRTL ? 'تحديث البيانات' : 'Refresh'}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg text-xs font-mono text-zinc-300">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{isRTL ? `الترقية لـ VIP: ${settings?.vipRequiredOrders} طلبات مستلمة` : `Auto VIP: ${settings?.vipRequiredOrders} Delivered Orders`}</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <EiffelLoader message={isRTL ? 'جاري جلب حسابات العملاء وسجل الطلبات من السيرفر...' : 'Loading customer profiles from backend...'} />
      ) : allMergedCustomers.length === 0 ? (
        <EmptyState
          title={isRTL ? 'لا يوجد عملاء مسجلين حالياً' : 'No Registered Customers Found'}
          description={
            isRTL
              ? 'عند قيام العملاء بإنشاء حسابات أو تسجيل طلبات شراء في المتجر، ستظهر بياناتهم الحقيقية ورصيد نقاطهم هنا فوراً.'
              : 'As customers register accounts or submit checkout orders, their verified profiles will populate here automatically.'
          }
        />
      ) : (
        <>
          {/* 2. Executive Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Customers */}
            <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400">{isRTL ? 'إجمالي العملاء' : 'Total Customers'}</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-mono font-bold text-white mt-2">{totalCustomers}</p>
              <p className="text-[11px] text-zinc-500 font-mono mt-1">{isRTL ? 'حسابات وبيانات فعلية' : 'Verified profiles'}</p>
            </div>

            {/* VIP Members Count */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-amber-400/10 to-zinc-950 border border-amber-400/30 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400 font-bold">{isRTL ? 'أعضاء إيفل المميزين VIP' : 'VIP Members'}</span>
                <Crown className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-mono font-bold text-amber-300 mt-2">{totalVipCount}</p>
              <p className="text-[11px] text-zinc-400 font-mono mt-1">{isRTL ? 'مكافأة نقاط مضاعفة 2x' : '2x Points Multiplier'}</p>
            </div>

            {/* Points in Circulation */}
            <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400">{isRTL ? 'إجمالي النقاط المتداولة' : 'Loyalty Points Balance'}</span>
                <Coins className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-mono font-bold text-emerald-400 mt-2">
                {totalPointsInCirculation} <span className="text-xs text-zinc-500 font-sans">PTS</span>
              </p>
              <p className="text-[11px] text-zinc-500 font-mono mt-1">
                {isRTL ? `تعادل: ${formatPrice(totalPointsInCirculation)} رصيد شرائي` : `Value: ${formatPrice(totalPointsInCirculation)}`}
              </p>
            </div>

            {/* Total Spend */}
            <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400">{isRTL ? 'إجمالي المبيعات المحققة' : 'Customer Lifetime Value'}</span>
                <ShoppingBag className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-mono font-bold text-white mt-2">{formatPrice(totalCustomerSpend)}</p>
              <p className="text-[11px] text-zinc-500 font-mono mt-1">{isRTL ? 'صافي المشتريات' : 'Delivered sales'}</p>
            </div>
          </div>

          {/* 3. Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-500 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRTL ? 'بحث بالاسم، رقم الهاتف، أو البريد الإلكتروني...' : 'Search by name, phone, or email...'}
                className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Tier Filter Pills */}
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setTierFilter('all')}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${
                  tierFilter === 'all' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {isRTL ? 'الكل' : 'All'} ({allMergedCustomers.length})
              </button>
              <button
                type="button"
                onClick={() => setTierFilter('vip')}
                className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-all ${
                  tierFilter === 'vip' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>VIP ({totalVipCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setTierFilter('member')}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${
                  tierFilter === 'member' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {isRTL ? 'الأعضاء العاديين' : 'Members'} ({allMergedCustomers.length - totalVipCount})
              </button>
            </div>
          </div>

          {/* 4. Customer Table */}
          <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400">
                  <tr>
                    <th className={`p-3.5 ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? 'العميل' : 'Customer'}</th>
                    <th className={`p-3.5 ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? 'نوع العضوية' : 'Membership Tier'}</th>
                    <th className="p-3.5 text-center">{isRTL ? 'الطلبات المسلمة' : 'Delivered Orders'}</th>
                    <th className="p-3.5 text-center">{isRTL ? 'رصيد النقاط (PTS)' : 'Points Balance'}</th>
                    <th className={`p-3.5 ${isRTL ? 'text-left' : 'text-right'}`}>{isRTL ? 'إجمالي المشتريات' : 'Total Spend'}</th>
                    <th className="p-3.5 text-center">{isRTL ? 'إجراءات التحكم' : 'Admin Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {filteredCustomers.map((cust) => {
                    const isVip = cust.tier === 'VIP' || cust.isVip;
                    const cleanPhone = cust.phone ? cust.phone.replace(/\D/g, '') : '';
                    const waNumber = cleanPhone.startsWith('0') ? `2${cleanPhone}` : cleanPhone;

                    return (
                      <tr key={cust.id} className="hover:bg-zinc-900/40 transition-colors">
                        {/* Customer Info */}
                        <td className={`p-3.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                                isVip
                                  ? 'bg-gradient-to-tr from-amber-500 to-amber-300 text-black shadow-lg shadow-amber-500/20'
                                  : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                              }`}
                            >
                              {cust.name.slice(0, 1).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-sans font-bold text-white text-sm">{cust.name}</p>
                              <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                                <span>{cust.phone}</span>
                                {cust.email && (
                                  <>
                                    <span>•</span>
                                    <span className="text-zinc-500">{cust.email}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Tier Badge */}
                        <td className={`p-3.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                          {isVip ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-400/10 text-amber-300 border border-amber-400/40 text-[11px] font-bold shadow-sm whitespace-nowrap">
                              <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>{isRTL ? 'عضوية VIP' : 'EIFFEL VIP'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-700/80 text-[11px] font-medium whitespace-nowrap">
                              <UserIcon className="w-3 h-3 text-zinc-400 shrink-0" />
                              <span>{isRTL ? 'عضو قياسي' : 'Standard Member'}</span>
                            </span>
                          )}
                        </td>

                        {/* Delivered Orders */}
                        <td className="p-3.5 text-center font-bold text-white">
                          <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800">
                            {cust.completedOrdersCount || 0} {isRTL ? 'طلب' : 'orders'}
                          </span>
                        </td>

                        {/* Points Balance */}
                        <td className="p-3.5 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="font-bold text-emerald-400 text-sm">
                              {cust.tierPoints || 0} PTS
                            </span>
                            <span className="text-[10px] text-zinc-500">
                              ({formatPrice(cust.tierPoints || 0)})
                            </span>
                          </div>
                        </td>

                        {/* Total Spend */}
                        <td className={`p-3.5 font-bold text-white ${isRTL ? 'text-left' : 'text-right'}`}>
                          {formatPrice(cust.totalSpend || 0)}
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* Toggle VIP */}
                            <button
                              type="button"
                              onClick={() => handleToggleVip(cust)}
                              disabled={isUpdating}
                              className={`px-2.5 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors disabled:opacity-50 ${
                                isVip
                                  ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30'
                              }`}
                              title={isVip ? (isRTL ? 'إلغاء عضوية VIP' : 'Revoke VIP') : (isRTL ? 'ترقية إلى VIP' : 'Promote to VIP')}
                            >
                              <Crown className="w-3.5 h-3.5" />
                              <span>{isVip ? (isRTL ? 'إلغاء VIP' : 'Remove VIP') : (isRTL ? 'ترقية VIP' : 'Make VIP')}</span>
                            </button>

                            {/* Adjust Points Modal Trigger */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCustomerForPoints(cust);
                                setPointsInput(50);
                                setPointsAction('add');
                              }}
                              className="px-2.5 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-zinc-700 text-xs font-mono flex items-center gap-1 transition-colors"
                              title={isRTL ? 'تعديل النقاط' : 'Adjust Points'}
                            >
                              <Coins className="w-3.5 h-3.5" />
                              <span>{isRTL ? 'النقاط' : 'Points'}</span>
                            </button>

                            {/* WhatsApp Direct Contact */}
                            {cleanPhone && (
                              <a
                                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                                  isRTL
                                    ? `مرحباً بك ${cust.name}، يسعدنا تواصلك مع دار أزياء إيفل.`
                                    : `Hello ${cust.name}, welcome to Eiffel.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                                title={isRTL ? 'محادثة واتساب' : 'WhatsApp'}
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 5. Points Adjustment Modal */}
      {selectedCustomerForPoints && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl animate-fade-in text-zinc-100 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-mono font-bold text-white uppercase">
                    {isRTL ? 'تعديل رصيد النقاط يدوياً' : 'Adjust Loyalty Points'}
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans">{selectedCustomerForPoints.name}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomerForPoints(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Current Balance */}
            <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">{isRTL ? 'الرصيد الحالي:' : 'Current Balance:'}</span>
              <span className="text-base font-mono font-bold text-emerald-400">
                {selectedCustomerForPoints.tierPoints || 0} PTS
              </span>
            </div>

            {/* Add / Deduct Switch */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPointsAction('add')}
                className={`py-2 rounded text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  pointsAction === 'add'
                    ? 'bg-emerald-500 text-black shadow'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isRTL ? 'إضافة نقاط (+)' : 'Credit (+)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setPointsAction('deduct')}
                className={`py-2 rounded text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  pointsAction === 'deduct'
                    ? 'bg-rose-500 text-white shadow'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Minus className="w-3.5 h-3.5" />
                <span>{isRTL ? 'خصم نقاط (-)' : 'Debit (-)'}</span>
              </button>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                {isRTL ? 'عدد النقاط المراد تطبيقها:' : 'Points Amount:'}
              </label>
              <input
                type="number"
                min="1"
                step="10"
                value={pointsInput}
                onChange={(e) => setPointsInput(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-mono text-white focus:outline-none focus:border-amber-400"
              />
              <p className="text-[11px] text-zinc-500 font-mono mt-1">
                {isRTL ? `القيمة المعادلة: ${formatPrice(pointsInput)}` : `Value: ${formatPrice(pointsInput)}`}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setSelectedCustomerForPoints(null)}
                className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleSavePoints}
                disabled={isUpdating}
                className="px-5 py-2 rounded bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs shadow-lg shadow-amber-400/20 transition-colors disabled:opacity-50"
              >
                {isRTL ? 'حفظ وتحديث الرصيد' : 'Save & Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
