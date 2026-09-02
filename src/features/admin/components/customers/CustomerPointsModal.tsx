import React, { useState } from 'react';
import { Coins, Plus, Minus, X } from 'lucide-react';
import { User } from '@/types';
import { useLanguage, useCurrency } from '@/shared';

interface CustomerPointsModalProps {
  customer: User | null;
  onClose: () => void;
  onSave: (pointsDelta: number) => Promise<void>;
  isUpdating: boolean;
}

export const CustomerPointsModal: React.FC<CustomerPointsModalProps> = ({
  customer,
  onClose,
  onSave,
  isUpdating,
}) => {
  const {  t } = useLanguage();
  const { formatPrice } = useCurrency();

  const [pointsAction, setPointsAction] = useState<'add' | 'deduct'>('add');
  const [pointsInput, setPointsInput] = useState<number>(50);

  if (!customer) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const delta = pointsAction === 'add' ? pointsInput : -pointsInput;
    await onSave(delta);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl text-zinc-100 p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-mono font-bold text-white uppercase">
                {t.adjustPoints}
              </h3>
              <p className="text-xs text-zinc-400 font-sans">{customer.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Current Balance */}
          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">
              {t.adminCurrentBalance}
            </span>
            <span className="text-sm font-mono font-bold text-emerald-400">
              {customer.tierPoints || customer.points || 0} PTS
            </span>
          </div>

          {/* Add / Deduct Switch */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPointsAction('add')}
              className={`py-2 rounded text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                pointsAction === 'add'
                  ? 'bg-emerald-500 text-black shadow'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addPoints}</span>
            </button>

            <button
              type="button"
              onClick={() => setPointsAction('deduct')}
              className={`py-2 rounded text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                pointsAction === 'deduct'
                  ? 'bg-rose-500 text-white shadow'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Minus className="w-3.5 h-3.5" />
              <span>{t.deductPoints}</span>
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              {t.pointsAmount}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              required
              value={pointsInput}
              onChange={(e) => setPointsInput(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-mono text-white focus:outline-none focus:border-amber-400"
            />
            <p className="text-[11px] text-zinc-500 font-mono mt-1">
              {`${t.adminPointsValueEquivalent}: ${formatPrice(pointsInput)}`}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white cursor-pointer"
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              disabled={isUpdating}
              className="px-5 py-2 rounded bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs shadow-lg shadow-amber-400/20 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isUpdating ? t.saving : t.saveChanges}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
