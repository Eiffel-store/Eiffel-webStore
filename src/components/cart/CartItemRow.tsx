import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { CartItem } from '../../types';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  return (
    <div className="py-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
      <div className="flex gap-4">
        <Link
          to={`/product/${item.product.id}`}
          className="w-24 h-28 shrink-0 bg-surface-container-low dark:bg-zinc-900 overflow-hidden border border-surface-container dark:border-zinc-800"
        >
          <img
            src={item.product.images[0]}
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
        </Link>

        <div className="space-y-1">
          <span className="text-[10px] font-label-bold text-secondary dark:text-zinc-400 uppercase">
            {item.product.subCategory}
          </span>
          <Link
            to={`/product/${item.product.id}`}
            className="font-editorial text-xl text-primary dark:text-white hover:underline block"
          >
            {item.product.name}
          </Link>
          <p className="text-xs text-secondary dark:text-zinc-400 font-light">
            {t.colorway} <strong className="text-primary dark:text-white font-medium">{item.selectedColor}</strong> | {t.size}: <strong className="text-primary dark:text-white font-medium">{item.selectedSize}</strong>
          </p>
          <div className="font-mono text-sm font-bold text-primary dark:text-white pt-1">
            {formatPrice(item.product.price)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8">
        {/* Quantity Stepper */}
        <div className="flex items-center border border-surface-container dark:border-zinc-700 bg-surface-container-lowest dark:bg-zinc-900">
          <button
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            className="px-3 py-2 hover:bg-surface-container-high dark:hover:bg-zinc-800 text-primary dark:text-white transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-4 font-mono text-xs font-bold text-primary dark:text-white">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            className="px-3 py-2 hover:bg-surface-container-high dark:hover:bg-zinc-800 text-primary dark:text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total For Item */}
        <div className="font-mono text-base font-bold text-primary dark:text-white">
          {formatPrice(item.product.price * item.quantity)}
        </div>

        {/* Remove Button */}
        <button
          onClick={onRemove}
          className="text-secondary hover:text-error dark:hover:text-red-400 p-2 transition-colors"
          aria-label="Remove"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
