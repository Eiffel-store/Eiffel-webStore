import React from 'react';
import { CategoryItem } from '@/types';
import { useLanguage } from '@/shared';

interface AdminCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  formCategory: Omit<CategoryItem, 'id'>;
  setFormCategory: React.Dispatch<React.SetStateAction<Omit<CategoryItem, 'id'>>>;
  onSave: (e: React.FormEvent) => void;
}

export const AdminCategoryModal: React.FC<AdminCategoryModalProps> = ({
  isOpen,
  onClose,
  isEditing,
  formCategory,
  setFormCategory,
  onSave
}) => {
  const { isRTL } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-sm text-white pb-3 border-b border-zinc-800">
          {isEditing ? (isRTL ? 'تعديل بيانات القسم' : 'Edit Category') : (isRTL ? 'إضافة قسم جديد' : 'Add New Category')}
        </h3>

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-300 font-bold mb-1">
              {isRTL ? 'اسم القسم *' : 'Category Name *'}
            </label>
            <input
              type="text"
              required
              value={formCategory.name}
              onChange={(e) => setFormCategory({ ...formCategory, name: e.target.value })}
              placeholder="e.g. MEN COLLECTION, SUITS"
              className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-300 font-bold mb-1">
              {isRTL ? 'الوصف الفرعي للقسم' : 'Category Subtitle'}
            </label>
            <input
              type="text"
              value={formCategory.subtitle}
              onChange={(e) => setFormCategory({ ...formCategory, subtitle: e.target.value })}
              placeholder="e.g. Brutalist Silhouettes & Precision Engineering"
              className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-300 font-bold mb-1">
              {isRTL ? 'رابط صورة الغلاف (Banner Image URL) *' : 'Cover Image URL *'}
            </label>
            <input
              type="url"
              required
              value={formCategory.image}
              onChange={(e) => setFormCategory({ ...formCategory, image: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
            />
          </div>

          {formCategory.image && (
            <div className="aspect-[16/9] bg-zinc-900 border border-zinc-800 overflow-hidden">
              <img
                src={formCategory.image}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-white text-black hover:bg-zinc-200 text-xs font-bold transition-colors"
            >
              {isEditing ? (isRTL ? 'حفظ التعديل' : 'Save Changes') : (isRTL ? 'إضافة القسم' : 'Add Category')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
