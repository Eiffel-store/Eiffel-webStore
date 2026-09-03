import React, { useState } from 'react';
import { Percent, Plus, Trash2, CheckCircle, XCircle, Users, Edit3, AlertCircle, X, Check } from 'lucide-react';
import { useLanguage, useCurrency, useStoreData } from '@/shared';
import { Coupon } from '@/types';

export const AdminCouponsManager: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useStoreData();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState<number>(10);
  const [newCouponMinAmount, setNewCouponMinAmount] = useState<number>(500);
  const [newCouponUsageLimit, setNewCouponUsageLimit] = useState<string>('');

  // Quick edit modal state
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [editLimitInput, setEditLimitInput] = useState<string>('');
  const [editMinAmountInput, setEditMinAmountInput] = useState<number>(0);
  const [editDiscountInput, setEditDiscountInput] = useState<number>(10);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountPercentage: Number(newCouponDiscount),
      minOrderAmount: Number(newCouponMinAmount),
      usageLimit: newCouponUsageLimit.trim() ? parseInt(newCouponUsageLimit.trim()) : null,
      timesUsed: 0,
      isActive: true
    });

    setNewCouponCode('');
    setNewCouponDiscount(10);
    setNewCouponMinAmount(500);
    setNewCouponUsageLimit('');
  };

  const handleOpenEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setEditLimitInput(coupon.usageLimit !== undefined && coupon.usageLimit !== null ? String(coupon.usageLimit) : '');
    setEditMinAmountInput(coupon.minOrderAmount || 0);
    setEditDiscountInput(coupon.discountPercentage || 10);
  };

  const handleSaveEdit = () => {
    if (!editingCoupon) return;
    const parsedLimit = editLimitInput.trim() ? parseInt(editLimitInput.trim()) : null;
    
    updateCoupon(editingCoupon.id, {
      usageLimit: parsedLimit,
      minOrderAmount: editMinAmountInput,
      discountPercentage: editDiscountInput,
      // If limit is extended beyond timesUsed, reactivate if it was exhausted
      isActive: parsedLimit ? ((editingCoupon.timesUsed || 0) < parsedLimit) : true
    });

    setEditingCoupon(null);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 shadow-xl space-y-6">
      <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2 pb-3 border-b border-zinc-800">
        <Percent className="w-4 h-4 text-emerald-400" />
        <span>{t.adminCouponsPromoCodes}</span>
      </h2>

      {/* Create Coupon Form */}
      <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl">
        <div className="sm:col-span-3">
          <label className="block text-[11px] text-zinc-400 font-bold mb-1">
            {t.adminCouponsPromoCodes} *
          </label>
          <input
            type="text"
            required
            value={newCouponCode}
            onChange={(e) => setNewCouponCode(e.target.value)}
            placeholder="e.g. EIFFEL15, SUMMER25"
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-amber-400 rounded-lg"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[11px] text-zinc-400 font-bold mb-1">
            {t.adminDiscountPercentage} (%) *
          </label>
          <input
            type="number"
            required
            min={1}
            max={90}
            value={newCouponDiscount}
            onChange={(e) => setNewCouponDiscount(parseInt(e.target.value) || 0)}
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400 rounded-lg"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[11px] text-zinc-400 font-bold mb-1">
            {t.adminMinOrderEgp}
          </label>
          <input
            type="number"
            min={0}
            value={newCouponMinAmount}
            onChange={(e) => setNewCouponMinAmount(parseInt(e.target.value) || 0)}
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400 rounded-lg"
          />
        </div>

        <div className="sm:col-span-3">
          <label className="block text-[11px] text-amber-400 font-bold mb-1 flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{t.adminCouponUsageLimit}</span>
          </label>
          <input
            type="number"
            min={1}
            value={newCouponUsageLimit}
            onChange={(e) => setNewCouponUsageLimit(e.target.value)}
            placeholder={t.adminCouponUsageLimitPlaceholder}
            className="w-full bg-zinc-900 border border-amber-500/40 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400 rounded-lg"
          />
        </div>

        <div className="sm:col-span-2 flex items-end">
          <button
            type="submit"
            className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-label-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer rounded-lg shadow-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.adminAddOffer}</span>
          </button>
        </div>
      </form>

      {/* Coupons Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left rtl:text-right text-xs min-w-[700px]">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 font-mono uppercase text-[11px]">
              <th className="py-3 px-3">{t.adminCouponsPromoCodes}</th>
              <th className="py-3 px-3">{t.adminDiscountPercentage}</th>
              <th className="py-3 px-3">{t.adminMinOrderEgp}</th>
              <th className="py-3 px-3">{t.adminCouponUsageCount}</th>
              <th className="py-3 px-3 text-center">{t.adminProductTableStatus}</th>
              <th className="py-3 px-3 text-right rtl:text-left">{t.adminProductTableActions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {coupons.map((coupon) => {
              const timesUsed = coupon.timesUsed || 0;
              const hasLimit = coupon.usageLimit !== null && coupon.usageLimit !== undefined && coupon.usageLimit > 0;
              const isExhausted = hasLimit && timesUsed >= coupon.usageLimit!;
              const usagePercent = hasLimit ? Math.min(100, Math.round((timesUsed / coupon.usageLimit!) * 100)) : 0;

              return (
                <tr key={coupon.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-white tracking-wider">
                    {coupon.code}
                  </td>
                  <td className="py-3 px-3 font-mono text-emerald-400 font-bold">
                    {coupon.discountPercentage}% OFF
                  </td>
                  <td className="py-3 px-3 font-mono text-zinc-400">
                    {formatPrice(coupon.minOrderAmount || 0)}
                  </td>
                  
                  {/* Usage Count & Orders Column */}
                  <td className="py-3 px-3 font-mono">
                    {hasLimit ? (
                      <div className="space-y-1.5 min-w-[130px]">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={`font-bold ${isExhausted ? 'text-red-400' : 'text-zinc-200'}`}>
                            {timesUsed} / {coupon.usageLimit} {isExhausted ? '🔴' : ''}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {isExhausted ? t.adminCouponExhausted : `${coupon.usageLimit! - timesUsed} متبقي`}
                          </span>
                        </div>
                        {/* Mini Progress Bar */}
                        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              isExhausted
                                ? 'bg-red-500'
                                : usagePercent > 75
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${usagePercent}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-zinc-400 text-xs">
                        <span className="font-bold text-zinc-200">{timesUsed}</span>
                        <span>/</span>
                        <span className="text-zinc-500 font-mono">{t.adminCouponUnlimited}</span>
                      </span>
                    )}
                  </td>

                  {/* Status Column */}
                  <td className="py-3 px-3 text-center">
                    {isExhausted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono font-bold bg-red-950/80 border border-red-800 text-red-300 rounded">
                        <AlertCircle className="w-3 h-3 text-red-400" />
                        <span>{t.adminCouponExhausted}</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => updateCoupon(coupon.id, { isActive: !coupon.isActive })}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono font-bold cursor-pointer rounded ${
                          coupon.isActive
                            ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                            : 'bg-zinc-900 border border-zinc-700 text-zinc-400'
                        }`}
                      >
                        {coupon.isActive ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-zinc-500" />}
                        <span>{coupon.isActive ? t.adminActiveStatus : t.adminInactiveStatus}</span>
                      </button>
                    )}
                  </td>

                  {/* Actions Column */}
                  <td className="py-3 px-3 text-right rtl:text-left">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(coupon)}
                        className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                        title="تعديل الحد أو النسبة"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteCoupon(coupon.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                        title={t.delete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Coupon Modal */}
      {editingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold font-mono text-white">
                  تعديل الكوبون: {editingCoupon.code}
                </h3>
              </div>
              <button
                onClick={() => setEditingCoupon(null)}
                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-zinc-400 font-bold mb-1">
                  {t.adminDiscountPercentage} (%)
                </label>
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={editDiscountInput}
                  onChange={(e) => setEditDiscountInput(parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-white rounded-lg focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">
                  {t.adminMinOrderEgp}
                </label>
                <input
                  type="number"
                  min={0}
                  value={editMinAmountInput}
                  onChange={(e) => setEditMinAmountInput(parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-white rounded-lg focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-amber-400 font-bold mb-1 flex items-center justify-between">
                  <span>{t.adminCouponUsageLimit}</span>
                  <span className="text-[10px] text-zinc-500 font-normal">
                    (المستخدم حالياً: {editingCoupon.timesUsed || 0} مرات)
                  </span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={editLimitInput}
                  onChange={(e) => setEditLimitInput(e.target.value)}
                  placeholder="اتركه فارغاً لغير محدود"
                  className="w-full bg-zinc-900 border border-amber-500/40 px-3 py-2 text-white rounded-lg focus:outline-none focus:border-amber-400"
                />
                <p className="text-[10px] text-zinc-500 mt-1">
                  يمكنك زيادة الحد (مثلاً من 10 إلى 20) لتمديد صلاحية الكوبون تلقائياً لمستخدمين جدد.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setEditingCoupon(null)}
                className="px-4 py-2 text-xs font-mono font-bold text-zinc-400 hover:text-white cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-mono font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>حفظ التعديلات</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
