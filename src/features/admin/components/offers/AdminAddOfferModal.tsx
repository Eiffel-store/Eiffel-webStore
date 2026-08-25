import React, { useState } from 'react';
import { Tag, Sparkles, AlertCircle, X, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { useLanguage, useCurrency } from '@/shared';

interface AdminAddOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onApplyOffer: (productId: string, salePrice: number, baseOriginalPrice?: number) => void;
}

export const AdminAddOfferModal: React.FC<AdminAddOfferModalProps> = ({
  isOpen,
  onClose,
  products,
  onApplyOffer
}) => {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  const [selectedProductId, setSelectedProductId] = useState('');
  const [originalPriceInput, setOriginalPriceInput] = useState<number>(0);
  const [offerSalePrice, setOfferSalePrice] = useState<number>(0);

  if (!isOpen) return null;

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || offerSalePrice <= 0) return;
    onApplyOffer(selectedProductId, offerSalePrice, originalPriceInput > 0 ? originalPriceInput : undefined);
    setSelectedProductId('');
    setOfferSalePrice(0);
    setOriginalPriceInput(0);
    onClose();
  };

  const handleProductSelect = (id: string) => {
    setSelectedProductId(id);
    const found = products.find(p => p.id === id);
    if (found) {
      const base = found.originalPrice && found.originalPrice > found.price ? found.originalPrice : found.price;
      setOriginalPriceInput(base);
      setOfferSalePrice(Math.round(found.price > 0 ? (found.originalPrice && found.originalPrice > found.price ? found.price : found.price * 0.8) : 100));
    }
  };

  const discountPercentage = originalPriceInput > offerSalePrice && originalPriceInput > 0
    ? Math.round(((originalPriceInput - offerSalePrice) / originalPriceInput) * 100)
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-zinc-950 border border-zinc-800 max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in rounded-xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">
              {t.adminAddProductToOffers}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {products.length === 0 ? (
          <div className="py-6 text-center text-zinc-400 space-y-4">
            <AlertCircle className="w-10 h-10 mx-auto text-amber-400/80" />
            <div>
              <p className="text-sm font-semibold text-white">
                {t.noProductsFound}
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                {t.noPiecesFoundDesc}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700 rounded-lg transition-colors cursor-pointer"
              >
                {t.cancel}
              </button>
              <Link
                to="/admin/products/new"
                onClick={onClose}
                className="px-4 py-2 bg-white text-black hover:bg-zinc-200 text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.adminAddNewProduct}</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-300 font-bold mb-1.5">
                {t.adminProductTableName} *
              </label>
              <select
                required
                value={selectedProductId}
                onChange={(e) => handleProductSelect(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2.5 text-xs text-white rounded focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="">-- {t.adminCatalog} --</option>
                {products.map((p) => {
                  const isOnSale = p.originalPrice && p.originalPrice > p.price;
                  return (
                    <option key={p.id} value={p.id}>
                      {p.name} ({formatPrice(p.price)}) {isOnSale ? `— [${t.adminBadgeSale}]` : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {selectedProduct && (
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
                  <img
                    src={selectedProduct.images?.[0] || 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop'}
                    alt={selectedProduct.name}
                    className="w-12 h-14 object-cover rounded bg-zinc-950 border border-zinc-700"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate">{selectedProduct.name}</h4>
                    <span className="text-[11px] text-zinc-400 font-mono">{selectedProduct.category}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-zinc-400 font-medium mb-1">
                      {t.adminOriginalPrice}:
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={originalPriceInput}
                      onChange={(e) => setOriginalPriceInput(parseFloat(e.target.value) || 0)}
                      className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-xs text-zinc-300 font-mono rounded focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-amber-400 font-bold mb-1">
                      {t.adminCurrentPrice}:
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={originalPriceInput > 1 ? originalPriceInput - 1 : undefined}
                      value={offerSalePrice}
                      onChange={(e) => setOfferSalePrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-zinc-950 border border-amber-500 px-3 py-2 text-xs text-white font-mono font-bold rounded focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {discountPercentage > 0 && (
                  <div className="text-xs text-emerald-400 font-mono flex items-center justify-between p-2 bg-emerald-950/40 border border-emerald-800/60 rounded">
                    <span>{t.adminDiscountPercentage}:</span>
                    <span className="font-bold text-sm">
                      {discountPercentage}% OFF
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700 rounded transition-colors cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={!selectedProductId || offerSalePrice <= 0 || offerSalePrice >= originalPriceInput}
                className="px-5 py-2 bg-white text-black hover:bg-zinc-200 disabled:opacity-40 text-xs font-bold rounded transition-colors flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.adminApplyDiscount}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
