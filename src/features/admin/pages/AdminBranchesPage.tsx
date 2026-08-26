import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useStoreData, useLanguage, AdminCardGridSkeleton, EmptyState } from '@/shared';
import { StoreLocation } from '@/types';
import { AdminBranchCard } from '../components/branches/AdminBranchCard';
import { AdminBranchModal } from '../components/branches/AdminBranchModal';

export const AdminBranchesPage: React.FC = () => {
  const { stores, addStore, updateStore, deleteStore, isStoresLoading } = useStoreData();
  const { t } = useLanguage();

  const [editingStore, setEditingStore] = useState<StoreLocation | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [formStore, setFormStore] = useState<Omit<StoreLocation, 'id'>>({
    city: '',
    cityEn: '',
    name: '',
    nameEn: '',
    address: '',
    addressEn: '',
    hours: '',
    hoursEn: '',
    phone: '',
    email: '',
    type: 'Boutique',
    coordinates: { x: 50, y: 50 },
    latitude: undefined,
    longitude: undefined,
    image: '',
    mapLink: '',
    active: true
  });

  const handleOpenEdit = (store: StoreLocation) => {
    setEditingStore(store);
    setFormStore({
      city: store.city || '',
      cityEn: store.cityEn || '',
      name: store.name || '',
      nameEn: store.nameEn || '',
      address: store.address || '',
      addressEn: store.addressEn || '',
      hours: store.hours || '',
      hoursEn: store.hoursEn || '',
      phone: store.phone || '',
      email: store.email || '',
      type: store.type || 'Boutique',
      coordinates: store.coordinates || { x: 50, y: 50 },
      latitude: store.latitude,
      longitude: store.longitude,
      image: store.image || '',
      mapLink: store.mapLink || '',
      active: store.active !== false
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
            {t.adminBranches}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {t.adminStorefront}
          </p>
        </div>

        <button
          onClick={() => {
            setEditingStore(null);
            setFormStore({
              city: '',
              cityEn: '',
              name: '',
              nameEn: '',
              address: '',
              addressEn: '',
              hours: '',
              hoursEn: '',
              phone: '',
              email: '',
              type: 'Boutique',
              coordinates: { x: 50, y: 50 },
              latitude: undefined,
              longitude: undefined,
              image: '',
              mapLink: '',
              active: true
            });
            setShowModal(true);
          }}
          className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 transition-colors font-label-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.adminAddBranch}</span>
        </button>
      </div>

      {/* Loading / Empty / Content */}
      {isStoresLoading && stores.length === 0 ? (
        <AdminCardGridSkeleton count={4} cols={2} />
      ) : stores.length === 0 ? (
        <EmptyState
          title={t.adminBranches}
          description={t.adminStorefront}
          actionText={t.adminAddBranch}
          onAction={() => setShowModal(true)}
        />
      ) : (
        /* Branches Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stores.map((store) => (
            <AdminBranchCard
              key={store.id}
              store={store}
              onEdit={handleOpenEdit}
              onDelete={deleteStore}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Branch Modal */}
      <AdminBranchModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isEditing={Boolean(editingStore)}
        formStore={formStore}
        setFormStore={setFormStore}
        onSave={handleSave}
      />
    </div>
  );
};
