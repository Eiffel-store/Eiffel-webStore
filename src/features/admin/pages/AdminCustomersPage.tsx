import React, { useState, useMemo } from 'react';
import {
  Users,
  Crown,
  Sparkles,
  Coins,
  Search,
  Filter,
  Plus,
  Minus,
  MessageCircle,
  Phone,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Award,
  ArrowUpDown,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { useStoreData, useLanguage, useCurrency, EiffelLoader, EmptyState } from '@/shared';
import { User, Order } from '@/types';

export const AdminCustomersPage: React.FC = () => {
  const { orders, isOrdersLoading } = useStoreData();
  const { isRTL } = useLanguage();
  const { formatPrice } = useCurrency();

  // Local customers state initialized from orders and mock users
  const [customers, setCustomers] = useState<User[]>([
    {
      id: 'cust-1',
      name: 'طارق منصور (Tarek Mansour)',
      email: 'tarek.mansour@eiffel-client.eg',
      phone: '01001234567',
      role: 'ROLE_CUSTOMER',
      tier: 'VIP',
      tierPoints: 480,
      completedOrdersCount: 5,
      totalSpend: 34500,
      isVip: true,
      memberSince: '2026-01-15',
      addresses: [],
      paymentMethods: [],
      orders: []
    },
    {
      id: 'cust-2',
      name: 'كريم الشناوي (Karim El-Shennawy)',
      email: 'karim.shennawy@gmail.com',
      phone: '01223456789',
      role: 'ROLE_CUSTOMER',
      tier: 'VIP',
      tierPoints: 260,
      completedOrdersCount: 3,
      totalSpend: 19800,
      isVip: true,
      memberSince: '2026-02-10',
      addresses: [],
      paymentMethods: [],
      orders: []
    },
    {
      id: 'cust-3',
      name: 'مروان الألفي (Marwan El-Alfy)',
      email: 'marwan.alfy@outlook.com',
      phone: '01112223344',
      role: 'ROLE_CUSTOMER',
      tier: 'MEMBER',
      tierPoints: 120,
      completedOrdersCount: 2,
      totalSpend: 8400,
      isVip: false,
      memberSince: '2026-03-01',
      addresses: [],
      paymentMethods: [],
      orders: []
    },
    {
      id: 'cust-4',
      name: 'أحمد زهران (Ahmed Zahran)',
      email: 'ahmed.zahran@eiffel.eg',
      phone: '01099887766',
      role: 'ROLE_CUSTOMER',
      tier: 'MEMBER',
      tierPoints: 50,
      completedOrdersCount: 1,
      totalSpend: 3900,
      isVip: false,
      memberSince: '2026-04-12',
      addresses: [],
      paymentMethods: [],
      orders: []
    },
    {
      id: 'cust-5',
      name: 'عمر الصاوي (Omar El-Sawy)',
      email: 'omar.sawy@yahoo.com',
      phone: '01555544332',
      role: 'ROLE_CUSTOMER',
      tier: 'MEMBER',
      tierPoints: 0,
      completedOrdersCount: 0,
      totalSpend: 0,
      isVip: false,
      memberSince: '2026-05-02',
      addresses: [],
      paymentMethods: [],
      orders: []
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'vip' | 'member'>('all');
  const [selectedCustomerForPoints, setSelectedCustomerForPoints] = useState<User | null>(null);
  const [pointsInput, setPointsInput] = useState<number>(50);
  const [pointsAction, setPointsAction] = useState<'add' | 'deduct'>('add');

  // Toggle VIP Status
  const handleToggleVip = (customerId: string | number | undefined) => {
    if (!customerId) return;
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const isCurrentlyVip = c.tier === 'VIP' || c.isVip;
          const nextTier = isCurrentlyVip ? 'MEMBER' : 'VIP';
          return {
            ...c,
            tier: nextTier,
            isVip: !isCurrentlyVip
          };
        }
        return c;
      })
    );
  };

  // Adjust Points
  const handleSavePoints = () => {
    if (!selectedCustomerForPoints) return;
    const delta = pointsAction === 'add' ? pointsInput : -pointsInput;

    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === selectedCustomerForPoints.id) {
          const currentPts = c.tierPoints || 0;
          const newPts = Math.max(0, currentPts + delta);
          return {
            ...c,
            tierPoints: newPts
          };
        }
        return c;
      })
    );

    setSelectedCustomerForPoints(null);
  };

  // Filtered list
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesQuery =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery);

      const isVip = c.tier === 'VIP' || c.isVip;
      if (tierFilter === 'vip' && !isVip) return false;
      if (tierFilter === 'member' && isVip) return false;

      return matchesQuery;
    });
  }, [customers, searchQuery, tierFilter]);

  // Overall KPIs
  const totalCustomers = customers.length;
  const totalVipCount = customers.filter((c) => c.tier === 'VIP' || c.isVip).length;
  const totalPointsInCirculation = customers.reduce((sum, c) => sum + (c.tierPoints || 0), 0);
  const totalCustomerSpend = customers.reduce((sum, c) => sum + (c.totalSpend || 0), 0);

  return (
    <div className="space-y-8">
      {/* 1. Header & Quick Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-wide">
              {isRTL ? 'إدارة العملاء ونظام نقاط الولاء والـ VIP' : 'Customer CRM & Loyalty Points Manager'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-400/10 text-amber-400 border border-amber-400/20 font-bold flex items-center gap-1">
              <Crown className="w-3 h-3" />
              <span>VIP SYSTEM</span>
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {isRTL
              ? 'متابعة رصيد نقاط العملاء، ترقية الحسابات إلى عضوية VIP المميزة، وتعديل النقاط والمكافآت يدوياً.'
              : 'Manage customer loyalty points, promote accounts to VIP tiers, and adjust reward balances.'}
          </p>
        </div>

        {/* Action Preset Banner */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg text-xs font-mono text-zinc-300">
          <Award className="w-4 h-4 text-amber-400" />
          <span>{isRTL ? 'الترقية التلقائية: بعد 3 طلبات مستلمة' : 'Auto VIP Threshold: 3 Delivered Orders'}</span>
        </div>
      </div>

      {/* 2. Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Customers */}
        <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">{isRTL ? 'إجمالي العملاء المسجلين' : 'Total Customers'}</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-white mt-2">{totalCustomers}</p>
          <p className="text-[11px] text-zinc-500 font-mono mt-1">{isRTL ? 'قاعدة بيانات المشترين' : 'Registered client base'}</p>
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
          <p className="text-2xl font-mono font-bold text-emerald-400 mt-2">{totalPointsInCirculation} <span className="text-xs text-zinc-500 font-sans">PTS</span></p>
          <p className="text-[11px] text-zinc-500 font-mono mt-1">
            {isRTL ? `تعادل: ${formatPrice(totalPointsInCirculation)} رصيد شرائي` : `Equivalent to: ${formatPrice(totalPointsInCirculation)}`}
          </p>
        </div>

        {/* Total Spend */}
        <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">{isRTL ? 'إجمالي إنفاق العملاء' : 'Total Lifetime Value'}</span>
            <ShoppingBag className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-white mt-2">{formatPrice(totalCustomerSpend)}</p>
          <p className="text-[11px] text-zinc-500 font-mono mt-1">{isRTL ? 'مبيعات محققة' : 'Cumulative revenue'}</p>
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
            {isRTL ? 'الكل' : 'All'} ({customers.length})
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
            {isRTL ? 'الأعضاء العاديين' : 'Members'} ({customers.length - totalVipCount})
          </button>
        </div>
      </div>

      {/* 4. Customer & Points Management Table */}
      <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400">
              <tr>
                <th className={`p-3.5 ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? 'العميل' : 'Customer'}</th>
                <th className={`p-3.5 ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? 'نوع العضوية' : 'Membership Tier'}</th>
                <th className="p-3.5 text-center">{isRTL ? 'الطلبات المكتملة' : 'Completed Orders'}</th>
                <th className="p-3.5 text-center">{isRTL ? 'رصيد النقاط (PTS)' : 'Points Balance'}</th>
                <th className={`p-3.5 ${isRTL ? 'text-left' : 'text-right'}`}>{isRTL ? 'إجمالي الإنفاق' : 'Total Spend'}</th>
                <th className="p-3.5 text-center">{isRTL ? 'إجراءات التحكم' : 'Admin Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filteredCustomers.map((cust) => {
                const isVip = cust.tier === 'VIP' || cust.isVip;
                const cleanPhone = cust.phone.replace(/\D/g, '');
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
                            <span>•</span>
                            <span className="text-zinc-500">{cust.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Tier Badge */}
                    <td className={`p-3.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isVip ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 text-[11px] font-bold shadow-sm">
                          <Crown className="w-3.5 h-3.5 text-amber-400" />
                          <span>EIFFEL VIP</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 text-[11px]">
                          <span>STANDARD MEMBER</span>
                        </span>
                      )}
                    </td>

                    {/* Completed Orders */}
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
                          onClick={() => handleToggleVip(cust.id)}
                          className={`px-2.5 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors ${
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

                        {/* WhatsApp Contact */}
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
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

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
                className="px-5 py-2 rounded bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs shadow-lg shadow-amber-400/20 transition-colors"
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
