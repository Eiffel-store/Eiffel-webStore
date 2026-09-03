import React from 'react';
import { Package, ShieldAlert, Layers, Info } from 'lucide-react';
import { StoreSettings } from '@/types';
import { useLanguage } from '@/shared';

interface AdminOrderQuantityLimitsFormProps {
  settings: StoreSettings;
  onChange: (updates: Partial<StoreSettings>) => void;
}

export const AdminOrderQuantityLimitsForm: React.FC<AdminOrderQuantityLimitsFormProps> = ({
  settings,
  onChange,
}) => {
  const { isRTL, t } = useLanguage();

  const currentMin = settings.minPiecesPerItem ?? 1;
  const currentMax = settings.maxPiecesPerItem ?? 3;

  return (
    <div className="space-y-4 pt-4 border-t border-zinc-800">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Package className="w-4 h-4 text-amber-400" />
          <span>{isRTL ? 'قيود وحدود كميات الشراء للقطعة الواحدة' : 'Per-Item Order Quantity Limits'}</span>
        </h2>
        <span className="text-[11px] text-amber-400/90 font-mono bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
          {isRTL ? 'حماية المخزون والسبام' : 'Anti-Spam & Fair Inventory'}
        </span>
      </div>

      <div className="p-3.5 bg-amber-950/20 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-xs text-amber-200/90">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>
          {isRTL
            ? 'تتيح لك هذه الإعدادات التحكم الكامل في أقل وأقصى كمية يمكن للعميل إضافتها وطلبها من القطعة الواحدة لمنع استنزاف المخزون السريع في الطلب الواحد.'
            : 'Controls the minimum and maximum quantity a customer can add to their cart per item to prevent inventory hoard and bulk spam.'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Min Pieces Per Item */}
        <div className="space-y-1.5 bg-zinc-900/50 p-3.5 rounded-xl border border-zinc-800">
          <label className="block text-xs text-zinc-200 font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              {isRTL ? 'أقل عدد مسموح بطلبه (الحد الأدنى للقطعة)' : 'Minimum Quantity Per Item (MOQ)'}
            </span>
            <span className="font-mono text-amber-400 text-[11px]">{currentMin} {isRTL ? 'قطعة' : 'pcs'}</span>
          </label>
          <input
            type="number"
            min={1}
            max={Math.max(1, currentMax)}
            value={currentMin}
            onChange={(e) => {
              const val = Math.max(1, parseInt(e.target.value) || 1);
              onChange({ minPiecesPerItem: val });
            }}
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono rounded"
          />
          <p className="text-[11px] text-zinc-500">
            {isRTL
              ? 'أقل كمية تبدأ بها السلة عند الشراء (افتراضياً قطعة واحدة 1).'
              : 'Minimum quantity customer must select to add to bag (default: 1).'}
          </p>
        </div>

        {/* Max Pieces Per Item */}
        <div className="space-y-1.5 bg-zinc-900/50 p-3.5 rounded-xl border border-zinc-800">
          <label className="block text-xs text-zinc-200 font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
              {isRTL ? 'أقصى عدد مسموح به (الحد الأقصى للقطعة)' : 'Maximum Quantity Per Item'}
            </span>
            <span className="font-mono text-blue-400 text-[11px]">{currentMax} {isRTL ? 'قطع' : 'pcs'}</span>
          </label>
          <input
            type="number"
            min={currentMin}
            max={50}
            value={currentMax}
            onChange={(e) => {
              const val = Math.max(currentMin, parseInt(e.target.value) || 1);
              onChange({ maxPiecesPerItem: val });
            }}
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono rounded"
          />
          <p className="text-[11px] text-zinc-500">
            {isRTL
              ? 'الحد الأقصى المسموح بشرائه من نفس الموديل/اللون للطلب الواحد (افتراضياً 3).'
              : 'Max pieces of the same item allowed in a single order (default: 3).'}
          </p>
        </div>
      </div>
    </div>
  );
};
