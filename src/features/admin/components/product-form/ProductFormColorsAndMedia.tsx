import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Upload, Loader2, Image as ImageIcon, Check, X, Sparkles, Palette, Pipette } from 'lucide-react';
import { ProductColor } from '@/types';
import { useLanguage } from '@/shared';
import { uploadService } from '@/services/uploadService';

interface ProductFormColorsAndMediaProps {
  colors: ProductColor[];
  images: string[];
  sizes: string[];
  onColorsChange: (colors: ProductColor[]) => void;
  onImagesChange: (images: string[]) => void;
  onSizesChange: (sizes: string[]) => void;
}

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '39', '40', '41', '42', '43', '44', '45', 'One Size'];

const POPULAR_COLOR_PRESETS = [
  { name: 'أسود (Noir)', hex: '#000000' },
  { name: 'أبيض (Blanc)', hex: '#FFFFFF' },
  { name: 'كحلي (Navy)', hex: '#111827' },
  { name: 'بيج (Beige)', hex: '#d4b996' },
  { name: 'رمادي (Grey)', hex: '#4b5563' },
  { name: 'زيتي (Olive)', hex: '#37412a' },
  { name: 'جملي (Camel)', hex: '#c19a6b' },
  { name: 'بني (Brown)', hex: '#582f0e' },
  { name: 'نبيتي (Burgundy)', hex: '#581825' },
];

