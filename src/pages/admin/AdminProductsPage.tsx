import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  ExternalLink,
  Tag,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';
import { useStoreData } from '../../context/StoreDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { Product } from '../../types';

export const AdminProductsPage: React.FC = () => {
  const { products, deleteProduct, updateProduct, categories } = useStoreData();
  const { isRTL } = useLanguage();
  const { formatPrice } = useCurrency();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' ||
      p.category === selectedCategory ||
      (selectedCategory === 'offers' && p.originalPrice && p.originalPrice > p.price);

    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'in-stock' && p.inStock) ||
      (stockFilter === 'out-of-stock' && !p.inStock);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirmId(null);
  };

  const handleToggleStock = (p: Product) => {
    updateProduct(p.id, { inStock: !p.inStock });
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-wide">
            {isRTL ? 'إدارة المنتجات' : 'Products Catalog'}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {isRTL
              ? `إجمالي ${products.length} قطعة في الكتالوج — التعديلات تنعكس على المتجر فوراً.`
              : `Total ${products.length} products available. Changes reflect live on the storefront.`}
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 transition-colors font-label-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isRTL ? 'إضافة منتج جديد' : 'Add New Product'}</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-zinc-950 p-4 border border-zinc-800">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRTL ? 'بحث باسم المنتج أو الكود...' : 'Search by product name or code...'}
            className="w-full bg-zinc-900 border border-zinc-700 pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white transition-colors"
          />
        </div>

        {/* Category Select */}
        <div className="sm:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors"
          >
            <option value="all">{isRTL ? 'جميع الأقسام' : 'All Categories'}</option>
            <option value="men">{isRTL ? 'رجالي (Men)' : 'Men'}</option>
            <option value="kids">{isRTL ? 'أطفال (Kids)' : 'Kids'}</option>
            <option value="accessories">{isRTL ? 'إكسسوارات وساعات' : 'Accessories'}</option>
            <option value="offers">{isRTL ? 'العروض والتخفيضات' : 'Special Offers'}</option>
          </select>
        </div>

        {/* Stock Filter */}
        <div className="sm:col-span-3">
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors"
          >
            <option value="all">{isRTL ? 'حالة المخزون (الكل)' : 'All Stock Status'}</option>
            <option value="in-stock">{isRTL ? 'المتوفر فقط' : 'In Stock Only'}</option>
            <option value="out-of-stock">{isRTL ? 'القطع المنتهية' : 'Out of Stock'}</option>
          </select>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-red-900/80 p-6 max-w-sm w-full shadow-2xl text-center space-y-4 animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-red-950 text-red-400 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              {isRTL ? 'تأكيد حذف المنتج' : 'Delete Product Confirmation'}
            </h3>
            <p className="text-xs text-zinc-400">
              {isRTL
                ? 'هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً من المتجر؟'
                : 'Are you sure you want to permanently delete this product from your catalog?'}
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-colors"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
              >
                {isRTL ? 'نعم، احذف' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table (Desktop) & Cards (Mobile) */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-zinc-950 border border-zinc-800 p-8">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
          <h3 className="text-base font-bold text-white">{isRTL ? 'لم يتم العثور على أي منتجات' : 'No products found'}</h3>
          <p className="text-xs text-zinc-400 mt-1">
            {isRTL ? 'جرب تغيير شروط البحث أو الفلترة.' : 'Try adjusting your search or filters.'}
          </p>
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  <th className="py-3.5 px-4">{isRTL ? 'المنتج' : 'Product'}</th>
                  <th className="py-3.5 px-4">{isRTL ? 'القسم' : 'Category'}</th>
                  <th className="py-3.5 px-4">{isRTL ? 'السعر' : 'Price'}</th>
                  <th className="py-3.5 px-4">{isRTL ? 'المخزون' : 'Stock'}</th>
                  <th className="py-3.5 px-4 text-center">{isRTL ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-xs">
                {filteredProducts.map((p) => {
                  const isOffer = p.originalPrice && p.originalPrice > p.price;
                  return (
                    <tr key={p.id} className="hover:bg-zinc-900/40 transition-colors">
                      {/* Product Thumbnail & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0] || 'https://placehold.co/100x120?text=No+Image'}
                            alt={p.name}
                            className="w-12 h-14 object-cover bg-zinc-900 shrink-0 border border-zinc-800"
                          />
                          <div className="min-w-0 max-w-xs">
                            <div className="font-bold text-white truncate">{p.name}</div>
                            <div className="text-[11px] text-zinc-400 truncate">{p.subtitle}</div>
                            <div className="text-[10px] text-zinc-600 font-mono mt-0.5">{p.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="font-mono text-zinc-300 uppercase text-[11px] px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded">
                          {p.category}
                        </span>
                        {p.subCategory && (
                          <div className="text-[11px] text-zinc-500 mt-1">{p.subCategory}</div>
                        )}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-mono">
                        <div className="font-bold text-white text-sm">{formatPrice(p.price)}</div>
                        {isOffer && (
                          <div className="text-[11px] text-zinc-500 line-through">
                            {formatPrice(p.originalPrice!)}
                          </div>
                        )}
                        {isOffer && (
                          <span className="text-[9px] font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded inline-block mt-0.5">
                            {Math.round(((p.originalPrice! - p.price) / p.originalPrice!) * 100)}% OFF
                          </span>
                        )}
                      </td>

                      {/* Stock Status Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStock(p)}
                          className={`px-2.5 py-1 text-[11px] font-mono rounded flex items-center gap-1.5 transition-colors ${
                            p.inStock
                              ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-400 hover:bg-emerald-900/60'
                              : 'bg-red-950/60 border border-red-800 text-red-400 hover:bg-red-900/60'
                          }`}
                        >
                          {p.inStock ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>{p.inStock ? (isRTL ? 'متوفر' : 'In Stock') : (isRTL ? 'غير متوفر' : 'Out of Stock')}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/admin/products/edit/${p.id}`}
                            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                            title={isRTL ? 'تعديل' : 'Edit'}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/product/${p.id}`}
                            target="_blank"
                            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                            title={isRTL ? 'معاينة في المتجر' : 'Preview'}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors"
                            title={isRTL ? 'حذف' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
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
      )}
    </div>
  );
};
