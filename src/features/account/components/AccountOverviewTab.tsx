import React from 'react';
import { useCurrency, useLanguage } from '@/shared';
import { User, Order, CartItem } from '@/types';

interface AccountOverviewTabProps {
  user: User;
  onViewAllOrders: () => void;
}

export const AccountOverviewTab: React.FC<AccountOverviewTabProps> = ({
  user,
  onViewAllOrders,
}) => {
  const { formatPrice } = useCurrency();
  const { t, isRTL } = useLanguage();

  const orders = user?.orders || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
      {/* Recent Orders Preview */}
      <div className="md:col-span-8 p-6 sm:p-8 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-surface-container dark:border-zinc-800">
          <h3 className="font-editorial text-2xl text-primary dark:text-white">
            {t.recentOrders}
          </h3>
          <button
            onClick={onViewAllOrders}
            className="text-xs font-label-bold text-secondary dark:text-zinc-400 hover:underline uppercase"
          >
            {t.viewAllOrders}
          </button>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-secondary py-8 text-center">{t.noOrdersYet}</p>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 2).map((order: Order) => {
              const items = order?.items || [];
              return (
                <div
                  key={order.id}
                  className="p-4 bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-800 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-xs font-bold text-primary dark:text-white">{order.id}</span>
                      <p className="text-[11px] text-secondary dark:text-zinc-400 font-mono mt-0.5">{order.date}</p>
                    </div>
                    <span className="text-[10px] font-label-bold px-2.5 py-1 bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 uppercase">
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    {items.map((it: CartItem, idx: number) => {
                      const img = it?.product?.images?.[0] || 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop';
                      return (
                        <img
                          key={idx}
                          src={img}
                          alt={it?.product?.name || 'Item'}
                          className="w-12 h-14 object-cover bg-zinc-900 border border-surface-container"
                        />
                      );
                    })}
                    <div className="flex-1 text-xs">
                      <p className="text-secondary dark:text-zinc-400 font-light">{items.length} {t.itemsReserved}</p>
                      <span className="font-mono font-bold text-primary dark:text-white">{formatPrice(order.total || 0)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="md:col-span-4 p-6 sm:p-8 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 space-y-6">
        <h3 className="font-editorial text-2xl text-primary dark:text-white pb-4 border-b border-surface-container dark:border-zinc-800">
          {t.clientProfile}
        </h3>
        <div className="space-y-3 text-xs">
          <div>
            <span className="text-[10px] font-mono text-secondary uppercase">{t.firstNameLabel} & {t.lastNameLabel}</span>
            <p className="font-medium text-primary dark:text-white">{user?.name || '-'}</p>
          </div>
          <div>
            <span className="text-[10px] font-mono text-secondary uppercase">{t.emailLabel}</span>
            <p className="font-mono text-primary dark:text-white">{user?.email || '-'}</p>
          </div>
          <div>
            <span className="text-[10px] font-mono text-secondary uppercase">{t.phoneLabel}</span>
            <p className="font-mono text-primary dark:text-white">{user?.phone || '-'}</p>
          </div>
          <div>
            <span className="text-[10px] font-mono text-secondary uppercase">{t.memberSince}</span>
            <p className="font-mono text-primary dark:text-white">{user?.memberSince || '2026'}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-surface-container dark:border-zinc-800">
          <h4 className="font-label-bold text-xs uppercase tracking-wider text-primary dark:text-white mb-2">
            {t.exclusivePrivileges}
          </h4>
          <p className="text-xs text-secondary dark:text-zinc-400 font-light leading-relaxed">
            {isRTL
              ? 'تتمتع بحق الوصول المسبق إلى الكبسولات المعمارية، الشحن السريع المجاني، وجلسات القياس الخاصة في فروعنا بمصر.'
              : 'Enjoy private atelier fittings, complimentary courier express across Egypt, and first preview access to limited seasonal capsules.'}
          </p>
        </div>
      </div>
    </div>
  );
};
