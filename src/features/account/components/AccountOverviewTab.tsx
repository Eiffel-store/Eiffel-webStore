import React from 'react';
import { Crown, Coins, Sparkles, Gift, Truck, CheckCircle2 } from 'lucide-react';
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
  const completedOrders = orders.filter(o => o.status === 'Delivered').length || user.completedOrdersCount || 0;
  const isVip = user.tier === 'VIP' || user.isVip;
  const points = user.tierPoints || 0;
  const pointsValue = points; // 1 point = 1 EGP

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Luxury Loyalty Points & VIP Tier Card */}
      <div className={`p-6 sm:p-8 rounded-xl border relative overflow-hidden shadow-2xl ${
        isVip
          ? 'bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-amber-400/40 shadow-amber-500/10'
          : 'bg-surface-container-low dark:bg-zinc-900 border-surface-container dark:border-zinc-800'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Tier & Points Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {isVip ? (
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-400 text-black flex items-center gap-1.5 shadow-md">
                  <Crown className="w-3.5 h-3.5" />
                  <span>EIFFEL VIP PRIVÉ</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>EIFFEL MEMBER</span>
                </span>
              )}
              <span className="text-xs text-zinc-400 font-mono">
                {isVip ? (isRTL ? 'عضوية إيفل الحصرية المميزة' : 'Exclusive VIP Membership') : (isRTL ? 'عضوية إيفل القياسية' : 'Standard Member')}
              </span>
            </div>

            <div className="pt-2">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">{isRTL ? 'رصيد نقاط الولاء المتاح للاستبدال:' : 'Redeemable Points Balance:'}</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl sm:text-4xl font-mono font-bold text-amber-400 tracking-tight">
                  {points} <span className="text-lg text-zinc-400 font-sans">PTS</span>
                </span>
                <span className="text-sm font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                  = {formatPrice(pointsValue)} {isRTL ? 'خصم متاح عند الدفع' : 'cash discount'}
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 font-light max-w-xl">
              {isVip
                ? (isRTL ? 'بصفتك عميل VIP، تكسب 10% نقاط مضاعفة (2x) على كل طلب تطلبه من المتجر ويمكنك استبدالها بخصومات فورية.' : 'As a VIP, you earn 10% (2x) bonus loyalty points on all purchases, redeemable at checkout.')
                : (isRTL ? 'تكسب 5% نقاط ولاء على كل طلب مستلم، وتتم ترقيتك تلقائياً لعضوية VIP بعد 3 طلبات مستلمة!' : 'Earn 5% points on all delivered orders. Auto-upgrade to VIP upon completing 3 orders!')}
            </p>
          </div>

          {/* Perks / Auto-Promotion Progress */}
          <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 min-w-[280px] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-300 font-bold">{isRTL ? 'مستوى التقدم نحو VIP:' : 'VIP Qualification:'}</span>
              <span className="text-amber-400 font-bold">{Math.min(3, completedOrders)} / 3 {isRTL ? 'طلبات' : 'orders'}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
                style={{ width: `${isVip ? 100 : Math.min(100, (completedOrders / 3) * 100)}%` }}
              />
            </div>

            <div className="space-y-1.5 text-[11px] text-zinc-400 font-mono">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{isVip ? (isRTL ? 'نقاط مضاعفة 2x على المشتريات' : '2x Points Multiplier') : (isRTL ? 'استبدال النقاط بخصم عند الدفع' : 'Redeem Points at Checkout')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{isRTL ? 'شحن سريع لكافة محافظات مصر' : 'Express Courier Delivery'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
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
  </div>
  );
};
