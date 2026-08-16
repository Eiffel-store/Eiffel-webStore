import React from 'react';
import { User as UserIcon, Package, MapPin, CreditCard } from 'lucide-react';
import { useLanguage } from '@/shared';

export type AccountTabKey = 'overview' | 'orders' | 'addresses' | 'payments';

interface AccountTabsNavProps {
  activeTab: AccountTabKey;
  setActiveTab: (tab: AccountTabKey) => void;
  ordersCount: number;
  addressesCount: number;
  paymentsCount: number;
}

export const AccountTabsNav: React.FC<AccountTabsNavProps> = ({
  activeTab,
  setActiveTab,
  ordersCount,
  addressesCount,
  paymentsCount,
}) => {
  const { t } = useLanguage();

  const tabs = [
    { key: 'overview' as AccountTabKey, label: t.tabOverview, icon: UserIcon },
    { key: 'orders' as AccountTabKey, label: `${t.tabOrders} (${ordersCount})`, icon: Package },
    { key: 'addresses' as AccountTabKey, label: `${t.tabAddresses} (${addressesCount})`, icon: MapPin },
    { key: 'payments' as AccountTabKey, label: `${t.tabPayments} (${paymentsCount})`, icon: CreditCard },
  ];

  return (
    <div className="flex gap-2 sm:gap-4 border-b border-surface-container dark:border-zinc-800 my-5 sm:my-8 overflow-x-auto scrollbar-none pb-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-label-bold tracking-wider uppercase flex items-center gap-1.5 sm:gap-2 border-b-2 whitespace-nowrap transition-all shrink-0 ${
              isActive
                ? 'border-primary dark:border-white text-primary dark:text-white'
                : 'border-transparent text-secondary dark:text-zinc-400 hover:text-primary'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
