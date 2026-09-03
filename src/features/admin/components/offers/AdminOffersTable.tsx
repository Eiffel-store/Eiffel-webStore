import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Trash2, ExternalLink } from 'lucide-react';
import { Product } from '@/types';
import { useLanguage, useCurrency } from '@/shared';

interface AdminOffersTableProps {
  products: Product[];
  onRemoveOffer: (id: string) => void;
  onOpenAddModal: () => void;
}

export const AdminOffersTable: React.FC<AdminOffersTableProps> = ({
  products,
  onRemoveOffer,
  onOpenAddModal
}) => {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div>
          <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-400" />
            <span>{t.adminDiscountedProductsOnSale}</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {products.length} {t.items}
          </p>
        </div>
        <Link
          to="/collections/offers"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-mono"
        >
          <span>{t.adminStorePreview}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="py-12 text-center text-zinc-500 space-y-3">
          <Tag className="w-10 h-10 mx-auto opacity-30 text-amber-400" />
          <p className="text-xs">{t.noMatchingPieces}</p>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium border border-zinc-700 inline-flex items-center gap-1.5 cursor-pointer"
          >
            {t.adminApplyDiscount}
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs min-w-[620px]">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 font-mono uppercase text-[11px]">
                <th className="py-3 px-3">{t.adminProductTableName}</th>
                <th className="py-3 px-3">{t.adminOriginalPrice}</th>
                <th className="py-3 px-3">{t.adminCurrentPrice}</th>
                <th className="py-3 px-3">{t.adminDiscountPercentage}</th>
                <th className="py-3 px-3 text-right rtl:text-left">{t.adminProductTableActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {products.map((p) => {
                const discountPct = p.originalPrice
                  ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                  : 0;

                return (
                  <tr key={p.id} className="hover:bg-zinc-900/30">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-12 object-cover bg-zinc-900 border border-zinc-800"
                        />
                        <div>
                          <div className="font-bold text-white">{p.name}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">{p.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-zinc-400 line-through">
                      {formatPrice(p.originalPrice!)}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                      {formatPrice(p.price)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-amber-950/70 border border-amber-800 text-amber-300 font-mono text-[10px] font-bold rounded">
                        -{discountPct}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right rtl:text-left">
                      <button
                        onClick={() => onRemoveOffer(p.id)}
                        className="px-2.5 py-1 bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-400 border border-zinc-800 text-[11px] transition-colors flex items-center gap-1 inline-flex cursor-pointer"
                        title={t.adminRemoveDiscount}
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{t.adminRemoveDiscount}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
