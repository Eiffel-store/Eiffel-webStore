import { useState } from 'react';
import { CategoryItem } from '@/types';
import { STATIC_CATEGORIES } from './defaults';
import toast from 'react-hot-toast';

export const useCategoriesData = () => {
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('eiffel_categories');
      return saved ? JSON.parse(saved) : STATIC_CATEGORIES;
    } catch {
      return STATIC_CATEGORIES;
    }
  });

  const addCategory = (catData: Omit<CategoryItem, 'id'>) => {
    const id = catData.nameEn ? catData.nameEn.toLowerCase().replace(/\s+/g, '-') : `cat-${Date.now()}`;
    const newCat: CategoryItem = { ...catData, id };
    setCategories((prev) => {
      const updated = [...prev, newCat];
      localStorage.setItem('eiffel_categories', JSON.stringify(updated));
      return updated;
    });
    toast.success('تمت إضافة القسم بنجاح');
  };

  const updateCategory = (id: string, updates: Partial<CategoryItem>) => {
    setCategories((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      localStorage.setItem('eiffel_categories', JSON.stringify(updated));
      return updated;
    });
    toast.success('تم تحديث القسم بنجاح');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      localStorage.setItem('eiffel_categories', JSON.stringify(updated));
      return updated;
    });
    toast.success('تم حذف القسم بنجاح');
  };

  return {
    categories,
    isCategoriesLoading: false,
    addCategory,
    updateCategory,
    deleteCategory
  };
};
