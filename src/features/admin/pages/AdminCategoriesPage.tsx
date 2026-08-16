import React, { useState } from 'react';
import {
  Grid,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Check,
  Upload,
  ExternalLink
} from 'lucide-react';
import { useStoreData } from '@/shared';
import { useLanguage } from '@/shared';
import { CategoryItem } from '@/types';

export const AdminCategoriesPage: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useStoreData();
  const { isRTL } = useLanguage();

  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formCategory, setFormCategory] = useState<Omit<CategoryItem, 'id'>>({
    name: '',
    nameEn: '',
    subtitle: '',
    image: '',
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
    setFormCategory({
      name: '',
      nameEn: '',
      subtitle: '',
      image: '',
      itemCount: '10 PIECES',
      subCategories: []
    });
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
          className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 transition-colors font-label-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isRTL ? 'إضافة قسم جديد' : 'Add Category'}</span>
        </button>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 p-6 max-w-lg w-full shadow-2xl space-y-4 animate-scale-up">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Grid className="w-4 h-4 text-purple-400" />
              <span>{editingCategory ? (isRTL ? 'تعديل القسم' : 'Edit Category') : (isRTL ? 'إضافة قسم جديد' : 'Add Category')}</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-300 font-bold mb-1">
                    {isRTL ? 'اسم القسم (عربي)' : 'Name (Arabic)'} *
                  </label>
                  <input
                    type="text"
                    value={formCategory.name}
                    onChange={(e) => setFormCategory({ ...formCategory, name: e.target.value })}
                    required
                    placeholder="مثال: أزياء الرجال"
                    className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 font-bold mb-1">
                    {isRTL ? 'الاسم بالإنجليزية (Slug)' : 'Name (English)'} *
                  </label>
                  <input
                    type="text"
                    value={formCategory.nameEn}
                    onChange={(e) => setFormCategory({ ...formCategory, nameEn: e.target.value })}
                    required
                    placeholder="e.g. Menswear"
                    className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-300 font-bold mb-1">
                  {isRTL ? 'العنوان الفرعي للقسم' : 'Subtitle'}
                </label>
                <input
                  type="text"
                  value={formCategory.subtitle}
                  onChange={(e) => setFormCategory({ ...formCategory, subtitle: e.target.value })}
                  placeholder="e.g. Precision Monochromatic Tailoring"
                  className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 font-bold mb-1">
                  {isRTL ? 'رابط صورة الغلاف' : 'Cover Image URL'} *
                </label>
                <input
                  type="text"
                  value={formCategory.image}
                  onChange={(e) => setFormCategory({ ...formCategory, image: e.target.value })}
                  required
                  placeholder="https://... or image URL"
                  className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                />
                {formCategory.image && (
                  <div className="mt-2 aspect-[16/9] w-full max-h-36 bg-zinc-900 border border-zinc-800 overflow-hidden">
                    <img src={formCategory.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-colors"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-colors"
                >
                  {isRTL ? 'حفظ القسم' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const categoryProductsCount = products.filter(p => p.category === cat.id).length;
          return (
            <div key={cat.id} className="bg-zinc-950 border border-zinc-800 overflow-hidden shadow-xl group">
              <div className="relative aspect-[16/9] bg-zinc-900 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 text-white">
                  <div className="text-lg font-bold font-editorial">{cat.name}</div>
                  <div className="text-xs text-zinc-300 font-light">{cat.subtitle}</div>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="text-xs font-mono text-zinc-400">
                  {categoryProductsCount > 0 ? `${categoryProductsCount} ${isRTL ? 'منتج متاح' : 'products'}` : cat.itemCount}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded"
                    title={isRTL ? 'تعديل' : 'Edit'}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <a
                    href={`${import.meta.env.BASE_URL}#/collections/${cat.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded"
                    title={isRTL ? 'معاينة في المتجر' : 'Preview'}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {categories.length > 2 && (
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-950/20 rounded"
                      title={isRTL ? 'حذف' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
