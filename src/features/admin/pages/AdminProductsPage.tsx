import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useStoreData, useLanguage, EiffelLoader, EmptyState, Pagination } from '@/shared';
import { Product } from '@/types';
import { AdminProductFilterBar } from '../components/products/AdminProductFilterBar';
import { AdminProductTable } from '../components/products/AdminProductTable';
import { AdminProductDeleteModal } from '../components/products/AdminProductDeleteModal';

export const AdminProductsPage: React.FC = () => {
  const { products, deleteProduct, updateProduct, isProductsLoading } = useStoreData();
  const { isRTL } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
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
  }, [products, searchQuery, selectedCategory, stockFilter]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, stockFilter]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

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
      <AdminProductFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        stockFilter={stockFilter}
        onStockChange={setStockFilter}
      />

      {/* Loading / Empty / Table */}
      {isProductsLoading ? (
        <EiffelLoader message={isRTL ? 'جاري جلب كتالوج المنتجات من قاعدة البيانات...' : 'Fetching product catalog from database...'} />
      ) : products.length === 0 ? (
        <EmptyState
          title={isRTL ? 'كتالوج المنتجات فارغ حالياً' : 'Product Catalog is Empty'}
          description={isRTL ? 'لم يتم العثور على أي منتجات في قاعدة البيانات. اضغط أدناه لإضافة أول قطعة في المتجر.' : 'No products found in the database. Add your first item below.'}
          actionText={isRTL ? '+ إضافة أول منتج' : '+ Add First Product'}
          actionLink="/admin/products/new"
        />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title={isRTL ? 'لا توجد نتائج مطابقة للبحث أو التصفية' : 'No matching products found'}
          description={isRTL ? 'يرجى تجربة كلمات بحث أخرى أو إعادة ضبط عوامل التصفية.' : 'Try changing your search query or active filters.'}
          actionText={isRTL ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('all');
            setStockFilter('all');
          }}
        />
      ) : (
        /* Products Table & Pagination */
        <div className="space-y-4">
          <AdminProductTable
            products={paginatedProducts}
            onToggleStock={handleToggleStock}
            onDeletePrompt={setDeleteConfirmId}
          />

          {filteredProducts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredProducts.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(s) => {
                setPageSize(s);
                setCurrentPage(1);
              }}
              pageSizeOptions={[5, 10, 20, 50]}
            />
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminProductDeleteModal
        productId={deleteConfirmId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
