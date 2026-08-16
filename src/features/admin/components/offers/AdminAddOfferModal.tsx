import React, { useState } from 'react';
import { Tag, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { useLanguage, useCurrency } from '@/shared';

interface AdminAddOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onApplyOffer: (productId: string, salePrice: number) => void;
}

export const AdminAddOfferModal: React.FC<AdminAddOfferModalProps> = ({
  isOpen,
  onClose,
  products,
  onApplyOffer
}) => {
  const { isRTL } = useLanguage();
  const { formatPrice } = useCurrency();

  const [selectedProductId, setSelectedProductId] = useState('');
  const [offerSalePrice, setOfferSalePrice] = useState<number>(0);

  if (!isOpen) return null;

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || offerSalePrice <= 0) return;
    onApplyOffer(selectedProductId, offerSalePrice);
    setSelectedProductId('');
    setOfferSalePrice(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
          <Tag className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-sm text-white">
            {isRTL ? 'إدراج منتج في قسم العروض' : 'Apply Discount to Product'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-300 font-bold mb-1.5">
              {isRTL ? 'اختر المنتج من الكتالوج *' : 'Select Product *'}
            </label>
            <select
              required
              value={selectedProductId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedProductId(id);
                const found = products.find(p => p.id === id);
                if (found) {
                  setOfferSalePrice(Math.round(found.price * 0.8)); // default 20% discount
                }
              }}
              className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
            >
              <option value="">{isRTL ? '-- اختر منتجاً --' : '-- Choose a product --'}</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({formatPrice(p.price)})
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="p-3 bg-zinc-900/60 border border-zinc-800 space-y-2">
              <div className="text-xs text-zinc-300 flex justify-between">
                <span>{isRTL ? 'السعر الأساسي الحالي:' : 'Current Regular Price:'}</span>
                <span className="font-mono font-bold text-white">{formatPrice(selectedProduct.price)}</span>
              </div>

              <div>
                <label className="block text-xs text-amber-400 font-bold mb-1">
                  {isRTL ? 'السعر المخفض الجديد (EGP) *' : 'New Discounted Sale Price (EGP) *'}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={selectedProduct.price - 1}
                  value={offerSalePrice}
                  onChange={(e) => setOfferSalePrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-amber-700 px-3 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-white"
                />
              </div>

              {offerSalePrice > 0 && (
                <div className="text-[11px] text-emerald-400 font-mono flex items-center justify-between pt-1">
                  <span>{isRTL ? 'نسبة الخصم المحسوبة:' : 'Calculated Discount:'}</span>
                  <span className="font-bold">
                    {Math.round(((selectedProduct.price - offerSalePrice) / selectedProduct.price) * 100)}% OFF
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={!selectedProductId || offerSalePrice <= 0}
              className="px-5 py-2 bg-white text-black hover:bg-zinc-200 disabled:opacity-50 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRTL ? 'تفعيل العرض' : 'Apply Sale'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
