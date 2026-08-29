import React, { useState, useRef } from 'react';
import { Plus, Trash2, Upload, Loader2, Image as ImageIcon, Check, X, Palette } from 'lucide-react';
import { ProductColor } from '@/types';
import { useLanguage } from '@/shared';
import { uploadService } from '@/services/uploadService';

interface ProductFormVariantsProps {
  colors: ProductColor[];
  sizes: string[];
  productImages?: string[];
  onColorsChange: (colors: ProductColor[]) => void;
  onSizesChange: (sizes: string[]) => void;
}

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL', '39', '40', '41', '42', '43', '44', '45', 'One Size'];

export const ProductFormVariants: React.FC<ProductFormVariantsProps> = ({
  colors,
  sizes,
  productImages = [],
  onColorsChange,
  onSizesChange
}) => {
  const { t } = useLanguage();
  const colorInputRef = useRef<HTMLInputElement>(null);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [newColorImage, setNewColorImage] = useState<string>('');
  const [isUploadingSwatch, setIsUploadingSwatch] = useState(false);

  const cleanProductImages = productImages.filter(img => img && img.trim() !== '');

  const handleSwatchUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingSwatch(true);
    try {
      const res = await uploadService.uploadImage(file);
      const url = res?.fileUrl;
      if (url) {
        if (targetIndex !== undefined) {
          const updated = [...colors];
          updated[targetIndex] = { ...updated[targetIndex], image: url };
          onColorsChange(updated);
        } else {
          setNewColorImage(url);
        }
        return;
      }
      throw new Error('No URL returned');
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (targetIndex !== undefined) {
            const updated = [...colors];
            updated[targetIndex] = { ...updated[targetIndex], image: reader.result as string };
            onColorsChange(updated);
          } else {
            setNewColorImage(reader.result as string);
          }
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingSwatch(false);
      e.target.value = '';
    }
  };

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    onColorsChange([
      ...colors,
      {
        name: newColorName.trim(),
        hex: newColorHex,
        image: newColorImage || undefined
      }
    ]);
    setNewColorName('');
    setNewColorHex('#000000');
    setNewColorImage('');
  };

  const handleRemoveColor = (index: number) => {
    const updated = colors.filter((_, i) => i !== index);
    onColorsChange(updated);
  };

  const handleUpdateColorImage = (index: number, imageUrl: string) => {
    const updated = [...colors];
    updated[index] = { ...updated[index], image: imageUrl || undefined };
    onColorsChange(updated);
  };

  const handleToggleSize = (size: string) => {
    if (sizes.includes(size)) {
      onSizesChange(sizes.filter(s => s !== size));
    } else {
      onSizesChange([...sizes, size]);
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-6 shadow-xl rounded-lg">
      <h2 className="text-sm font-label-bold uppercase tracking-wider text-white pb-2 border-b border-zinc-800 flex items-center justify-between">
        <span>{t.adminColorsAndMediaSection}</span>
        <span className="text-[11px] text-zinc-500 font-mono font-normal">
          {t.adminAttachColorImageTip}
        </span>
      </h2>

      {/* Colors Manager */}
      <div className="space-y-4">
        <label className="block text-xs text-zinc-300 font-bold">
          {t.adminAvailableColorsLabel}
        </label>

        {/* Existing color cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {colors.map((c, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-zinc-900/90 border border-zinc-800 rounded-lg text-xs hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Color Dot or Image Thumbnail */}
                <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-zinc-700 shrink-0 bg-black flex items-center justify-center">
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    <span
                      className="w-5 h-5 rounded-full border border-zinc-600 shadow-sm"
                      style={{ backgroundColor: c.hex }}
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="text-zinc-200 font-bold truncate flex items-center gap-1">
                    <span>{c.name}</span>
                    <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: c.hex }} />
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    {c.image ? t.adminColorPhotoUploaded : t.adminUploadColorPhoto}
                  </div>
                </div>
              </div>

              {/* Controls: Change Image / Delete */}
              <div className="flex items-center gap-1">
                {cleanProductImages.length > 0 && (
                  <select
                    value={c.image || ''}
                    onChange={(e) => handleUpdateColorImage(idx, e.target.value)}
                    className="w-16 bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-300 rounded p-1"
                    title={t.adminUploadColorPhoto}
                  >
                    <option value="">{t.adminProductTableImages}...</option>
                    {cleanProductImages.map((img, pIdx) => (
                      <option key={pIdx} value={img}>
                        {t.adminProductTableImages} #{pIdx + 1}
                      </option>
                    ))}
                  </select>
                )}

                <label
                  className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded cursor-pointer transition-colors"
                  title={t.adminUploadColorPhoto}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleSwatchUpload(e, idx)}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => handleRemoveColor(idx)}
                  className="p-1.5 bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-400 rounded transition-colors cursor-pointer"
                  title={t.adminDeleteColor}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Color Form */}
        <div className="p-4 bg-zinc-900/60 border border-dashed border-zinc-800 rounded-lg space-y-3">
          <span className="text-xs font-bold text-zinc-300 block">
            {t.adminAddNewColorWithPhoto}
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {/* Color Swatch & Picker */}
            <div
              onClick={() => colorInputRef.current?.click()}
              className="relative w-9 h-9 rounded border border-zinc-700 shadow cursor-pointer p-0 shrink-0 flex items-center justify-center group overflow-hidden"
              style={{ backgroundColor: newColorHex }}
              title={t.adminPickCustomColor}
            >
              <Palette className="w-3.5 h-3.5 text-white drop-shadow opacity-70 group-hover:opacity-100 transition-opacity" />
              <input
                ref={colorInputRef}
                type="color"
                value={newColorHex.startsWith('#') && newColorHex.length === 7 ? newColorHex : '#000000'}
                onChange={(e) => setNewColorHex(e.target.value.toUpperCase())}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>

            {/* Hex Input */}
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
              className="w-20 bg-zinc-900 border border-zinc-700 px-1.5 py-2 text-xs text-amber-300 font-mono rounded text-center focus:outline-none focus:border-amber-400 font-bold uppercase"
              title={t.adminHexCode}
            />

            <input
              type="text"
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              placeholder={t.adminColorNamePlaceholder}
              className="flex-1 min-w-[160px] bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white placeholder:text-zinc-500 rounded focus:outline-none focus:border-amber-400 font-bold"
            />

            {/* Link from uploaded product photos */}
            {cleanProductImages.length > 0 && (
              <select
                value={newColorImage}
                onChange={(e) => setNewColorImage(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 px-2.5 py-2 text-xs text-zinc-300 rounded focus:outline-none focus:border-amber-400"
              >
                <option value="">{t.adminUploadColorPhoto}</option>
                {cleanProductImages.map((img, pIdx) => (
                  <option key={pIdx} value={img}>
                    {t.adminProductTableImages} #{pIdx + 1}
                  </option>
                ))}
              </select>
            )}

            {/* Or upload new photo for color */}
            <label className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 rounded text-xs cursor-pointer transition-colors">
              {isUploadingSwatch ? (
                <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span className="text-[11px]">{newColorImage ? t.adminColorPhotoUploaded : t.adminUploadColorPhoto}</span>
              <input
                type="file"
                accept="image/*"
                disabled={isUploadingSwatch}
                onChange={(e) => handleSwatchUpload(e)}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={handleAddColor}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded transition-colors flex items-center gap-1 cursor-pointer shadow"
            >
              <Plus className="w-4 h-4" />
              <span>{t.adminAddColorAndImage}</span>
            </button>
          </div>

          {newColorImage && (
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400 font-mono">
              <img src={newColorImage} alt="Color preview" className="w-7 h-7 rounded object-cover border border-emerald-500" />
              <span>{t.adminColorPhotoReadyTip}</span>
              <button
                type="button"
                onClick={() => setNewColorImage('')}
                className="text-red-400 hover:underline text-[10px] ml-2 cursor-pointer"
              >
                {t.cancel}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sizes Matrix */}
      <div className="space-y-3 pt-3 border-t border-zinc-800/80">
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
                className={`px-3 py-2 text-xs font-mono font-bold transition-all border rounded cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black border-white shadow-md'
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
