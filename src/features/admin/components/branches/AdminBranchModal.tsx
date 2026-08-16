import React from 'react';
import { StoreLocation } from '@/types';
import { useLanguage } from '@/shared';

interface AdminBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  formStore: Omit<StoreLocation, 'id'>;
  setFormStore: React.Dispatch<React.SetStateAction<Omit<StoreLocation, 'id'>>>;
  onSave: (e: React.FormEvent) => void;
}

export const AdminBranchModal: React.FC<AdminBranchModalProps> = ({
  isOpen,
  onClose,
  isEditing,
  formStore,
  setFormStore,
  onSave
}) => {
  const { isRTL } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-sm text-white pb-3 border-b border-zinc-800">
          {isEditing ? (isRTL ? 'تعديل بيانات الفرع' : 'Edit Branch') : (isRTL ? 'إضافة فرع جديد' : 'Add New Branch')}
        </h3>

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-300 font-bold mb-1">
              {isRTL ? 'اسم الفرع *' : 'Branch Name *'}
            </label>
            <input
              type="text"
              required
              value={formStore.name}
              onChange={(e) => setFormStore({ ...formStore, name: e.target.value })}
              placeholder="e.g. Eiffel Flagship — Zefta"
              className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-300 font-bold mb-1">
                {isRTL ? 'المحافظة / المدينة' : 'City / Governorate'}
              </label>
              <input
                type="text"
                value={formStore.city}
                onChange={(e) => setFormStore({ ...formStore, city: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-300 font-bold mb-1">
                {isRTL ? 'نوع الفرع' : 'Type'}
              </label>
              <select
                value={formStore.type}
                onChange={(e) => setFormStore({ ...formStore, type: e.target.value as any })}
                className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
              >
                <option value="Flagship">Flagship (رئيسي)</option>
                <option value="Boutique">Boutique (فرع)</option>
                <option value="Studio">Studio (استوديو)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-300 font-bold mb-1">
              {isRTL ? 'العنوان بالتفصيل *' : 'Detailed Address *'}
            </label>
            <input
              type="text"
              required
              value={formStore.address}
              onChange={(e) => setFormStore({ ...formStore, address: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-300 font-bold mb-1">
              {isRTL ? 'مواعيد العمل *' : 'Working Hours *'}
            </label>
            <input
              type="text"
              required
              value={formStore.hours}
              onChange={(e) => setFormStore({ ...formStore, hours: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-300 font-bold mb-1">
                {isRTL ? 'رقم الهاتف' : 'Phone Number'}
              </label>
              <input
                type="text"
                value={formStore.phone}
                onChange={(e) => setFormStore({ ...formStore, phone: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-300 font-bold mb-1">
                {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <input
                type="email"
                value={formStore.email}
                onChange={(e) => setFormStore({ ...formStore, email: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-300 font-bold mb-1">
              {isRTL ? 'رابط صورة واجهة الفرع' : 'Branch Storefront Image URL'}
            </label>
            <input
              type="url"
              value={formStore.image}
              onChange={(e) => setFormStore({ ...formStore, image: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
            />
          </div>

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
              {isEditing ? (isRTL ? 'حفظ التعديل' : 'Save Changes') : (isRTL ? 'إضافة الفرع' : 'Add Branch')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
