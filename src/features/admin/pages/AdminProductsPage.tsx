import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useStoreData, useLanguage, AdminTableSkeleton, EmptyState, Pagination } from '@/shared';
import { Product } from '@/types';
import { AdminProductFilterBar } from '../components/products/AdminProductFilterBar';
import { AdminProductTable } from '../components/products/AdminProductTable';
import { AdminProductDeleteModal } from '../components/products/AdminProductDeleteModal';

export const AdminProductsPage: React.FC = () => {
  const { products, categories, deleteProduct, updateProduct, isProductsLoading } = useStoreData();
  const { t } = useLanguage();

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
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchStock =
        stockFilter === 'all' ||
        (stockFilter === 'inStock' && p.inStock) ||
        (stockFilter === 'outOfStock' && !p.inStock);
      return matchSearch && matchCategory && matchStock;
    });
  }, [products, searchQuery, selectedCategory, stockFilter]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, stockFilter]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setDeleteConfirmId(null);
  };

  const handleToggleStock = async (product: Product) => {
    await updateProduct(product.id, { inStock: !product.inStock });
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-wide">
            {t.adminProducts}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {products.length} {t.adminTotalProducts}
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 transition-colors font-label-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.adminAddNewProduct}</span>
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
        categories={categories}
      />

      {/* Loading / Empty / Table */}
      {isProductsLoading && products.length === 0 ? (
        <AdminTableSkeleton rows={6} />
      ) : products.length === 0 ? (
        <EmptyState
          title={t.adminProductsCatalogTitle}
          description={t.noPiecesFoundDesc}
          actionText={t.adminAddNewProduct}
          actionLink="/admin/products/new"
        />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title={t.noMatchingPieces}
          description={t.noPiecesFoundDesc}
          actionText={t.resetFilters}
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
