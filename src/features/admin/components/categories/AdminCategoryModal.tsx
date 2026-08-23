import React, { useState } from 'react';
import { Layers, X, Plus } from 'lucide-react';
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
  const [newSubCat, setNewSubCat] = useState('');

  if (!isOpen) return null;

  const handleAddSubCat = () => {
    const trimmed = newSubCat.trim();
    if (!trimmed) return;
    const existing = formCategory.subCategories || [];
    if (existing.includes(trimmed)) return;
    setFormCategory({ ...formCategory, subCategories: [...existing, trimmed] });
    setNewSubCat('');
  };

  const handleRemoveSubCat = (idx: number) => {
    const updated = (formCategory.subCategories || []).filter((_, i) => i !== idx);
    setFormCategory({ ...formCategory, subCategories: updated });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSubCat();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800/90 max-w-lg w-full p-6 sm:p-7 space-y-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto rounded-2xl">

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-wide">
                {isEditing ? (isRTL ? 'تعديل بيانات القسم' : 'Edit Category') : (isRTL ? 'إضافة قسم جديد للكتالوج' : 'Add New Catalog Category')}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {isRTL ? 'إعداد اسم القسم وصورة الغلاف في المتجر.' : 'Configure category name and cover banner.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">

          {/* Name AR + EN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-200 font-bold mb-1.5">
                {isRTL ? 'اسم القسم (عربي) *' : 'Category Name (AR) *'}
              </label>
              <input
                type="text"
                required
                value={formCategory.name}
                onChange={(e) => setFormCategory({ ...formCategory, name: e.target.value })}
                placeholder={isRTL ? 'مثال: أزياء الرجال' : 'e.g. أزياء الرجال'}
                className="w-full bg-zinc-900/90 border border-zinc-700/80 px-3.5 py-2.5 text-xs text-white rounded-xl focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-200 font-bold mb-1.5">
                {isRTL ? 'اسم القسم (إنجليزي)' : 'Category Name (EN)'}
              </label>
              <input
                type="text"
                value={formCategory.nameEn || ''}
                onChange={(e) => setFormCategory({ ...formCategory, nameEn: e.target.value })}
                placeholder="e.g. MEN COLLECTION"
                className="w-full bg-zinc-900/90 border border-zinc-700/80 px-3.5 py-2.5 text-xs text-white rounded-xl focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs text-zinc-200 font-bold mb-1.5">
              {isRTL ? 'الوصف الفرعي / السلوجان' : 'Category Subtitle / Slogan'}
            </label>
            <input
              type="text"
              value={formCategory.subtitle}
              onChange={(e) => setFormCategory({ ...formCategory, subtitle: e.target.value })}
              placeholder={isRTL ? 'مثال: قصات معمارية انسيابية وخامات قطن فاخرة' : 'e.g. Brutalist silhouettes & precision tailoring'}
              className="w-full bg-zinc-900/90 border border-zinc-700/80 px-3.5 py-2.5 text-xs text-white rounded-xl focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Sub-Categories */}
          <div>
            <label className="block text-xs text-zinc-200 font-bold mb-2">
              {isRTL ? 'الأقسام الفرعية (Sub-Categories)' : 'Sub-Categories'}
            </label>

            {/* Tags */}
            {(formCategory.subCategories || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {(formCategory.subCategories || []).map((sub, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 text-white text-[11px] px-2.5 py-1 rounded-lg"
                  >
                    {sub}
                    <button
                      type="button"
                      onClick={() => handleRemoveSubCat(idx)}
                      className="text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input + Add Button */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubCat}
                onChange={(e) => setNewSubCat(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isRTL ? 'مثال: كعب عالي... ثم اضغط Enter' : 'e.g. Sneakers... then press Enter'}
                className="flex-1 bg-zinc-900/90 border border-zinc-700/80 px-3.5 py-2.5 text-xs text-white rounded-xl focus:outline-none focus:border-amber-400 transition-colors"
              />
              <button
                type="button"
                onClick={handleAddSubCat}
                className="px-3 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 mt-1.5">
              {isRTL ? 'اضغط Enter أو + لإضافة قسم فرعي، واضغط X لحذفه.' : 'Press Enter or + to add, X to remove a sub-category.'}
            </p>
          </div>

          {/* Cover Image */}
          <ImageUploadInput
            label={isRTL ? 'صورة الغلاف للقسم (Cover Banner)' : 'Category Cover Banner'}
            value={formCategory.image}
            onChange={(url) => setFormCategory({ ...formCategory, image: url })}
            aspectRatio="16/9"
            required={true}
            helpText={isRTL ? 'اختر صورة عالية الجودة تُظهر طابع القسم في الصفحة الرئيسية.' : 'Select a high resolution banner for the storefront.'}
          />

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-700/80 rounded-xl transition-colors cursor-pointer"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              {isEditing ? (isRTL ? 'حفظ التعديل' : 'Save Changes') : (isRTL ? 'إضافة القسم' : 'Add Category')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
