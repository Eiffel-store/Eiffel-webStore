import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Upload, Loader2, Plus, Trash2, Crosshair, Zap, Move, Check } from 'lucide-react';
import { Look, LookbookHotspot } from '@/types';
import { useLanguage, useStoreData } from '@/shared';
import { uploadService } from '@/services/uploadService';

interface AdminLookModalProps {
  isOpen: boolean;
  look: Partial<Look> | null;
  onClose: () => void;
  onSave: (lookData: Partial<Look>) => Promise<void>;
}

import { LOOKBOOK_PRESETS, COLLECTION_OPTIONS } from '../../constants';

export const AdminLookModal: React.FC<AdminLookModalProps> = ({
  isOpen,
  look,
  onClose,
  onSave
}) => {
  const { isRTL, t } = useLanguage();
  const { products = [] } = useStoreData();

  const [formData, setFormData] = useState<Partial<Look>>({
    titleAr: '',
    titleEn: '',
    subtitleAr: '',
    subtitleEn: '',
    imageUrl: '',
    collectionLink: '/collections/men',
    category: 'men',
    active: true,
    hotspots: []
  });

  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Local state for dragging pins
  const [localHotspots, setLocalHotspots] = useState<LookbookHotspot[]>([]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [activePinIndex, setActivePinIndex] = useState<number | null>(null);

  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const localHotspotsRef = useRef<LookbookHotspot[]>([]);
  const draggingIndexRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (look) {
      setFormData({
        id: look.id,
        titleAr: look.titleAr || '',
        titleEn: look.titleEn || '',
        subtitleAr: look.subtitleAr || '',
        subtitleEn: look.subtitleEn || '',
        imageUrl: look.imageUrl || '',
        collectionLink: look.collectionLink || '/collections/men',
        category: look.category || 'men',
        active: look.active !== undefined ? look.active : true,
        hotspots: look.hotspots || []
      });
      setLocalHotspots(look.hotspots || []);
    } else {
      setFormData({
        titleAr: '',
        titleEn: '',
        subtitleAr: '',
        subtitleEn: '',
        imageUrl: '',
        collectionLink: '/collections/men',
        category: 'men',
        active: true,
        hotspots: []
      });
      setLocalHotspots([]);
    }
    setActivePinIndex(null);
    setDraggingIndex(null);
  }, [look, isOpen]);

  useEffect(() => {
    localHotspotsRef.current = localHotspots;
  }, [localHotspots]);

  const handleApplyPreset = (presetIndex: number) => {
    const p = LOOKBOOK_PRESETS[presetIndex];
    if (!p) return;
    setFormData(prev => ({
      ...prev,
      titleAr: p.titleAr,
      titleEn: p.titleEn,
      subtitleAr: p.subtitleAr,
      subtitleEn: p.subtitleEn,
      category: p.category,
      collectionLink: p.collectionLink
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      if (res?.fileUrl) {
        setFormData(prev => ({ ...prev, imageUrl: res.fileUrl }));
        return;
      }
      throw new Error('No URL returned');
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setFormData(prev => ({ ...prev, imageUrl: urlInput.trim() }));
    setUrlInput('');
  };

  const handleAddHotspot = () => {
    const currentList = localHotspotsRef.current;
    const defaultProduct = products[currentList.length % Math.max(1, products.length)] || products[0];
    const newHotspot: LookbookHotspot = {
      id: `h-${Date.now()}`,
      x: 35 + (currentList.length * 15) % 50,
      y: 30 + (currentList.length * 20) % 50,
      productId: defaultProduct?.id || '',
      titleAr: defaultProduct?.name || 'قطعة منسقة جديدة',
      titleEn: defaultProduct?.subtitle || defaultProduct?.name || 'New Look Item',
      price: defaultProduct?.price || 750
    };
    const updated = [...currentList, newHotspot];
    setLocalHotspots(updated);
    setActivePinIndex(updated.length - 1);
    setFormData(prev => ({ ...prev, hotspots: updated }));
  };

  const handleSelectProductForHotspot = (index: number, productId: string) => {
    const selected = products.find(p => p.id === productId);
    if (!selected) return;

    const updated = [...localHotspotsRef.current];
    updated[index] = {
      ...updated[index],
      productId: selected.id,
      titleAr: selected.name,
      titleEn: selected.subtitle || selected.name,
      price: selected.price
    };
    setLocalHotspots(updated);
    setFormData(prev => ({ ...prev, hotspots: updated }));
  };

  const handleDeleteHotspot = (index: number) => {
    const updated = localHotspotsRef.current.filter((_, i) => i !== index);
    setLocalHotspots(updated);
    setFormData(prev => ({ ...prev, hotspots: updated }));
    if (activePinIndex === index) {
      setActivePinIndex(null);
    } else if (activePinIndex !== null && activePinIndex > index) {
      setActivePinIndex(activePinIndex - 1);
    }
  };

  const updatePinCoordinates = useCallback((clientX: number, clientY: number, targetIndex: number, commitToForm: boolean = false) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const rawX = ((clientX - rect.left) / rect.width) * 100;
    const rawY = ((clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.round(Math.max(4, Math.min(96, rawX)) * 10) / 10;
    const clampedY = Math.round(Math.max(4, Math.min(96, rawY)) * 10) / 10;

    const currentList = [...localHotspotsRef.current];
    if (currentList[targetIndex]) {
      currentList[targetIndex] = {
        ...currentList[targetIndex],
        x: clampedX,
        y: clampedY
      };
      setLocalHotspots(currentList);

      if (commitToForm) {
        setFormData(prev => ({ ...prev, hotspots: currentList }));
      }
    }
  }, []);

  const handlePinPointerDown = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    draggingIndexRef.current = index;
    setDraggingIndex(index);
    setActivePinIndex(index);
  };

  useEffect(() => {
    if (draggingIndex === null) return;

    let latestClientX = 0;
    let latestClientY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e && e.touches[0]) {
        latestClientX = e.touches[0].clientX;
        latestClientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        latestClientX = e.clientX;
        latestClientY = e.clientY;
      }

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(() => {
          if (draggingIndexRef.current !== null) {
            updatePinCoordinates(latestClientX, latestClientY, draggingIndexRef.current, false);
          }
          rafIdRef.current = null;
        });
      }
    };

    const handlePointerUp = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      draggingIndexRef.current = null;
      setDraggingIndex(null);
      setFormData(prev => ({ ...prev, hotspots: localHotspotsRef.current }));
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);
    window.addEventListener('touchcancel', handlePointerUp);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('touchcancel', handlePointerUp);
    };
  }, [draggingIndex, updatePinCoordinates]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingIndex !== null) return;
    if (activePinIndex !== null && localHotspots[activePinIndex]) {
      updatePinCoordinates(e.clientX, e.clientY, activePinIndex, true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      alert(t.adminUploadLookImageFirst);
      return;
    }
    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        hotspots: localHotspots
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div>
            <h2 className="text-lg font-editorial font-bold text-white uppercase tracking-wider">
              {look?.id ? t.adminEditLook : t.adminAddNewLook}
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              {t.adminLookbookManagerDesc}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Quick Presets */}
          <div className="p-3.5 bg-purple-950/20 border border-purple-500/30 rounded-lg space-y-2">
            <label className="block text-xs font-mono text-purple-300 font-bold flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-purple-400" />
              <span>{t.adminQuickMarketingPresets}</span>
            </label>
            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value !== '') handleApplyPreset(parseInt(e.target.value, 10));
              }}
              className="w-full bg-zinc-900 border border-purple-500/40 text-purple-200 rounded p-2 text-xs font-mono focus:outline-none cursor-pointer"
            >
              <option value="" disabled>{t.adminChoosePresetAutoFill}</option>
              {LOOKBOOK_PRESETS.map((p, idx) => (
                <option key={idx} value={idx}>
                  {isRTL ? p.labelAr : p.titleEn}
                </option>
              ))}
            </select>
          </div>

          {/* Grid Layout: Visual Canvas & Form Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Visual Canvas with Pins */}
            <div className="lg:col-span-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-300 font-mono">
                <span className="flex items-center gap-1 text-purple-400 font-bold">
                  <Move className="w-3.5 h-3.5" />
                  <span>{t.adminDragDropPins}</span>
                </span>
                <span className="text-[10px] text-zinc-500">
                  {localHotspots.length} {t.adminHotspotsCount}
                </span>
              </div>

              <div
                ref={imageContainerRef}
                onClick={handleImageClick}
                className="relative aspect-[3/4] bg-zinc-900 border-2 border-dashed border-purple-500/40 hover:border-purple-400 rounded-lg overflow-hidden shadow-2xl cursor-crosshair group transition-colors"
              >
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Look Preview"
                    className="w-full h-full object-cover pointer-events-none"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-zinc-400 text-xs">
                    <Upload className="w-8 h-8 text-purple-400 mb-2" />
                    <span>{t.adminUploadNewImage}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />

                {/* Numbered Pins */}
                {localHotspots.map((spot, idx) => {
                  const isDragging = draggingIndex === idx;
                  const isActive = activePinIndex === idx;

                  return (
                    <div
                      key={spot.id || idx}
                      style={{
                        top: `${spot.y}%`,
                        left: `${spot.x}%`,
                        transform: 'translate3d(-50%, -50%, 0)',
                        willChange: 'top, left, transform',
                        touchAction: 'none'
                      }}
                      onMouseDown={(e) => handlePinPointerDown(e, idx)}
                      onTouchStart={(e) => handlePinPointerDown(e, idx)}
                      className={`absolute rounded-full flex items-center justify-center font-bold font-mono cursor-grab active:cursor-grabbing select-none ${
                        isDragging
                          ? 'w-9 h-9 bg-purple-500 text-white shadow-2xl ring-4 ring-purple-300 scale-110 z-50'
                          : isActive
                          ? 'w-8 h-8 bg-amber-400 text-black shadow-xl ring-2 ring-white z-30'
                          : 'w-7 h-7 bg-white text-black shadow-lg border-2 border-black hover:scale-105 z-20'
                      }`}
                      title={`#${idx + 1}: ${isRTL ? spot.titleAr : (spot.titleEn || spot.titleAr)}`}
                    >
                      <span className="text-xs pointer-events-none">{idx + 1}</span>

                      <div
                        className={`absolute bottom-full mb-1.5 whitespace-nowrap px-2 py-0.5 bg-black/90 text-white text-[9px] rounded font-mono shadow-md border border-zinc-700 pointer-events-none ${
                          isDragging || isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        #{idx + 1} ({Math.round(spot.x)}%, {Math.round(spot.y)}%)
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-zinc-400 font-mono text-center">
                {t.adminDragDropTip}
              </p>
            </div>

            {/* Form Fields */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Image Upload Controls */}
              <div>
                <label className="block text-xs text-zinc-300 font-bold mb-1.5">
                  {t.adminEditorialModelImage} *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-dashed border-zinc-700 text-xs font-medium cursor-pointer transition-colors rounded">
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                    ) : (
                      <Upload className="w-4 h-4 text-purple-400" />
                    )}
                    <span>{isUploading ? t.adminUploading : t.adminUploadNewImage}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>

                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder={t.adminPasteImageUrl}
                      className="flex-1 bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 rounded focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium border border-zinc-700 transition-colors rounded cursor-pointer"
                    >
                      {t.adminApplyBtn}
                    </button>
                  </div>
                </div>
              </div>

              {/* Titles in Arabic & English */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-300 font-bold mb-1">
                    {t.adminSectionTitleAr} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleAr || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, titleAr: e.target.value }))}
                    placeholder="إطلالة الشتاء الملكية"
                    className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white rounded focus:outline-none text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 font-bold mb-1">
                    {t.adminSectionTitleEn} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleEn || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                    placeholder="WINTER ROYAL LOOK"
                    className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white rounded focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Subtitles / Badges in Arabic & English */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 font-mono mb-1">
                    {t.adminSubtitleTagAr}
                  </label>
                  <input
                    type="text"
                    value={formData.subtitleAr || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitleAr: e.target.value }))}
                    placeholder="تنسيق فاخر متكامل ومختار بعناية"
                    className="w-full bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-xs text-white rounded focus:outline-none text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 font-mono mb-1">
                    {t.adminSubtitleTagEn}
                  </label>
                  <input
                    type="text"
                    value={formData.subtitleEn || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitleEn: e.target.value }))}
                    placeholder="CURATED BESPOKE ENSEMBLE"
                    className="w-full bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-xs text-white rounded focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Collection Link & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    {t.adminCollectionLink}
                  </label>
                  <select
                    value={formData.collectionLink || '/collections/men'}
                    onChange={(e) => setFormData(prev => ({ ...prev, collectionLink: e.target.value }))}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white rounded p-2 text-xs font-mono focus:border-purple-500 focus:outline-none cursor-pointer"
                  >
                    {COLLECTION_OPTIONS.map(c => (
                      <option key={c.path} value={c.path}>
                        {isRTL ? c.labelAr : c.labelEn} ({c.path})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    {t.adminLookCategory}
                  </label>
                  <input
                    type="text"
                    value={formData.category || 'men'}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="men / winter / formal"
                    className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white rounded focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Active Toggle Switch */}
              <div className="flex items-center justify-between p-3 bg-zinc-900/60 border border-zinc-800 rounded-lg">
                <span className="text-xs text-zinc-300 font-medium">
                  {formData.active ? t.adminLookStatusActive : t.adminLookStatusInactive}
                </span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, active: !prev.active }))}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    formData.active ? 'bg-emerald-500' : 'bg-zinc-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      formData.active ? (isRTL ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Hotspots Section */}
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-label-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-purple-400" />
                  <span>{t.adminInteractiveHotspots}</span>
                </h3>
                <span className="text-[11px] text-zinc-400">
                  {t.adminInteractiveHotspotsDesc}
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddHotspot}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-bold flex items-center gap-1 shadow cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.adminAddItemHotspot}</span>
              </button>
            </div>

            {/* Hotspots List */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {localHotspots.map((spot, index) => {
                const isActive = activePinIndex === index;

                return (
                  <div
                    key={spot.id || index}
                    onClick={() => setActivePinIndex(index)}
                    className={`p-3 bg-zinc-900/80 border rounded-lg grid grid-cols-1 sm:grid-cols-12 gap-3 items-center transition-colors cursor-pointer ${
                      isActive ? 'border-purple-500 bg-zinc-900 shadow-md ring-1 ring-purple-500/50' : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="sm:col-span-1 flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 shadow ${
                        isActive ? 'bg-amber-400 text-black' : 'bg-white text-black'
                      }`}>
                        {index + 1}
                      </span>
                    </div>

                    <div className="sm:col-span-6">
                      <select
                        value={spot.productId || ''}
                        onChange={(e) => handleSelectProductForHotspot(index, e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 text-purple-300 font-bold rounded p-1.5 text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="" disabled>{t.adminChooseProductAutoFill}</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.price} EGP)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-4 flex items-center gap-2 text-xs font-mono text-zinc-400">
                      <div className="p-1.5 bg-zinc-950 rounded border border-zinc-800 text-[11px] flex-1 text-center">
                        <span className="text-zinc-500">X:</span> <strong className="text-white">{Math.round(spot.x)}%</strong>
                        <span className="text-zinc-600 mx-1.5">|</span>
                        <span className="text-zinc-500">Y:</span> <strong className="text-white">{Math.round(spot.y)}%</strong>
                      </div>
                    </div>

                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteHotspot(index);
                        }}
                        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                        title={t.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {localHotspots.length === 0 && (
                <div className="p-4 text-center text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-lg">
                  {t.adminClickAddItemHotspot}
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded transition-colors cursor-pointer"
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>{t.saveChanges}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
