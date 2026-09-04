import React from 'react';
import { Crown, Sparkles, ShoppingBag, Coins, Percent, Truck } from 'lucide-react';
import { StoreSettings } from '@/types';
import { useLanguage } from '@/shared';

interface AdminLoyaltyVIPSettingsFormProps {
  settings: StoreSettings;
  onChange: (updates: Partial<StoreSettings>) => void;
}

export const AdminLoyaltyVIPSettingsForm: React.FC<AdminLoyaltyVIPSettingsFormProps> = ({
  settings,
  onChange,
}) => {
  const { t } = useLanguage();

  const requiredOrders = settings.vipRequiredOrders ?? 3;
  const requiredPoints = settings.vipRequiredPoints ?? 500;
  const vipDiscount = settings.vipDiscountPercentage ?? 10;
  const cashbackRatePercent = Math.round((settings.loyaltyCashbackRate ?? 0.05) * 100);
  const vipFreeShipping = settings.vipFreeShipping ?? true;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <Crown className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2">
            <span>{t.adminLoyaltyVipSettings}</span>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] rounded font-mono font-bold">
              DYNAMIC
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {t.adminLoyaltyVipSettingsDesc}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Required Orders for VIP */}
        <div className="bg-zinc-900/60 p-4 border border-zinc-800 rounded-lg space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>{t.adminRequiredOrdersVip}</span>
            </label>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {requiredOrders} {t.orders}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="50"
              value={requiredOrders}
              onChange={(e) => onChange({ vipRequiredOrders: Math.max(1, parseInt(e.target.value) || 1) })}
              className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-400 rounded transition-colors"
            />
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[10px] text-zinc-500">{t.adminQuickPresets}</span>
            {[1, 2, 3, 5, 10].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onChange({ vipRequiredOrders: preset })}
                className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border transition-colors cursor-pointer ${
                  requiredOrders === preset
                    ? 'bg-amber-400 text-black border-amber-400'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-zinc-500">
            {t.adminVipAutoUpgradeOrdersDesc}
          </p>
        </div>

        {/* Required Points Threshold */}
        <div className="bg-zinc-900/60 p-4 border border-zinc-800 rounded-lg space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>{t.adminOrMinPointsBalance}</span>
            </label>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {requiredPoints} PTS
            </span>
          </div>

          <input
            type="number"
            min="50"
            step="50"
            value={requiredPoints}
            onChange={(e) => onChange({ vipRequiredPoints: Math.max(0, parseInt(e.target.value) || 0) })}
            className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-400 rounded transition-colors"
          />

          <p className="text-[11px] text-zinc-500">
            {t.adminVipAutoUpgradePointsDesc}
          </p>
        </div>

        {/* Cashback Points Earn Rate */}
        <div className="bg-zinc-900/60 p-4 border border-zinc-800 rounded-lg space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-blue-400" />
              <span>{t.adminLoyaltyCashbackRate}</span>
            </label>
            <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              {cashbackRatePercent}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="50"
              value={cashbackRatePercent}
              onChange={(e) => {
                const val = Math.max(1, Math.min(50, parseInt(e.target.value) || 5));
                onChange({ loyaltyCashbackRate: val / 100 });
              }}
              className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-400 rounded transition-colors"
            />
            <span className="text-xs font-mono text-zinc-400 font-bold">%</span>
          </div>

          <p className="text-[11px] text-zinc-500">
            {t.adminLoyaltyCashbackDesc}
          </p>
        </div>

        {/* VIP Exclusive Discount Percentage */}
        <div className="bg-zinc-900/60 p-4 border border-zinc-800 rounded-lg space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t.adminVipExclusiveDiscount}</span>
            </label>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {vipDiscount}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="90"
              value={vipDiscount}
              onChange={(e) => onChange({ vipDiscountPercentage: Math.max(0, parseInt(e.target.value) || 0) })}
              className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-400 rounded transition-colors"
            />
            <span className="text-xs font-mono text-zinc-400 font-bold">%</span>
          </div>

          <p className="text-[11px] text-zinc-500">
            {t.adminVipExclusiveDiscountDesc}
          </p>
        </div>
      </div>

      {/* Free Shipping Checkbox for VIP */}
      <div className="p-3.5 bg-zinc-900/40 border border-zinc-800 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-xs font-bold text-white block">
              {t.adminVipFreeShippingAlways}
            </span>
            <span className="text-[11px] text-zinc-400 block">
              {t.adminVipFreeShippingDesc}
            </span>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={vipFreeShipping}
            onChange={(e) => onChange({ vipFreeShipping: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
        </label>
      </div>
    </div>
  );
};
