import React from 'react';
import { CategoryItem } from '@/types';
import { useLanguage, ImageUploadInput } from '@/shared';

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
      <div className="bg-zinc-950 border border-zinc-800 max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto rounded-lg">
        <h3 className="font-bold text-sm text-white pb-3 border-b border-zinc-800 font-editorial">
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
              className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white rounded focus:outline-none focus:border-amber-400"
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
              className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white rounded focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Cover Image Upload (Device file upload + Direct URL) */}
          <ImageUploadInput
            label={isRTL ? 'صورة الغلاف للقسم (Cover Banner)' : 'Category Cover Banner'}
            value={formCategory.image}
            onChange={(url) => setFormCategory({ ...formCategory, image: url })}
            aspectRatio="16/9"
            required={true}
            helpText={isRTL ? 'يمكنك رفع صورة من جهازك أو وضع رابط صورة خارجي' : 'Upload from your device or paste a direct image URL'}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700 rounded transition-colors cursor-pointer"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded transition-colors cursor-pointer"
            >
              {isEditing ? (isRTL ? 'حفظ التعديل' : 'Save Changes') : (isRTL ? 'إضافة القسم' : 'Add Category')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
