import React, { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMyOrders } from '@/hooks/useOrders';
import { useLanguage } from '@/shared';
import { CustomerAuthView } from '../components/CustomerAuthView';
import { AccountHeader } from '../components/AccountHeader';
import { AccountTabsNav, AccountTabKey } from '../components/AccountTabsNav';
import { AccountOverviewTab } from '../components/AccountOverviewTab';
import { AccountOrdersTab } from '../components/AccountOrdersTab';
import { AccountAddressesTab } from '../components/AccountAddressesTab';
import { AccountPaymentsTab } from '../components/AccountPaymentsTab';
import { AddressModal } from '../components/AddressModal';
import { CardModal } from '../components/CardModal';
import { LogOut, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Address, PaymentMethod, User } from '@/types';

export const AccountPage: React.FC = () => {
  const { user, isAuthenticated, role, logout, fetchProfile } = useAuthStore();
  const { t } = useLanguage();
  const { data: serverOrders = [] } = useMyOrders();

  const [activeTab, setActiveTab] = useState<AccountTabKey>('overview');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);

  // Local user state for addresses/payment methods
  const [userState, setUserState] = useState<User | null>(user);

  // Fetch fresh profile from server on mount
  React.useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, fetchProfile]);

  // Keep state in sync with auth store
  React.useEffect(() => {
    if (user) {
      setUserState(prev => prev ? { ...user, addresses: prev.addresses || user.addresses || [], paymentMethods: prev.paymentMethods || user.paymentMethods || [] } : user);
    }
  }, [user]);

  // If user is not authenticated, render the luxury login/register form!
  if (!isAuthenticated || !user) {
    return <CustomerAuthView />;
  }

  const fullUser: User = {
    ...user,
    orders: serverOrders.length > 0 ? serverOrders : (user.orders || []),
    addresses: userState?.addresses || user.addresses || [],
    paymentMethods: userState?.paymentMethods || user.paymentMethods || [],
  };

  const handleAddAddress = (addr: Omit<Address, 'id'>) => {
    const newAddr: Address = { ...addr, id: `addr-${Date.now()}` };
    setUserState(prev => prev ? { ...prev, addresses: [...(prev.addresses || []), newAddr] } : null);
    setShowAddressModal(false);
  };

  const handleAddCard = (card: Omit<PaymentMethod, 'id'>) => {
    const newCard: PaymentMethod = { ...card, id: `card-${Date.now()}` };
    setUserState(prev => prev ? { ...prev, paymentMethods: [...(prev.paymentMethods || []), newCard] } : null);
    setShowCardModal(false);
  };

  const handleDeleteAddress = (id: string) => {
    setUserState(prev => prev ? { ...prev, addresses: (prev.addresses || []).filter(a => a.id !== id) } : null);
  };

  const handleDeleteCard = (id: string) => {
    setUserState(prev => prev ? { ...prev, paymentMethods: (prev.paymentMethods || []).filter(c => c.id !== id) } : null);
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
            className="self-start sm:self-auto px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 text-xs font-label-bold tracking-wider uppercase flex items-center gap-1.5 transition-colors"
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
          paymentsCount={fullUser.paymentMethods.length}
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

        {activeTab === 'payments' && (
          <AccountPaymentsTab
            paymentMethods={fullUser.paymentMethods}
            onOpenAddModal={() => setShowCardModal(true)}
            onDelete={handleDeleteCard}
          />
        )}

        {/* Modals */}
        {showAddressModal && (
          <AddressModal
            user={fullUser}
            onClose={() => setShowAddressModal(false)}
            onAddAddress={handleAddAddress}
          />
        )}
        {showCardModal && (
          <CardModal
            user={fullUser}
            onClose={() => setShowCardModal(false)}
            onAddCard={handleAddCard}
          />
        )}
      </div>
    </div>
  );
};
