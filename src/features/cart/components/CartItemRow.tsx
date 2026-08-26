import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem } from '@/types';
import { useCurrency, CachedImage } from '@/shared';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const { formatPrice } = useCurrency();
  const { product, quantity, selectedColor, selectedSize } = item;

  const colorObj = product?.colors?.find(c => c.name.toLowerCase() === selectedColor.toLowerCase());
  const img = colorObj?.image || product?.images?.[0] || 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop';

  return (
    <div className="flex gap-3 sm:gap-4 py-4 border-b border-surface-container dark:border-zinc-800">
      <div className="w-18 h-24 sm:w-20 sm:h-28 shrink-0 overflow-hidden bg-zinc-900">
        <CachedImage src={img} alt={product?.name || 'Item'} width={160} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-editorial text-sm sm:text-base font-bold text-primary dark:text-white line-clamp-1">{product?.name}</h4>
            <button onClick={onRemove} className="text-secondary hover:text-red-500 p-1">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{selectedColor} / {selectedSize}</p>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center border border-surface-container dark:border-zinc-700 bg-surface-container-low dark:bg-zinc-900">
            <button onClick={() => onUpdateQuantity(quantity - 1)} className="p-1 sm:p-1.5 hover:bg-zinc-800 text-zinc-300">
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 font-mono text-xs text-primary dark:text-white">{quantity}</span>
            <button onClick={() => onUpdateQuantity(quantity + 1)} className="p-1 sm:p-1.5 hover:bg-zinc-800 text-zinc-300">
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <span className="font-mono text-xs sm:text-sm font-bold text-primary dark:text-white">
            {formatPrice((product?.price || 0) * quantity)}
          </span>
        </div>
      </div>
    </div>
  );
};
