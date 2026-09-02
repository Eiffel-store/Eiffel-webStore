import React, { useState, Suspense, lazy } from 'react';
import { ShoppingBag, Plus, Edit2, Trash2, ArrowUp, ArrowDown, Sparkles, Layers, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Look } from '@/types';
import { useLanguage, useStoreData } from '@/shared';

// Lazy-Loaded Lookbook Hotspot Editor Modal
const AdminLookModal = lazy(() => import('./AdminLookModal').then(m => ({ default: m.AdminLookModal })));


export const AdminShopTheLookManager: React.FC = () => {
  const { isRTL, t } = useLanguage();
  const {
    looks = [],
    isLooksLoading,
    addLook,
    updateLook,
    deleteLook,
    toggleLookStatus,
    reorderLooks
  } = useStoreData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLook, setSelectedLook] = useState<Partial<Look> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleOpenCreateModal = () => {
    setSelectedLook(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (look: Look) => {
    setSelectedLook(look);
    setIsModalOpen(true);
  };

  const handleSaveLook = async (lookData: Partial<Look>) => {
    if (lookData.id) {
      await updateLook(lookData.id, lookData);
    } else {
      await addLook(lookData);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t.adminConfirmDeleteLook)) {
      setDeletingId(id);
      try {
        await deleteLook(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= looks.length) return;

    const newOrder = [...looks];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    const orderedIds = newOrder.map(l => l.id);
    await reorderLooks(orderedIds);
  };

  const activeCount = looks.filter(l => l.active).length;

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-6 shadow-xl rounded-lg select-none">
      
      {/* Section Header */}
      <div className="pb-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-editorial font-bold uppercase tracking-wider text-white">
              {t.adminLookbookManager}
            </h2>
          </div>
          <p className="text-xs text-zinc-400 font-mono">
            {t.adminLookbookManagerDesc}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs font-mono text-zinc-400">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>{looks.length} {t.adminAllLooks}</span>
            <span className="text-zinc-600">|</span>
            <span className="text-emerald-400 font-bold">{activeCount} نشط</span>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.adminAddNewLook}</span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLooksLoading && looks.length === 0 && (
        <div className="py-16 text-center text-zinc-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-400" />
          <p className="text-xs font-mono">{t.loading}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLooksLoading && looks.length === 0 && (
        <div className="py-16 px-4 border-2 border-dashed border-zinc-800 rounded-xl text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-sm font-bold text-white">
              {t.adminNoLooksFound}
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              {t.adminShopTheLookDesc}
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.adminCreateFirstLook}</span>
          </button>
        </div>
      )}

      {/* Looks Grid / List */}
      {looks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {looks.map((look, index) => {
            const isDeleting = deletingId === look.id;
            const hotspotsCount = look.hotspots?.length || 0;

            return (
              <div
                key={look.id || index}
                className={`bg-zinc-900/90 border rounded-xl overflow-hidden shadow-lg transition-all duration-200 hover:border-zinc-700 flex flex-col justify-between ${
                  look.active ? 'border-zinc-800' : 'border-zinc-800/60 opacity-70'
                }`}
              >
                {/* Visual Thumbnail with Overlay Badge */}
                <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden group">
                  <img
                    src={look.imageUrl || 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop'}
                    alt={look.titleEn || 'Look Thumbnail'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badges on Top */}
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md text-purple-300 text-[10px] font-mono font-bold rounded border border-purple-500/30">
                      #{index + 1} • {look.category || 'men'}
                    </span>

                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded shadow flex items-center gap-1 ${
                      look.active
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-zinc-800/90 text-zinc-400'
                    }`}>
                      {look.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{look.active ? t.statusActive : t.statusDraft}</span>
                    </span>
                  </div>

                  {/* Hotspots Pin Count */}
                  <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between text-white text-xs">
                    <span className="px-2 py-0.5 bg-zinc-900/80 backdrop-blur text-[11px] font-mono rounded border border-zinc-700">
                      🎯 {hotspotsCount} {t.adminHotspotsCount}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">
                      {isRTL ? look.titleAr : look.titleEn}
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-mono line-clamp-1">
                      {isRTL ? look.titleEn : look.titleAr}
                    </p>
                    {look.subtitleAr && (
                      <p className="text-[11px] text-purple-300 line-clamp-1 mt-1">
                        {isRTL ? look.subtitleAr : look.subtitleEn}
                      </p>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                    {/* Reorder Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 disabled:opacity-30 disabled:pointer-events-none rounded transition-colors cursor-pointer"
                        title={t.adminMoveUp}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === looks.length - 1}
                        className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 disabled:opacity-30 disabled:pointer-events-none rounded transition-colors cursor-pointer"
                        title={t.adminMoveDown}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Toggle, Edit & Delete */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleLookStatus(look.id)}
                        className={`p-1.5 rounded transition-colors cursor-pointer ${
                          look.active
                            ? 'text-emerald-400 hover:bg-emerald-950/40'
                            : 'text-zinc-500 hover:bg-zinc-800'
                        }`}
                        title={look.active ? t.adminLookStatusActive : t.adminLookStatusInactive}
                      >
                        {look.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(look)}
                        className="p-1.5 text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded transition-colors cursor-pointer"
                        title={t.edit}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(look.id)}
                        disabled={isDeleting}
                        className="p-1.5 text-zinc-400 hover:text-red-400 bg-zinc-800 hover:bg-red-950/40 rounded transition-colors cursor-pointer disabled:opacity-50"
                        title={t.delete}
                      >
                        {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Look Modal */}
      {isModalOpen && (
        <Suspense fallback={null}>
          <AdminLookModal
            isOpen={isModalOpen}
            look={selectedLook}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveLook}
          />
        </Suspense>
      )}
    </div>
  );
};
