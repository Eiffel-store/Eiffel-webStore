import React from 'react';
import {
  Users,
  Crown,
  Phone,
  MessageCircle,
  ShoppingBag,
  Star
} from 'lucide-react';
import { useLanguage, useCurrency } from '@/shared';
import { Order } from '@/types';

interface AdminReportCustomersTabProps {
  orders: Order[];
}

export const AdminReportCustomersTab: React.FC<AdminReportCustomersTabProps> = ({ orders }) => {
  const { isRTL } = useLanguage();
  const { formatPrice } = useCurrency();

  // 1. VIP Customer Aggregations
  const customerList = React.useMemo(() => {
    const custMap: Record<
      string,
      {
        name: string;
        phone: string;
        email?: string;
        city: string;
        ordersCount: number;
        totalSpend: number;
        lastOrderDate: string;
      }
    > = {};

    orders.forEach((o) => {
      const phone = o.shippingAddress?.phone || o.customerPhone || 'N/A';
      const name = `${o.shippingAddress?.firstName || ''} ${o.shippingAddress?.lastName || ''}`.trim() || o.customerName || (isRTL ? 'عميل إيفل' : 'Eiffel Client');
      const city = o.shippingAddress?.city || 'Cairo';
      const orderDate = o.createdAt || o.date || new Date().toISOString();

      if (!custMap[phone]) {
        custMap[phone] = {
          name,
          phone,
          email: o.customerEmail,
          city,
          ordersCount: 0,
          totalSpend: 0,
          lastOrderDate: orderDate
        };
      }

      custMap[phone].ordersCount += 1;
      if (o.status !== 'Cancelled') {
        custMap[phone].totalSpend += o.total || o.subtotal || 0;
      }

      if (new Date(orderDate) > new Date(custMap[phone].lastOrderDate)) {
        custMap[phone].lastOrderDate = orderDate;
      }
    });

    return Object.values(custMap)
      .sort((a, b) => b.totalSpend - a.totalSpend)
      .slice(0, 15);
  }, [orders, isRTL]);

  const uniqueCustomers = new Set(orders.map((o) => o.shippingAddress?.phone || o.customerPhone)).size;
  const repeatCustomers = customerList.filter((c) => c.ordersCount > 1).length;
  const repeatRate = uniqueCustomers > 0 ? Math.round((repeatCustomers / uniqueCustomers) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 1. Customer Retention Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">{isRTL ? 'إجمالي العملاء الفريدين' : 'Unique Customer Base'}</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-white mt-2">{uniqueCustomers} <span className="text-xs text-zinc-500 font-sans">{isRTL ? 'عميل' : 'clients'}</span></p>
          <p className="text-[11px] text-zinc-500 font-mono mt-1">{isRTL ? 'قاعدة بيانات المشترين' : 'Purchasing client base'}</p>
        </div>

        <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">{isRTL ? 'العملاء المتكررين (VIP)' : 'Repeat Customers'}</span>
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-amber-400 mt-2">{repeatCustomers} <span className="text-xs text-zinc-500 font-sans">{isRTL ? 'عميل دائم' : 'VIP repeat'}</span></p>
          <p className="text-[11px] text-zinc-500 font-mono mt-1">{isRTL ? 'أكثر من طلب مسجل' : '2+ orders placed'}</p>
        </div>

        <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">{isRTL ? 'معدل ولاء العملاء (Retention)' : 'Customer Loyalty Rate'}</span>
            <Star className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-emerald-400 mt-2">{repeatRate}%</p>
          <p className="text-[11px] text-zinc-500 font-mono mt-1">{isRTL ? 'نسبة الشراء المتكرر' : 'Repeat purchase velocity'}</p>
        </div>
      </div>

      {/* 2. VIP Customers Leaderboard */}
      <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 shadow-lg">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              {isRTL ? 'قائمة العملاء الأكثر إنفاقاً وولاءً (Top VIP Clients)' : 'VIP Customer Lifetime Value Leaderboard'}
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">{customerList.length} {isRTL ? 'عميل' : 'clients'}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400">
              <tr>
                <th className={`p-3 ${isRTL ? 'text-right' : 'text-left'}`}>#</th>
                <th className={`p-3 ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? 'العميل' : 'Client Name'}</th>
                <th className={`p-3 ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? 'الهاتف والموقع' : 'Contact & City'}</th>
                <th className="p-3 text-center">{isRTL ? 'عدد الطلبات' : 'Orders'}</th>
                <th className={`p-3 ${isRTL ? 'text-left' : 'text-right'}`}>{isRTL ? 'إجمالي الإنفاق (LTV)' : 'Total Spend'}</th>
                <th className="p-3 text-center">{isRTL ? 'تواصل فوري' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {customerList.map((cust, idx) => {
                const cleanPhone = cust.phone.replace(/\D/g, '');
                const waNumber = cleanPhone.startsWith('0') ? `2${cleanPhone}` : cleanPhone;

                return (
                  <tr key={`cust-row-${idx}`} className="hover:bg-zinc-900/40 transition-colors">
                    <td className={`p-3 font-bold text-amber-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                      #{idx + 1}
                    </td>
                    <td className={`p-3 font-medium text-white ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className="flex items-center gap-2">
                        {idx === 0 && <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        <span className="font-sans font-bold">{cust.name}</span>
                      </div>
                    </td>
                    <td className={`p-3 text-zinc-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className="flex flex-col">
                        <span>{cust.phone}</span>
                        <span className="text-[10px] text-zinc-500">{cust.city}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center font-bold text-white">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                        {cust.ordersCount} {isRTL ? 'طلب' : 'orders'}
                      </span>
                    </td>
                    <td className={`p-3 font-bold text-emerald-400 ${isRTL ? 'text-left' : 'text-right'}`}>
                      {formatPrice(cust.totalSpend)}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {cust.phone !== 'N/A' && (
                          <>
                            <a
                              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                                isRTL
                                  ? `مرحباً بك ${cust.name}، يسعدنا تواصلك مع بوتيك إيفل للأزياء الفاخرة.`
                                  : `Hello ${cust.name}, thank you for choosing Eiffel Maison.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                              title={isRTL ? 'محادثة واتساب' : 'WhatsApp'}
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`tel:${cust.phone}`}
                              className="p-1.5 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                              title={isRTL ? 'اتصال هاتفي' : 'Call'}
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          </>
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
    </div>
  );
};
