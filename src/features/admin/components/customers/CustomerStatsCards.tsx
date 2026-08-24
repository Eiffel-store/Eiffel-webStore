import React from 'react';
import { Users, Crown, Coins, ShoppingBag } from 'lucide-react';
import { useLanguage, useCurrency } from '@/shared';

interface CustomerStatsCardsProps {
  totalCustomers: number;
  vipCount: number;
  totalPoints: number;
  totalSpend: number;
}

export const CustomerStatsCards: React.FC<CustomerStatsCardsProps> = ({
  totalCustomers,
  vipCount,
  totalPoints,
  totalSpend,
}) => {
  const { isRTL, t } = useLanguage();
  const { formatPrice } = useCurrency();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Registered Customers */}
      <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-400">
            {isRTL ? 'إجمالي العملاء المسجلين' : 'Total Customers'}
          </span>
          <Users className="w-4 h-4 text-amber-400" />
        </div>
        <p className="text-2xl font-mono font-bold text-white mt-2">{totalCustomers}</p>
        <p className="text-[11px] text-zinc-500 font-mono mt-1">
          {isRTL ? 'عملاء المتجر وقاعدة البيانات' : 'Store & DB registered'}
        </p>
      </div>

      {/* VIP Privé Members */}
      <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-400">
            {isRTL ? 'أعضاء النخبة VIP' : 'VIP Privé Members'}
          </span>
          <Crown className="w-4 h-4 text-amber-400" />
        </div>
        <p className="text-2xl font-mono font-bold text-amber-400 mt-2">{vipCount}</p>
        <p className="text-[11px] text-zinc-500 font-mono mt-1">
          {isRTL ? 'مؤهلون للخصومات الحصرية' : 'Exclusive discount eligible'}
        </p>
      </div>

      {/* Points in Circulation */}
      <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-400">
            {isRTL ? 'إجمالي النقاط المتداولة' : 'Loyalty Points Balance'}
          </span>
          <Coins className="w-4 h-4 text-emerald-400" />
        </div>
        <p className="text-2xl font-mono font-bold text-emerald-400 mt-2">
          {totalPoints} <span className="text-xs text-zinc-500 font-sans">PTS</span>
        </p>
        <p className="text-[11px] text-zinc-500 font-mono mt-1">
          {isRTL ? `تعادل: ${formatPrice(totalPoints)} رصيد شرائي` : `Value: ${formatPrice(totalPoints)}`}
        </p>
      </div>

      {/* Total Spend */}
      <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-400">
            {isRTL ? 'إجمالي المبيعات المحققة' : 'Customer Lifetime Value'}
          </span>
          <ShoppingBag className="w-4 h-4 text-purple-400" />
        </div>
        <p className="text-2xl font-mono font-bold text-white mt-2">{formatPrice(totalSpend)}</p>
        <p className="text-[11px] text-zinc-500 font-mono mt-1">
          {isRTL ? 'صافي المشتريات المسلمة' : 'Delivered sales'}
        </p>
      </div>
    </div>
  );
};
