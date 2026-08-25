import React, { useState } from 'react';
import { Percent, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage, useCurrency, useStoreData } from '@/shared';

export const AdminCouponsManager: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useStoreData();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState<number>(10);
  const [newCouponMinAmount, setNewCouponMinAmount] = useState<number>(500);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountPercentage: Number(newCouponDiscount),
      minOrderAmount: Number(newCouponMinAmount),
      isActive: true
    });

    setNewCouponCode('');
    setNewCouponDiscount(10);
    setNewCouponMinAmount(500);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 shadow-xl space-y-6">
      <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2 pb-3 border-b border-zinc-800">
        <Percent className="w-4 h-4 text-emerald-400" />
        <span>{t.adminCouponsPromoCodes}</span>
      </h2>

      {/* Create Coupon Form */}
      <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-zinc-900/60 border border-zinc-800">
        <div className="sm:col-span-4">
          <label className="block text-[11px] text-zinc-400 font-bold mb-1">
            {t.adminCouponsPromoCodes} *
          </label>
          <input
            type="text"
            required
            value={newCouponCode}
            onChange={(e) => setNewCouponCode(e.target.value)}
            placeholder="e.g. EIFFEL15, SUMMER25"
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-white"
          />
        </div>

        <div className="sm:col-span-3">
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
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-white"
          />
        </div>

        <div className="sm:col-span-3">
          <label className="block text-[11px] text-zinc-400 font-bold mb-1">
            {t.adminMinOrderEgp}
          </label>
          <input
            type="number"
            min={0}
            value={newCouponMinAmount}
            onChange={(e) => setNewCouponMinAmount(parseInt(e.target.value) || 0)}
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-white"
          />
        </div>

        <div className="sm:col-span-2 flex items-end">
          <button
            type="submit"
            className="w-full py-2 bg-white text-black hover:bg-zinc-200 text-xs font-label-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.adminAddOffer}</span>
          </button>
        </div>
      </form>

      {/* Coupons Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left rtl:text-right text-xs">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 font-mono uppercase text-[11px]">
              <th className="py-3 px-3">{t.adminCouponsPromoCodes}</th>
              <th className="py-3 px-3">{t.adminDiscountPercentage}</th>
              <th className="py-3 px-3">{t.adminMinOrderEgp}</th>
              <th className="py-3 px-3 text-center">{t.adminProductTableStatus}</th>
              <th className="py-3 px-3 text-right rtl:text-left">{t.adminProductTableActions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-zinc-900/30">
                <td className="py-3 px-3 font-mono font-bold text-white tracking-wider">
                  {coupon.code}
                </td>
                <td className="py-3 px-3 font-mono text-emerald-400 font-bold">
                  {coupon.discountPercentage}% OFF
                </td>
                <td className="py-3 px-3 font-mono text-zinc-400">
                  {formatPrice(coupon.minOrderAmount || 0)}
                </td>
                <td className="py-3 px-3 text-center">
                  <button
                    onClick={() => updateCoupon(coupon.id, { isActive: !coupon.isActive })}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono font-bold cursor-pointer ${
                      coupon.isActive
                        ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                        : 'bg-zinc-900 border border-zinc-700 text-zinc-400'
                    }`}
                  >
                    {coupon.isActive ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-zinc-500" />}
                    <span>{coupon.isActive ? t.adminActiveStatus : t.adminInactiveStatus}</span>
                  </button>
                </td>
                <td className="py-3 px-3 text-right rtl:text-left">
                  <button
                    onClick={() => deleteCoupon(coupon.id)}
                    className="p-1 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                    title={t.delete}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
