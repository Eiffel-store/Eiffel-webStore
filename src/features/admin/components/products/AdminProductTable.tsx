import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Tag, ShoppingBag, ExternalLink } from 'lucide-react';
import { Product } from '@/types';
import { useLanguage, useCurrency } from '@/shared';

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
  const { isRTL } = useLanguage();
  const { formatPrice } = useCurrency();

  if (products.length === 0) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 p-12 text-center text-zinc-500">
        <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm font-medium">{isRTL ? 'لا توجد منتجات مطابقة لخيارات البحث.' : 'No products found matching criteria.'}</p>
        <p className="text-xs text-zinc-600 mt-1">{isRTL ? 'جرب البحث باسم آخر أو إزالة التصفية.' : 'Try changing search keywords or category filters.'}</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 overflow-x-auto shadow-xl">
      <table className="w-full text-left rtl:text-right border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/60 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
            <th className="py-3.5 px-4">{isRTL ? 'المنتج' : 'Product'}</th>
            <th className="py-3.5 px-4">{isRTL ? 'القسم' : 'Category'}</th>
            <th className="py-3.5 px-4">{isRTL ? 'السعر' : 'Price'}</th>
            <th className="py-3.5 px-4">{isRTL ? 'المقاسات والألوان' : 'Variants'}</th>
            <th className="py-3.5 px-4 text-center">{isRTL ? 'حالة المخزون' : 'Stock Status'}</th>
            <th className="py-3.5 px-4 text-right rtl:text-left">{isRTL ? 'إجراءات' : 'Actions'}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60 text-xs">
          {products.map((product) => {
            const hasSale = product.originalPrice && product.originalPrice > product.price;

            return (
              <tr key={product.id} className="hover:bg-zinc-900/40 transition-colors group">
                {/* Product Media & Info */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-14 object-cover bg-zinc-900 shrink-0 border border-zinc-800"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-white group-hover:text-zinc-200 truncate">
                        {product.name}
                      </div>
                      <div className="text-[11px] text-zinc-500 font-mono">
                        {product.id}
                      </div>
                      {product.badge && (
                        <span className="inline-block mt-0.5 text-[9px] font-mono px-1.5 py-0.2 bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {product.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3.5 px-4">
                  <span className="font-mono uppercase text-[11px] text-zinc-300 bg-zinc-900 px-2 py-1 rounded">
                    {product.category}
                  </span>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{product.subCategory}</div>
                </td>

                {/* Pricing */}
                <td className="py-3.5 px-4 font-mono">
                  <div className="font-bold text-white">{formatPrice(product.price)}</div>
                  {hasSale && (
                    <div className="text-[10px] text-zinc-500 line-through">
                      {formatPrice(product.originalPrice!)}
                    </div>
                  )}
                  {hasSale && (
                    <span className="text-[9px] text-amber-400 font-bold flex items-center gap-0.5 mt-0.5">
                      <Tag className="w-2.5 h-2.5" />
                      {isRTL ? 'خصم مفعّل' : 'On Sale'}
                    </span>
                  )}
                </td>

                {/* Variants */}
                <td className="py-3.5 px-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {product.sizes.slice(0, 4).map((s) => (
                      <span key={s} className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 text-zinc-400">
                        {s}
                      </span>
                    ))}
                    {product.sizes.length > 4 && (
                      <span className="text-[10px] font-mono text-zinc-500 self-center">
                        +{product.sizes.length - 4}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    {product.colors.map((c) => (
                      <span
                        key={c.name}
                        title={c.name}
                        className="w-3 h-3 rounded-full border border-zinc-700 inline-block shadow-sm"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </td>

                {/* Stock Units & Toggle */}
                <td className="py-3.5 px-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`text-[11px] font-mono font-bold ${
                      (product.stock ?? 20) <= 0
                        ? 'text-rose-400'
                        : (product.stock ?? 20) <= 5
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}>
                      {product.stock !== undefined ? `${product.stock} ${isRTL ? 'قطع' : 'units'}` : (isRTL ? '20 قطعة' : '20 units')}
                    </span>
                    <button
                      onClick={() => onToggleStock(product)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono font-bold transition-colors rounded cursor-pointer ${
                        product.inStock
                          ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-300 hover:bg-emerald-900'
                          : 'bg-red-950/70 border border-red-800 text-red-300 hover:bg-red-900'
                      }`}
                      title={isRTL ? 'اضغط لتغيير الحالة' : 'Click to toggle status'}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-emerald-400' : 'bg-red-400'}`} />
                      <span>{product.inStock ? (isRTL ? 'متوفر' : 'In Stock') : (isRTL ? 'نفد' : 'Out of Stock')}</span>
                    </button>
                  </div>
                </td>

                {/* Action Buttons */}
                <td className="py-3.5 px-4 text-right rtl:text-left">
                  <div className="flex items-center justify-end rtl:justify-start gap-2">
                    <Link
                      to={`/product/${product.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                      title={isRTL ? 'معاينة في المتجر' : 'Live Preview'}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={`/admin/products/edit/${product.id}`}
                      className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                      title={isRTL ? 'تعديل المنتج' : 'Edit Product'}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => onDeletePrompt(product.id)}
                      className="p-1.5 bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-400 border border-zinc-800 transition-colors"
                      title={isRTL ? 'حذف المنتج' : 'Delete Product'}
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
  );
};
