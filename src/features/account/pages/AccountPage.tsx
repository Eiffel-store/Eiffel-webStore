import React, { useState } from 'react';
import { useAuth } from '@/features/account';
import { AccountHeader } from '../components/AccountHeader';
import { AccountTabsNav, AccountTabKey } from '../components/AccountTabsNav';
import { AccountOverviewTab } from '../components/AccountOverviewTab';
import { AccountOrdersTab } from '../components/AccountOrdersTab';
import { AccountAddressesTab } from '../components/AccountAddressesTab';
import { AccountPaymentsTab } from '../components/AccountPaymentsTab';
import { AddressModal } from '../components/AddressModal';
import { CardModal } from '../components/CardModal';

export const AccountPage: React.FC = () => {
  const {
    user,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    addPaymentMethod,
    deletePaymentMethod
  } = useAuth();

  const [activeTab, setActiveTab] = useState<AccountTabKey>('overview');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-on-surface py-12 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        {/* Header with Client Welcome & Privé Tier */}
        <AccountHeader user={user} />

        {/* Navigation Tabs */}
        <AccountTabsNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          ordersCount={user.orders.length}
          addressesCount={user.addresses.length}
          paymentsCount={user.paymentMethods.length}
        />

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <AccountOverviewTab
            user={user}
            onViewAllOrders={() => setActiveTab('orders')}
          />
        )}

        {activeTab === 'orders' && (
          <AccountOrdersTab orders={user.orders} />
        )}

        {activeTab === 'addresses' && (
          <AccountAddressesTab
            addresses={user.addresses}
            onOpenAddModal={() => setShowAddressModal(true)}
            onSetDefault={setDefaultAddress}
            onDelete={deleteAddress}
          />
        )}

        {activeTab === 'payments' && (
          <AccountPaymentsTab
            paymentMethods={user.paymentMethods}
            onOpenAddModal={() => setShowCardModal(true)}
            onDelete={deletePaymentMethod}
          />
        )}
      </div>

      {/* Modals */}
      {showAddressModal && (
        <AddressModal
          user={user}
          onClose={() => setShowAddressModal(false)}
          onAddAddress={addAddress}
        />
      )}

      {showCardModal && (
        <CardModal
          user={user}
          onClose={() => setShowCardModal(false)}
          onAddCard={addPaymentMethod}
        />
      )}
    </div>
  );
};
