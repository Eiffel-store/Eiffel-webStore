import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useStoreData, useLanguage, EiffelLoader, EmptyState } from '@/shared';
import { CategoryItem } from '@/types';
import { AdminCategoryCard } from '../components/categories/AdminCategoryCard';
import { AdminCategoryModal } from '../components/categories/AdminCategoryModal';

export const AdminCategoriesPage: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, products, isLoading } = useStoreData();
  const { isRTL } = useLanguage();

  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formCategory, setFormCategory] = useState<Omit<CategoryItem, 'id'>>({
    name: '',
    nameEn: '',
    subtitle: '',
    image: `${import.meta.env.BASE_URL}images/products/eiffel-cardigan-trio.jpg`,
    itemCount: '12 PIECES',
    subCategories: ['T-Shirts', 'Polos', 'Hoodies']
  });

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormCategory({
      name: cat.name,
      nameEn: cat.nameEn || cat.name,
      subtitle: cat.subtitle || '',
      image: cat.image,
      itemCount: cat.itemCount,
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
            {isRTL ? 'إدارة الأقسام والتصنيفات' : 'Categories Management'}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {isRTL
              ? 'التحكم في الأقسام الرئيسية لمتجر إيفل وتغيير صور أغلفة الأقسام.'
              : 'Manage main store collections and update category cover banners.'}
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCategory(null);
            setFormCategory({
              name: '',
              nameEn: '',
              subtitle: '',
              image: `${import.meta.env.BASE_URL}images/products/eiffel-cardigan-trio.jpg`,
              itemCount: '10 PIECES',
              subCategories: []
            });
            setShowAddModal(true);
          }}
          className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 transition-colors font-label-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isRTL ? 'إضافة قسم جديد' : 'Add Category'}</span>
        </button>
      </div>

      {/* Loading / Empty / Content */}
      {isLoading ? (
        <EiffelLoader message={isRTL ? 'جاري جلب الأقسام من قاعدة البيانات...' : 'Fetching categories...'} />
      ) : categories.length === 0 ? (
        <EmptyState
          title={isRTL ? 'لا توجد أقسام مسجلة حتى الآن' : 'No Categories Found'}
          description={isRTL ? 'يمكنك إضافة أقسام جديدة مثل (الرجال، الأطفال، الإكسسوارات) لتنظيم كتالوج المتجر.' : 'Create categories to organize your product catalog.'}
          actionText={isRTL ? '+ إضافة أول قسم' : '+ Add First Category'}
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
