import React from 'react';
import { Crown, Coins, MessageCircle, User as UserIcon } from 'lucide-react';
import { User } from '@/types';
import { useLanguage, useCurrency, Pagination } from '@/shared';

interface CustomerTableProps {
  customers: User[];
  totalFilteredCount: number;
  onToggleVip: (customer: User) => void;
  onOpenPointsModal: (customer: User) => void;
  isUpdating: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  totalFilteredCount,
  onToggleVip,
  onOpenPointsModal,
  isUpdating,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const { isRTL, t } = useLanguage();
  const { formatPrice } = useCurrency();

  return (
    <div className="space-y-4">
      <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400">
              <tr>
                <th className={`p-3.5 ${isRTL ? 'text-right' : 'text-left'}`}>{t.customer}</th>
                <th className={`p-3.5 ${isRTL ? 'text-right' : 'text-left'}`}>{t.membershipTier}</th>
                <th className="p-3.5 text-center">{t.orders}</th>
                <th className="p-3.5 text-center">{t.points}</th>
                <th className={`p-3.5 ${isRTL ? 'text-left' : 'text-right'}`}>{t.totalSpend}</th>
                <th className="p-3.5 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {customers.map((cust) => {
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
                          <span>{t.adminVipTier}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-700/80 text-[11px] font-medium whitespace-nowrap">
                          <UserIcon className="w-3 h-3 text-zinc-400 shrink-0" />
                          <span>{t.standardMember}</span>
                        </span>
                      )}
                    </td>

                    {/* Delivered Orders */}
                    <td className="p-3.5 text-center font-bold text-white">
                      <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800">
                        {cust.completedOrdersCount || 0} {t.orders}
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
                          onClick={() => onToggleVip(cust)}
                          disabled={isUpdating}
                          className={`px-2.5 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer ${
                            isVip
                              ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          }`}
                          title={isVip ? t.adminRevokeVip : t.adminPromoteVip}
                        >
                          <Crown className="w-3.5 h-3.5" />
                          <span>{isVip ? t.adminRevokeVip : t.adminPromoteVip}</span>
                        </button>

                        {/* Adjust Points Modal Trigger */}
                        <button
                          type="button"
                          onClick={() => onOpenPointsModal(cust)}
                          className="px-2.5 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-zinc-700 text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
                          title={t.adjustPoints}
                        >
                          <Coins className="w-3.5 h-3.5" />
                          <span>{t.points}</span>
                        </button>

                        {/* WhatsApp Direct Contact */}
                        {cleanPhone && (
                          <a
                            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                              `${t.adminWaHelloIntro} ${cust.name}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors cursor-pointer"
                            title={t.adminWhatsappChat}
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

      {/* Pagination Controls */}
      {totalFilteredCount > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalFilteredCount}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      )}
    </div>
  );
};