export const ProductFormColorsAndMedia: React.FC<ProductFormColorsAndMediaProps> = ({
  colors,
  images,
  sizes,
  onColorsChange,
  onImagesChange,
  onSizesChange
}) => {
  const { isRTL, t } = useLanguage();
  const colorInputRef = useRef<HTMLInputElement>(null);

  // New color form state (Front & Back Views)
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [newColorImage, setNewColorImage] = useState(''); // Front View (وش)
  const [newColorBackImage, setNewColorBackImage] = useState(''); // Back View (ظهر)
  const [isUploadingNewColorFront, setIsUploadingNewColorFront] = useState(false);
  const [isUploadingNewColorBack, setIsUploadingNewColorBack] = useState(false);

  // Extra non-color gallery images state
  const [extraUrlInput, setExtraUrlInput] = useState('');
  const [isUploadingExtra, setIsUploadingExtra] = useState(false);

  // Sync all color images (front & back & additional) + extra images into product images automatically
  const syncTotalImages = (currentColors: ProductColor[], currentExtraImages: string[]) => {
    const colorImgs: string[] = [];
    currentColors.forEach(c => {
      if (c.image && c.image.trim() !== '') colorImgs.push(c.image.trim());
      if (c.backImage && c.backImage.trim() !== '') colorImgs.push(c.backImage.trim());
      if (c.images && c.images.length > 0) {
        c.images.forEach(img => {
          if (img && img.trim() !== '') colorImgs.push(img.trim());
        });
      }
    });
    const validExtras = currentExtraImages.filter(img => img && img.trim() !== '' && !colorImgs.includes(img));
    const merged = Array.from(new Set([...colorImgs, ...validExtras]));
    onImagesChange(merged.length > 0 ? merged : ['']);
  };

  // Upload image for a specific color index (or for the new color being created)
  const handleColorImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetIndex?: number,
    isBack: boolean = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (targetIndex !== undefined) {
      // Direct upload into existing color card
      try {
        const res = await uploadService.uploadImage(file);
        const url = res?.fileUrl;
        if (url) {
          const updatedColors = [...colors];
          updatedColors[targetIndex] = {
            ...updatedColors[targetIndex],
            [isBack ? 'backImage' : 'image']: url
          };
          onColorsChange(updatedColors);
          syncTotalImages(updatedColors, images);
          return;
        }
        throw new Error('No URL returned');
      } catch {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            const updatedColors = [...colors];
            updatedColors[targetIndex] = {
              ...updatedColors[targetIndex],
              [isBack ? 'backImage' : 'image']: reader.result as string
            };
            onColorsChange(updatedColors);
            syncTotalImages(updatedColors, images);
          }
        };
        reader.readAsDataURL(file);
      } finally {
        e.target.value = '';
      }
    } else {
      // Upload for new color
      if (isBack) setIsUploadingNewColorBack(true);
      else setIsUploadingNewColorFront(true);
      try {
        const res = await uploadService.uploadImage(file);
        if (res?.fileUrl) {
          if (isBack) setNewColorBackImage(res.fileUrl);
          else setNewColorImage(res.fileUrl);
          return;
        }
        throw new Error('No URL returned');
      } catch {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            if (isBack) setNewColorBackImage(reader.result as string);
            else setNewColorImage(reader.result as string);
          }
        };
        reader.readAsDataURL(file);
      } finally {
        if (isBack) setIsUploadingNewColorBack(false);
        else setIsUploadingNewColorFront(false);
        e.target.value = '';
      }
    }
  };

  // Add new color with its linked front and back images
  const handleAddColor = () => {
    if (!newColorName.trim()) {
      alert(t.adminEnterColorName);
      return;
    }

    const updatedColors = [
      ...colors,
      {
        name: newColorName.trim(),
        hex: newColorHex,
        image: newColorImage.trim() || undefined,
        backImage: newColorBackImage.trim() || undefined
      }
    ];

    onColorsChange(updatedColors);
    syncTotalImages(updatedColors, images);

    // Reset inputs
    setNewColorName('');
    setNewColorHex('#000000');
    setNewColorImage('');
    setNewColorBackImage('');
  };

  // Remove a color
  const handleRemoveColor = (index: number) => {
    const updatedColors = colors.filter((_, i) => i !== index);
    onColorsChange(updatedColors);
    syncTotalImages(updatedColors, images);
  };

  // Update color fields directly
  const handleUpdateColor = (index: number, updates: Partial<ProductColor>) => {
    const updatedColors = [...colors];
    updatedColors[index] = { ...updatedColors[index], ...updates };
    onColorsChange(updatedColors);
    syncTotalImages(updatedColors, images);
  };

  // Upload extra gallery images (close-up angles, etc.)
  const handleUploadExtra = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingExtra(true);
    try {
      const results = await uploadService.uploadMultipleImages(Array.from(files));
      const urls = results.map(r => r.fileUrl);
      const newExtras = [...images.filter(img => img && img.trim() !== ''), ...urls];
      onImagesChange(Array.from(new Set(newExtras)));
    } catch {
      const readers = await Promise.all(
        Array.from(files).map(f => new Promise<string>(resolve => {
          const r = new FileReader();
          r.onloadend = () => resolve(typeof r.result === 'string' ? r.result : '');
          r.readAsDataURL(f);
        }))
      );
      const valid = readers.filter(u => u.length > 0);
      const newExtras = [...images.filter(img => img && img.trim() !== ''), ...valid];
      onImagesChange(Array.from(new Set(newExtras)));
    } finally {
      setIsUploadingExtra(false);
      e.target.value = '';
    }
  };

  const handleAddExtraUrl = () => {
    if (!extraUrlInput.trim()) return;
    const newExtras = [...images.filter(img => img && img.trim() !== ''), extraUrlInput.trim()];
    onImagesChange(Array.from(new Set(newExtras)));
    setExtraUrlInput('');
  };

  const handleRemoveExtraImage = (imgUrl: string) => {
    // If this image was on a color, remove it from that color too
    const updatedColors = colors.map(c => c.image === imgUrl ? { ...c, image: undefined } : c);
    onColorsChange(updatedColors);
    const updatedImages = images.filter(img => img !== imgUrl);
    onImagesChange(updatedImages.length > 0 ? updatedImages : ['']);
  };

  const handleToggleSize = (size: string) => {
    if (sizes.includes(size)) {
      onSizesChange(sizes.filter(s => s !== size));
    } else {
      onSizesChange([...sizes, size]);
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-7 shadow-xl rounded-xl">
      {/* Header */}
      <div className="pb-3 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-amber-400" />
          <span>{t.adminColorsAndMediaSection}</span>
        </h2>
        <span className="text-[11px] text-zinc-400 font-mono">
          {t.adminAttachColorImageTip}
        </span>
      </div>

      {/* 1. Color Variants with Integrated Image Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs text-zinc-200 font-bold block">
            {t.adminAvailableColorsLabel}
          </label>
          <span className="text-[11px] text-emerald-400 font-mono">
            ({colors.length} {t.adminColorsAdded})
          </span>
        </div>

        {/* Existing Colors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colors.map((c, idx) => (
            <div
              key={idx}
              className={`p-4 bg-zinc-900/90 border rounded-xl space-y-3 transition-all ${
                c.image || c.backImage ? 'border-zinc-700' : 'border-amber-500/40 bg-amber-500/5'
              }`}
            >
              {/* Color Header: Swatch + Name + Hex + Delete */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="relative shrink-0 flex items-center">
                    <input
                      type="color"
                      value={c.hex.startsWith('#') && c.hex.length === 7 ? c.hex : '#000000'}
                      onChange={(e) => handleUpdateColor(idx, { hex: e.target.value })}
                      className="w-7 h-7 rounded-lg border border-zinc-600 cursor-pointer p-0 shrink-0 bg-transparent"
                      title={t.adminEditColorDegree}
                    />
                  </div>
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => handleUpdateColor(idx, { name: e.target.value })}
                    placeholder={t.adminColorNamePlaceholder}
                    className="bg-zinc-800/80 border border-zinc-700 px-2 py-1 text-xs text-white rounded font-bold w-full focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="text"
                    value={c.hex}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (!val.startsWith('#') && val.length > 0) val = '#' + val;
                      handleUpdateColor(idx, { hex: val.toUpperCase() });
                    }}
                    maxLength={7}
                    className="w-20 bg-zinc-800/80 border border-zinc-700 px-1 py-1 text-[11px] text-amber-300 font-mono rounded text-center focus:outline-none focus:border-amber-400 uppercase font-bold"
                    title={t.adminHexCode}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveColor(idx)}
                  className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/50 rounded transition-colors cursor-pointer shrink-0"
                  title={t.adminDeleteColor}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Dual Photo Slots: Front (وش) & Back (ظهر) */}
              <div className="grid grid-cols-2 gap-2">
                {/* 1. Front View (وش) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 px-1">
                    <span className="font-bold text-amber-400">{t.adminFrontPhoto}</span>
                  </div>
                  <div className="relative aspect-[3/4] bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 group flex items-center justify-center">
                    {c.image ? (
                      <>
                        <img
                          src={c.image}
                          alt={`${c.name} Front`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                          <label className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded cursor-pointer shadow" title={t.adminChangePhoto}>
                            <Upload className="w-3.5 h-3.5 text-emerald-400" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleColorImageUpload(e, idx, false)}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => handleUpdateColor(idx, { image: undefined })}
                            className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded shadow cursor-pointer"
                            title={t.adminRemovePhoto}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <label className="flex flex-col items-center justify-center gap-1 p-2 text-center cursor-pointer w-full h-full hover:bg-zinc-900/60 transition-colors">
                        <Upload className="w-5 h-5 text-amber-400" />
                        <span className="text-[10px] font-bold text-zinc-300">
                          {t.adminUploadFrontPhoto}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleColorImageUpload(e, idx, false)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* 2. Back View (ظهر) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 px-1">
                    <span className="font-bold text-zinc-300">{t.adminBackPhoto}</span>
                  </div>
                  <div className="relative aspect-[3/4] bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 group flex items-center justify-center">
                    {c.backImage ? (
                      <>
                        <img
                          src={c.backImage}
                          alt={`${c.name} Back`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                          <label className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded cursor-pointer shadow" title={t.adminChangePhoto}>
                            <Upload className="w-3.5 h-3.5 text-emerald-400" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleColorImageUpload(e, idx, true)}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => handleUpdateColor(idx, { backImage: undefined })}
                            className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded shadow cursor-pointer"
                            title={t.adminRemovePhoto}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <label className="flex flex-col items-center justify-center gap-1 p-2 text-center cursor-pointer w-full h-full hover:bg-zinc-900/60 transition-colors">
                        <Upload className="w-5 h-5 text-zinc-400 group-hover:text-amber-400" />
                        <span className="text-[10px] font-bold text-zinc-300">
                          {t.adminUploadBackPhoto}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleColorImageUpload(e, idx, true)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Add New Color Variant with Front & Back Images */}
        <div className="p-5 bg-zinc-900/60 border border-dashed border-zinc-700 rounded-xl space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t.adminAddNewColorWithPhoto}</span>
            </span>
            <span className="text-[11px] text-amber-400 font-mono font-medium">
              ({t.adminFrontPhoto} + {t.adminBackPhoto})
            </span>
          </div>

          {/* Quick Presets + Custom Color Button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-zinc-400 block">
                {t.adminPopularColorPresets}
              </span>
              <button
                type="button"
                onClick={() => colorInputRef.current?.click()}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-medium"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>{t.adminPickCustomColor}</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_COLOR_PRESETS.map((preset, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => {
                    setNewColorName(preset.name.split(' ')[0]);
                    setNewColorHex(preset.hex);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-xs text-zinc-200 transition-all cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-full border border-black/30 shrink-0" style={{ backgroundColor: preset.hex }} />
                  <span>{preset.name}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => colorInputRef.current?.click()}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 rounded text-xs text-amber-300 transition-all cursor-pointer font-bold"
              >
                <Palette className="w-3 h-3 text-amber-400" />
                <span>+ {t.adminCustomColor}</span>
              </button>
            </div>
          </div>

          {/* Row 1: Swatch / Picker + Hex Code + Color Name */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            {/* Interactive Color Picker Swatch */}
            <div
              onClick={() => colorInputRef.current?.click()}
              className="relative w-10 h-10 rounded-lg border border-zinc-600 shadow cursor-pointer p-0 shrink-0 flex items-center justify-center group overflow-hidden"
              style={{ backgroundColor: newColorHex }}
              title={t.adminPickCustomColor}
            >
              <Palette className="w-4 h-4 text-white drop-shadow opacity-70 group-hover:opacity-100 transition-opacity" />
              <input
                ref={colorInputRef}
                type="color"
                value={newColorHex.startsWith('#') && newColorHex.length === 7 ? newColorHex : '#000000'}
                onChange={(e) => setNewColorHex(e.target.value.toUpperCase())}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>

            {/* Hex Code Input */}
            <div className="relative w-full sm:w-28 shrink-0">
              <input
                type="text"
                value={newColorHex}
                onChange={(e) => {
                  let val = e.target.value;
                  if (!val.startsWith('#') && val.length > 0) val = '#' + val;
                  setNewColorHex(val.toUpperCase());
                }}
                placeholder={t.adminHexPlaceholder}
                maxLength={7}
                className="w-full bg-zinc-900 border border-zinc-700 px-2 py-2 text-xs text-amber-300 font-mono rounded text-center focus:outline-none focus:border-amber-400 font-bold uppercase"
                title={t.adminHexCode}
              />
            </div>

            {/* Color Name Input */}
            <input
              type="text"
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              placeholder={t.adminColorNamePlaceholder}
              className="w-full sm:flex-1 bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white placeholder:text-zinc-500 rounded focus:outline-none focus:border-amber-400 font-bold"
            />
          </div>

          {/* Row 2: Dual Image Upload: Front (وش) and Back (ظهر) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Front Image Box */}
            <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <span>1.</span>
                  <span>{t.adminFrontPhoto}</span>
                </span>
                {newColorImage && (
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {t.adminFrontPhotoUploaded}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <label className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded text-xs font-medium cursor-pointer transition-colors ${
                  isUploadingNewColorFront ? 'opacity-50 pointer-events-none' : ''
                }`}>
                  {isUploadingNewColorFront ? (
                    <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className="truncate">
                    {newColorImage ? t.adminChangePhoto : t.adminUploadFrontPhoto}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingNewColorFront}
                    onChange={(e) => handleColorImageUpload(e, undefined, false)}
                    className="hidden"
                  />
                </label>
                <input
                  type="url"
                  value={newColorImage}
                  onChange={(e) => setNewColorImage(e.target.value)}
                  placeholder={t.adminOrImageUrl}
                  className="w-28 bg-zinc-900 border border-zinc-700 px-2 py-1.5 text-xs text-white placeholder:text-zinc-500 rounded focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            {/* Back Image Box */}
            <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-300 flex items-center gap-1">
                  <span>2.</span>
                  <span>{t.adminBackPhoto}</span>
                </span>
                {newColorBackImage && (
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {t.adminBackPhotoUploaded}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <label className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded text-xs font-medium cursor-pointer transition-colors ${
                  isUploadingNewColorBack ? 'opacity-50 pointer-events-none' : ''
                }`}>
                  {isUploadingNewColorBack ? (
                    <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 text-zinc-400" />
                  )}
                  <span className="truncate">
                    {newColorBackImage ? t.adminChangePhoto : t.adminUploadBackPhoto}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingNewColorBack}
                    onChange={(e) => handleColorImageUpload(e, undefined, true)}
                    className="hidden"
                  />
                </label>
                <input
                  type="url"
                  value={newColorBackImage}
                  onChange={(e) => setNewColorBackImage(e.target.value)}
                  placeholder={t.adminOrImageUrl}
                  className="w-28 bg-zinc-900 border border-zinc-700 px-2 py-1.5 text-xs text-white placeholder:text-zinc-500 rounded focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Previews + Add Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            {/* Live Dual Preview */}
            {(newColorImage || newColorBackImage) ? (
              <div className="flex items-center gap-3 p-2 bg-zinc-950 rounded border border-emerald-800 text-xs text-emerald-400">
                {newColorImage && (
                  <div className="flex items-center gap-1.5">
                    <img src={newColorImage} alt="Front" className="w-9 h-9 rounded object-cover border border-amber-500" />
                    <span className="text-[10px] font-mono">{t.adminFrontPhoto}</span>
                    <button type="button" onClick={() => setNewColorImage('')} className="text-red-400 hover:text-red-300">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {newColorBackImage && (
                  <div className="flex items-center gap-1.5 border-l border-zinc-800 rtl:border-l-0 rtl:border-r pl-2 rtl:pl-0 rtl:pr-2">
                    <img src={newColorBackImage} alt="Back" className="w-9 h-9 rounded object-cover border border-zinc-500" />
                    <span className="text-[10px] font-mono">{t.adminBackPhoto}</span>
                    <button type="button" onClick={() => setNewColorBackImage('')} className="text-red-400 hover:text-red-300">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-[11px] text-zinc-500 font-mono">
                {t.adminAttachColorImageTip}
              </div>
            )}

            {/* Add Button */}
            <button
              type="button"
              onClick={handleAddColor}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{t.adminAddColorAndImage}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Additional Gallery Angles (Optional extra images) */}
      <div className="space-y-3 pt-4 border-t border-zinc-800">
        <label className="text-xs text-zinc-300 font-bold block">
          {t.adminExtraGalleryImages}
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-dashed border-zinc-700 rounded text-xs font-medium cursor-pointer transition-colors ${
            isUploadingExtra ? 'opacity-50 pointer-events-none' : ''
          }`}>
            {isUploadingExtra ? (
              <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 text-emerald-400" />
            )}
            <span>{t.adminUploadMultiplePhotosFromDevice}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              disabled={isUploadingExtra}
              onChange={handleUploadExtra}
              className="hidden"
            />
          </label>

          <div className="flex gap-2 sm:w-80">
            <input
              type="url"
              value={extraUrlInput}
              onChange={(e) => setExtraUrlInput(e.target.value)}
              placeholder={t.adminOrDirectImageUrl}
              className="flex-1 bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white placeholder:text-zinc-500 rounded focus:outline-none focus:border-amber-400 font-mono"
            />
            <button
              type="button"
              onClick={handleAddExtraUrl}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium border border-zinc-700 rounded transition-colors shrink-0 cursor-pointer"
            >
              {t.adminAddPhotoBtn}
            </button>
          </div>
        </div>

        {/* Gallery Thumbnails List */}
        {images.filter(img => img && img.trim() !== '').length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2.5 pt-2">
            {images.filter(img => img && img.trim() !== '').map((img, idx) => {
              const matchedColor = colors.find(c => c.image === img);
              return (
                <div
                  key={idx}
                  className="relative group bg-zinc-900 border border-zinc-800 rounded-lg aspect-[3/4] overflow-hidden"
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  {matchedColor && (
                    <span
                      className="absolute bottom-1 left-1 rtl:left-auto rtl:right-1 text-[8px] font-bold text-white px-1 py-0.2 rounded shadow backdrop-blur-sm bg-black/80 flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: matchedColor.hex }} />
                      <span className="truncate max-w-[50px]">{matchedColor.name}</span>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveExtraImage(img)}
                    className="absolute top-1 right-1 rtl:right-auto rtl:left-1 p-1 bg-red-600 text-white rounded shadow opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title={t.adminRemovePhoto}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Sizes Matrix */}
      <div className="space-y-3 pt-4 border-t border-zinc-800">
        <label className="block text-xs text-zinc-300 font-bold">
          {t.adminGarmentSizesLabel}
        </label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_SIZES.map((size) => {
            const isSelected = sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => handleToggleSize(size)}
                className={`px-3.5 py-2 text-xs font-mono font-bold transition-all border rounded-lg cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black border-white shadow-md scale-105'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
