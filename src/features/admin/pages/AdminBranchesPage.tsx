import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Clock,
  ExternalLink,
  Check
} from 'lucide-react';
import { useStoreData } from '@/shared';
import { useLanguage } from '@/shared';
import { StoreLocation } from '@/types';

export const AdminBranchesPage: React.FC = () => {
  const { stores, addStore, updateStore, deleteStore } = useStoreData();
  const { isRTL } = useLanguage();

  const [editingStore, setEditingStore] = useState<StoreLocation | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [formStore, setFormStore] = useState<Omit<StoreLocation, 'id'>>({
    city: 'Gharbia (الغربية)',
    name: 'Eiffel Flagship — Zefta',
    address: 'زفتى، المحطة أمام قاعة هوليوود، محافظة الغربية، مصر',
    hours: 'Daily: 11:00 AM – 12:00 AM (يومياً: 11 صباحاً – 12 منتصف الليل)',
    phone: '+20 100 932 6801',
    email: 'contact@eiffel-store.com',
    type: 'Flagship',
    coordinates: { x: 50, y: 50 },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCseUeu5hdr7LWtZska9tdU1nipaGbIV9oDB4qQIfpmf9TGBKI3WMIeHE7Dhi3cpBD1BLkDSNssElp43QgvSsbNFoyCtrgDtaWeFakgnquiUwsZGJutEtBBG2VrOwNvDhRXK2l4kEiDc6woEqKHLmR-wjLYVi085GjBUjBr9WGc_WUmlNMKBme8o3SAnoAIsLDlCOY_WmzxZ_2Siru3KoWJD9zwJNdMDng5OdcgPqc2VO_kGELw2iBIhg'
  });

  const handleOpenEdit = (store: StoreLocation) => {
    setEditingStore(store);
    setFormStore({
      city: store.city,
      name: store.name,
      address: store.address,
      hours: store.hours,
      phone: store.phone,
      email: store.email,
      type: store.type,
      coordinates: store.coordinates || { x: 50, y: 50 },
      image: store.image
    });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStore.name.trim() || !formStore.address.trim()) return;

    if (editingStore) {
      updateStore(editingStore.id, formStore);
    } else {
      addStore(formStore);
    }

    setShowModal(false);
    setEditingStore(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-wide">
            {isRTL ? 'إدارة فروع المتجر' : 'Store Branches Management'}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {isRTL
              ? 'التحكم في بيانات وعناوين ومواعيد عمل فروع إيفل (زفتى / نهطاي) وإضافة فروع جديدة.'
              : 'Manage addresses, hours, and contacts for Eiffel boutiques (Zefta & Nahtay).'}
          </p>
        </div>

        <button
          onClick={() => {
            setEditingStore(null);
            setFormStore({
              city: 'Gharbia',
              name: 'Eiffel Branch',
              address: 'محافظة الغربية، مصر',
              hours: 'Daily: 11:00 AM – 12:00 AM',
              phone: '+20 100 932 6801',
              email: 'contact@eiffel-store.com',
              type: 'Boutique',
              coordinates: { x: 50, y: 50 },
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCseUeu5hdr7LWtZska9tdU1nipaGbIV9oDB4qQIfpmf9TGBKI3WMIeHE7Dhi3cpBD1BLkDSNssElp43QgvSsbNFoyCtrgDtaWeFakgnquiUwsZGJutEtBBG2VrOwNvDhRXK2l4kEiDc6woEqKHLmR-wjLYVi085GjBUjBr9WGc_WUmlNMKBme8o3SAnoAIsLDlCOY_WmzxZ_2Siru3KoWJD9zwJNdMDng5OdcgPqc2VO_kGELw2iBIhg'
            });
            setShowModal(true);
          }}
          className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 transition-colors font-label-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isRTL ? 'إضافة فرع جديد' : 'Add New Branch'}</span>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 p-6 max-w-lg w-full shadow-2xl space-y-4 animate-scale-up">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{editingStore ? (isRTL ? 'تعديل بيانات الفرع' : 'Edit Branch') : (isRTL ? 'إضافة فرع جديد' : 'Add Branch')}</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-300 font-bold mb-1">
                    {isRTL ? 'اسم الفرع' : 'Branch Name'} *
                  </label>
                  <input
                    type="text"
                    value={formStore.name}
                    onChange={(e) => setFormStore({ ...formStore, name: e.target.value })}
                    required
                    placeholder="مثال: Eiffel Flagship — Zefta"
                    className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 font-bold mb-1">
                    {isRTL ? 'المدينة / المنطقة' : 'City / Region'} *
                  </label>
                  <input
                    type="text"
                    value={formStore.city}
                    onChange={(e) => setFormStore({ ...formStore, city: e.target.value })}
                    required
                    placeholder="مثال: زفتى (الغربية)"
                    className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-300 font-bold mb-1">
                  {isRTL ? 'العنوان التفصيلي' : 'Full Address'} *
                </label>
                <input
                  type="text"
                  value={formStore.address}
                  onChange={(e) => setFormStore({ ...formStore, address: e.target.value })}
                  required
                  placeholder="مثال: زفتى، المحطة أمام قاعة هوليوود، محافظة الغربية"
                  className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-300 font-bold mb-1">
                    {isRTL ? 'مواعيد العمل' : 'Working Hours'}
                  </label>
                  <input
                    type="text"
                    value={formStore.hours}
                    onChange={(e) => setFormStore({ ...formStore, hours: e.target.value })}
                    placeholder="يومياً: 11 صباحاً – 12 منتصف الليل"
                    className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 font-bold mb-1">
                    {isRTL ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'}
                  </label>
                  <input
                    type="text"
                    value={formStore.phone}
                    onChange={(e) => setFormStore({ ...formStore, phone: e.target.value })}
                    placeholder="+20 100 932 6801"
                    className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-300 font-bold mb-1">
                    {isRTL ? 'نوع الفرع' : 'Branch Type'}
                  </label>
                  <select
                    value={formStore.type}
                    onChange={(e) => setFormStore({ ...formStore, type: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  >
                    <option value="Flagship">Flagship (الفرع الرئيسي)</option>
                    <option value="Boutique">Boutique (بوتيك)</option>
                    <option value="Atelier">Atelier (أتيليه)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 font-bold mb-1">
                    {isRTL ? 'رابط صورة الفرع' : 'Branch Image URL'}
                  </label>
                  <input
                    type="text"
                    value={formStore.image}
                    onChange={(e) => setFormStore({ ...formStore, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-colors"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-colors"
                >
                  {isRTL ? 'حفظ الفرع' : 'Save Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Branches List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stores.map((store) => (
          <div key={store.id} className="bg-zinc-950 border border-zinc-800 p-6 shadow-xl space-y-4 relative group">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase bg-white text-black px-2 py-0.5 font-bold tracking-wider">
                  {store.type}
                </span>
                <h3 className="text-lg font-bold text-white mt-2">{store.name}</h3>
                <div className="text-xs text-zinc-400 font-mono">{store.city}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(store)}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors"
                  title={isRTL ? 'تعديل' : 'Edit'}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {stores.length > 1 && (
                  <button
                    onClick={() => deleteStore(store.id)}
                    className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-950/20 rounded transition-colors"
                    title={isRTL ? 'حذف' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-800/80 text-xs">
              <div className="flex items-start gap-2 text-zinc-300">
                <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <span>{store.address}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Clock className="w-4 h-4 text-zinc-500 shrink-0" />
                <span>{store.hours}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Phone className="w-4 h-4 text-zinc-500 shrink-0" />
                <span className="font-mono">{store.phone}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
              <a
                href={`${import.meta.env.BASE_URL}#/stores`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white flex items-center gap-1 font-mono"
              >
                <span>{isRTL ? 'عرض في صفحة الفروع' : 'View on /stores'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
