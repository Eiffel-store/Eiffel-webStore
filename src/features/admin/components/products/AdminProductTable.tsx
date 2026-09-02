import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Tag, ShoppingBag, ExternalLink } from 'lucide-react';
import { Product } from '@/types';
import { useLanguage, useCurrency, useStoreData, getColorBackgroundStyle } from '@/shared';

interface AdminProductTableProps {
  products: Product[];
  onToggleStock: (product: Product) => void;
  onDeletePrompt: (id: string) => void;
}

export const AdminProductTable: React.FC<AdminProductTableProps> = ({
  products,
  onToggleStock,
  onDeletePrompt
}) => {
  const {  t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const { categories } = useStoreData();

  if (products.length === 0) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-12 text-center text-zinc-500 shadow-xl">
        <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30 text-zinc-400" />
        <p className="text-sm font-bold text-zinc-300">{t.noMatchingPieces}</p>
        <p className="text-xs text-zinc-500 mt-1">{t.noPiecesFoundDesc}</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-right rtl:text-right ltr:text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              <th className="py-4 px-4 w-[34%]">{t.adminProductTableName}</th>
              <th className="py-4 px-4 w-[14%] whitespace-nowrap text-center">{t.adminProductTableCategory}</th>
              <th className="py-4 px-4 w-[14%] whitespace-nowrap text-center">{t.adminProductTablePrice}</th>
              <th className="py-4 px-4 w-[16%] whitespace-nowrap text-center">{t.adminSizesAndVariants}</th>
              <th className="py-4 px-4 w-[12%] whitespace-nowrap text-center">{t.adminProductTableStatus}</th>
              <th className="py-4 px-4 w-[10%] whitespace-nowrap text-center rtl:text-left ltr:text-right">{t.adminProductTableActions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-850/80 text-xs">
            {products.map((product) => {
              const hasSale = Boolean(product.originalPrice && product.originalPrice > product.price);
              const mainImg = product.images && product.images.length > 0 ? product.images[0] : '';

              return (
                <tr key={product.id} className="hover:bg-zinc-900/50 transition-colors group">
                  {/* 1. Product Media & Info */}
                  <td className="py-4 px-4 align-middle">
                    <div className="flex items-center gap-3">
                      {mainImg ? (
                        <img
                          src={mainImg}
                          alt={product.name}
                          className="w-12 h-15 object-cover rounded-lg bg-zinc-900 shrink-0 border border-zinc-800 shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-15 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0 flex items-center justify-center text-zinc-600">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors line-clamp-1 block"
                          title={product.name}
                        >
                          {product.name}
                        </Link>
                        <div className="text-[10px] text-zinc-500 font-mono tracking-wider mt-0.5 truncate">
                          {product.id}
                        </div>
                        {product.badge && (
                          <span className="inline-block mt-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            {product.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* 2. Category */}
                  <td className="py-4 px-4 align-middle text-center">
                    {(() => {
                      const catObj = categories.find(c => c.id === product.category || c.name === product.category || c.nameEn === product.category);
                      const catDisplayName = catObj ? (language === 'ar' ? (catObj.name || catObj.nameEn) : (catObj.nameEn || catObj.name)) : product.category;
                      return (
                        <div className="inline-flex flex-col items-center">
                          <span className="font-mono uppercase text-[10px] font-bold text-zinc-300 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md tracking-wider whitespace-nowrap">
                            {catDisplayName}
                          </span>
                          {product.subCategory && (
                            <span className="text-[10px] text-zinc-500 font-medium mt-1 truncate max-w-[120px]">
                              {product.subCategory}
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </td>

                  {/* 3. Pricing */}
                  <td className="py-4 px-4 align-middle text-center whitespace-nowrap">
                    <div className="inline-flex items-center justify-center gap-1.5 font-mono">
                      <span className="font-bold text-sm text-white">
                        {formatPrice(product.price)}
                      </span>
                      {hasSale ? (
                        <span className="text-[11px] text-zinc-500 line-through">
                          {formatPrice(product.originalPrice!)}
                        </span>
                      ) : null}
                    </div>
                  </td>

                  {/* 4. Variants (Sizes & Colors) */}
                  <td className="py-4 px-4 align-middle text-center">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      {/* Sizes Chips */}
                      {product.sizes && product.sizes.length > 0 ? (
                        <div className="flex items-center justify-center gap-1 flex-wrap max-w-[160px]">
                          {product.sizes.slice(0, 4).map((s) => (
                            <span
                              key={s}
                              className="text-[10px] font-mono font-bold bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-300 shadow-xs"
                            >
                              {s}
                            </span>
                          ))}
                          {product.sizes.length > 4 && (
                            <span className="text-[9px] font-mono text-zinc-500 self-center">
                              +{product.sizes.length - 4}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-600">—</span>
                      )}

                      {/* Color Swatches (Solid & Two-Tone) */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center justify-center gap-1.5 mt-0.5">
                          {product.colors.slice(0, 5).map((c, cIdx) => (
                            <span
                              key={cIdx}
                              title={c.secondaryHex ? `${c.name} (Two-Tone)` : c.name}
                              className="w-3.5 h-3.5 rounded-full border border-zinc-700 shadow-xs inline-block"
                              style={getColorBackgroundStyle(c)}
                            />
                          ))}
                          {product.colors.length > 5 && (
                            <span className="text-[9px] font-mono text-zinc-500">
                              +{product.colors.length - 5}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* 5. Stock Units & Status Toggle */}
                  <td className="py-4 px-4 align-middle text-center whitespace-nowrap">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <span className={`text-[11px] font-mono font-bold tracking-tight ${
                        (product.stock ?? 20) <= 0
                          ? 'text-rose-400'
                          : (product.stock ?? 20) <= 5
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}>
                        {product.stock !== undefined ? `${product.stock} ${t.adminPiecesCount}` : `20 ${t.adminPiecesCount}`}
                      </span>

                      <button
                        type="button"
                        onClick={() => onToggleStock(product)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold rounded-full transition-all cursor-pointer shadow-xs ${
                          product.inStock
                            ? 'bg-emerald-950/70 border border-emerald-700/80 text-emerald-300 hover:bg-emerald-900/90'
                            : 'bg-red-950/70 border border-red-700/80 text-red-300 hover:bg-red-900/90'
                        }`}
                        title={product.inStock ? t.adminInStock : t.adminOutOfStock}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        <span>{product.inStock ? t.adminInStock : t.adminOutOfStock}</span>
                      </button>
                    </div>
                  </td>

                  {/* 6. Action Buttons */}
                  <td className="py-4 px-4 align-middle whitespace-nowrap">
                    <div className="flex items-center justify-center rtl:justify-start ltr:justify-end gap-1.5">
                      <Link
                        to={`/product/${product.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 transition-colors shadow-xs"
                        title={t.adminStorePreview}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="p-2 bg-zinc-900 hover:bg-amber-500/20 text-zinc-400 hover:text-amber-400 rounded-lg border border-zinc-800 hover:border-amber-500/40 transition-colors shadow-xs"
                        title={t.adminHeaderEditProduct}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDeletePrompt(product.id)}
                        className="p-2 bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-400 rounded-lg border border-zinc-800 hover:border-red-800 transition-colors cursor-pointer shadow-xs"
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
    </div>
  );
};
