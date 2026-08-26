import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useStoreData, useLanguage, AdminCardGridSkeleton, EmptyState } from '@/shared';
import { CategoryItem } from '@/types';
import { AdminCategoryCard } from '../components/categories/AdminCategoryCard';
import { AdminCategoryModal } from '../components/categories/AdminCategoryModal';

export const AdminCategoriesPage: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, products, isCategoriesLoading } = useStoreData();
  const { t } = useLanguage();

  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formCategory, setFormCategory] = useState<Omit<CategoryItem, 'id'>>({
    name: '',
    nameEn: '',
    subtitle: '',
    image: '',
    itemCount: '',
    subCategories: []
  });

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormCategory({
      name: cat.name || '',
      nameEn: cat.nameEn || cat.name || '',
      subtitle: cat.subtitle || '',
      image: cat.image || '',
      itemCount: cat.itemCount || '',
      subCategories: cat.subCategories || []
    });
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCategory.name.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, formCategory);
    } else {
      addCategory(formCategory);
    }

    setShowAddModal(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-wide">
            {t.adminCategoriesTitle}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {t.adminCategoryConfigDesc}
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCategory(null);
            setFormCategory({
              name: '',
              nameEn: '',
              subtitle: '',
              image: '',
              itemCount: '',
              subCategories: []
            });
            setShowAddModal(true);
          }}
          className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 transition-colors font-label-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.adminAddCategory}</span>
        </button>
      </div>

      {/* Loading / Empty / Content */}
      {isCategoriesLoading && categories.length === 0 ? (
        <AdminCardGridSkeleton count={4} cols={4} />
      ) : categories.length === 0 ? (
        <EmptyState
          title={t.adminCategoriesTitle}
          description={t.adminCategoryConfigDesc}
          actionText={t.adminAddCategory}
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        /* Category Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const productCount = products.filter(p =>
              cat.id === 'offers' ? (p.originalPrice && p.originalPrice > p.price) : p.category === cat.id
            ).length;

            return (
              <AdminCategoryCard
                key={cat.id}
                category={cat}
                productCount={productCount}
                onEdit={handleOpenEdit}
                onDelete={deleteCategory}
              />
            );
          })}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      <AdminCategoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        isEditing={Boolean(editingCategory)}
        formCategory={formCategory}
        setFormCategory={setFormCategory}
        onSave={handleSave}
      />
    </div>
  );
};
