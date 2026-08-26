import React, { useState, useMemo } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMyOrders } from '@/hooks/useOrders';
import { useLanguage, useStoreData, AccountPageSkeleton } from '@/shared';
import { CustomerAuthView } from '../components/CustomerAuthView';
import { AccountHeader } from '../components/AccountHeader';
import { AccountTabsNav, AccountTabKey } from '../components/AccountTabsNav';
import { AccountOverviewTab } from '../components/AccountOverviewTab';
import { AccountOrdersTab } from '../components/AccountOrdersTab';
import { AccountAddressesTab } from '../components/AccountAddressesTab';
import { AddressModal } from '../components/AddressModal';
import { LogOut, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Address, User, Order } from '@/types';

export const AccountPage: React.FC = () => {
  const { user, isAuthenticated, role, logout, fetchProfile, isLoading: isAuthLoading, isProfileLoading } = useAuthStore();
  const { t, isRTL } = useLanguage();
  const { orders: localStoreOrders } = useStoreData();
  const { data: serverOrders = [], isLoading: isOrdersLoading } = useMyOrders(user?.email);
  const [activeTab, setActiveTab] = useState<AccountTabKey>('overview');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isInitialSyncing, setIsInitialSyncing] = useState(true);

  // Local user state for addresses
  const [userState, setUserState] = useState<User | null>(user);

  // Fetch fresh profile from server on mount
  React.useEffect(() => {
    let isMounted = true;
    if (isAuthenticated) {
      setIsInitialSyncing(true);
      fetchProfile().finally(() => {
        if (isMounted) {
          setIsInitialSyncing(false);
        }
      });
    } else {
      setIsInitialSyncing(false);
    }
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, fetchProfile]);

  // Keep state in sync with auth store
  React.useEffect(() => {
    if (user) {
      setUserState(prev => prev ? { ...user, addresses: prev.addresses || user.addresses || [] } : user);
    }
  }, [user]);

  // Merge and deduplicate server orders and local store orders
  const userOrders = useMemo(() => {
    const userEmail = (user?.email || '').trim().toLowerCase();
    const map = new Map<string, Order>();

    // 1. Add server orders (from /orders/my-orders)
    (serverOrders || []).forEach((o: Order) => map.set(o.id, o));

    // 2. Add local store orders matching user email
    if (localStoreOrders && userEmail) {
      localStoreOrders.forEach(o => {
        if (
          (o.customerEmail && o.customerEmail.toLowerCase().trim() === userEmail) ||
          ((o as any).email && (o as any).email.toLowerCase().trim() === userEmail)
        ) {
          if (!map.has(o.id)) {
            map.set(o.id, o);
          }
        }
      });
    }

    // 3. Add user.orders if present
    if (user?.orders && Array.isArray(user.orders)) {
      user.orders.forEach(o => {
        if (!map.has(o.id)) {
          map.set(o.id, o);
        }
      });
    }

    return Array.from(map.values()).sort((a, b) => {
      const dateA = new Date(a.date || (a as any).createdAt || 0).getTime();
      const dateB = new Date(b.date || (b as any).createdAt || 0).getTime();
      return dateB - dateA;
    });
  }, [serverOrders, localStoreOrders, user]);

  const isDataLoading = isAuthLoading || (isAuthenticated && !user && (isInitialSyncing || isProfileLoading));

  if (isDataLoading) {
    return <AccountPageSkeleton />;
  }

  if (!isAuthenticated || !user) {
    return <CustomerAuthView />;
  }

  const isVip = Boolean(user.isVip) || user.tier === 'VIP' || user.tier === 'VIP_PLATINUM';
  const fullUser: User = {
    ...user,
    isVip,
    tier: isVip ? 'VIP' : (user.tier === 'VIP' ? 'MEMBER' : (user.tier || 'MEMBER')),
    points: user.points ?? user.tierPoints ?? 0,
    tierPoints: user.points ?? user.tierPoints ?? 0,
    orders: userOrders,
    addresses: userState?.addresses || user.addresses || [],
  };

  const handleAddAddress = (addr: Omit<Address, 'id'>) => {
    const newAddr: Address = { ...addr, id: `addr-${Date.now()}` };
    setUserState(prev => prev ? { ...prev, addresses: [...(prev.addresses || []), newAddr] } : null);
    setShowAddressModal(false);
  };

  const handleDeleteAddress = (id: string) => {
    setUserState(prev => prev ? { ...prev, addresses: (prev.addresses || []).filter(a => a.id !== id) } : null);
  };

  const handleSetDefaultAddress = (id: string) => {
    setUserState(prev => prev ? {
      ...prev,
      addresses: (prev.addresses || []).map(a => ({ ...a, isDefault: a.id === id }))
    } : null);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface py-12 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        {/* Admin Quick Jump If Staff/Admin */}
        {(role === 'ROLE_ADMIN' || role === 'ROLE_STAFF') && (
          <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-amber-300 font-mono">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{t.adminPrivileges}</span>
            </div>
            <Link
              to="/admin"
              className="px-3 py-1 bg-amber-500 text-black text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition-colors"
            >
              {t.openAdminPanel}
            </Link>
          </div>
        )}

        {/* Header with Client Welcome & Privé Tier */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-container dark:border-zinc-800">
          <AccountHeader user={fullUser} />
          <button
            onClick={logout}
            className="self-start sm:self-auto px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 text-xs font-label-bold tracking-wider uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.signOut}</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <AccountTabsNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          ordersCount={fullUser.orders.length}
          addressesCount={fullUser.addresses.length}
        />

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <AccountOverviewTab
            user={fullUser}
            onViewAllOrders={() => setActiveTab('orders')}
          />
        )}

        {activeTab === 'orders' && (
          <AccountOrdersTab orders={fullUser.orders} />
        )}

        {activeTab === 'addresses' && (
          <AccountAddressesTab
            addresses={fullUser.addresses}
            onOpenAddModal={() => setShowAddressModal(true)}
            onSetDefault={handleSetDefaultAddress}
            onDelete={handleDeleteAddress}
          />
        )}

        {/* Address Modal */}
        {showAddressModal && (
          <AddressModal
            user={fullUser}
            onClose={() => setShowAddressModal(false)}
            onAddAddress={handleAddAddress}
          />
        )}
      </div>
    </div>
  );
};
