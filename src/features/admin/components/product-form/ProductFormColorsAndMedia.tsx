import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, Loader2, Image as ImageIcon, Check, X, Sparkles } from 'lucide-react';
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
  const { isRTL } = useLanguage();

  // New color form state
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [newColorImage, setNewColorImage] = useState('');
  const [isUploadingNewColor, setIsUploadingNewColor] = useState(false);

  // Extra non-color gallery images state
  const [extraUrlInput, setExtraUrlInput] = useState('');
  const [isUploadingExtra, setIsUploadingExtra] = useState(false);

  // Sync all color images + extra images into product images automatically
  const syncTotalImages = (currentColors: ProductColor[], currentExtraImages: string[]) => {
    const colorImgs = currentColors.map(c => c.image).filter((img): img is string => !!img && img.trim() !== '');
    const validExtras = currentExtraImages.filter(img => img && img.trim() !== '' && !colorImgs.includes(img));
    const merged = Array.from(new Set([...colorImgs, ...validExtras]));
    onImagesChange(merged.length > 0 ? merged : ['']);
  };

  // Upload image for a specific color index (or for the new color being created)
  const handleColorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (targetIndex !== undefined) {
      // Direct upload into existing color card
      try {
        const res = await uploadService.uploadImage(file);
        const url = res?.fileUrl;
        if (url) {
          const updatedColors = [...colors];
          updatedColors[targetIndex] = { ...updatedColors[targetIndex], image: url };
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
            updatedColors[targetIndex] = { ...updatedColors[targetIndex], image: reader.result as string };
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
      setIsUploadingNewColor(true);
      try {
        const res = await uploadService.uploadImage(file);
        if (res?.fileUrl) {
          setNewColorImage(res.fileUrl);
          return;
        }
        throw new Error('No URL returned');
      } catch {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setNewColorImage(reader.result as string);
          }
        };
        reader.readAsDataURL(file);
      } finally {
        setIsUploadingNewColor(false);
        e.target.value = '';
      }
    }
  };

  // Add new color with its linked image
  const handleAddColor = () => {
    if (!newColorName.trim()) {
      alert(isRTL ? 'يرجى إدخال اسم اللون.' : 'Please enter a color name.');
      return;
    }

    const updatedColors = [
      ...colors,
      {
        name: newColorName.trim(),
        hex: newColorHex,
        image: newColorImage.trim() || undefined
      }
    ];

    onColorsChange(updatedColors);
    syncTotalImages(updatedColors, images);

    // Reset inputs
    setNewColorName('');
    setNewColorHex('#000000');
    setNewColorImage('');
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
          <span>{isRTL ? '2. ألوان وصور المنتج (ربط كل لون بصورته تلقائياً)' : '2. Colors & Color-Specific Imagery'}</span>
        </h2>
        <span className="text-[11px] text-zinc-400 font-mono">
          {isRTL ? 'ارفع صورة كل لون مباشرة لترتبط به فوراً في المتجر' : 'Add each color and attach its exact image'}
        </span>
      </div>

      {/* 1. Color Variants with Integrated Image Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs text-zinc-200 font-bold block">
            {isRTL ? 'الألوان المتاحة للقطعة وصورة كل لون:' : 'Product Colors & Respective Photos:'}
          </label>
          <span className="text-[11px] text-emerald-400 font-mono">
            {isRTL ? `(${colors.length} ألوان مضافة)` : `(${colors.length} colors added)`}
          </span>
        </div>

        {/* Existing Colors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colors.map((c, idx) => (
            <div
              key={idx}
              className={`p-4 bg-zinc-900/90 border rounded-xl space-y-3 transition-all ${
                c.image ? 'border-zinc-700' : 'border-amber-500/40 bg-amber-500/5'
              }`}
            >
              {/* Color Header: Swatch + Name + Hex + Delete */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <input
                    type="color"
                    value={c.hex}
                    onChange={(e) => handleUpdateColor(idx, { hex: e.target.value })}
                    className="w-6 h-6 rounded-full border border-zinc-600 cursor-pointer p-0 shrink-0 bg-transparent"
                    title={isRTL ? 'تعديل درجة اللون' : 'Change color hex'}
                  />
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => handleUpdateColor(idx, { name: e.target.value })}
                    placeholder={isRTL ? 'اسم اللون (مثال: كحلي)' : 'Color name'}
                    className="bg-zinc-800/80 border border-zinc-700 px-2 py-1 text-xs text-white rounded font-bold w-full focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveColor(idx)}
                  className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/50 rounded transition-colors cursor-pointer shrink-0"
                  title={isRTL ? 'حذف هذا اللون' : 'Delete color'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Color Image Preview / Upload Box */}
              <div className="relative aspect-[4/3] bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 group flex items-center justify-center">
                {c.image ? (
                  <>
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      <label className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded flex items-center gap-1.5 cursor-pointer shadow">
                        <Upload className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isRTL ? 'تغيير الصورة' : 'Change'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleColorImageUpload(e, idx)}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => handleUpdateColor(idx, { image: undefined })}
                        className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded shadow cursor-pointer"
                        title={isRTL ? 'إزالة الصورة' : 'Remove image'}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-1.5 p-4 text-center cursor-pointer w-full h-full hover:bg-zinc-900/60 transition-colors">
                    <Upload className="w-6 h-6 text-amber-400" />
                    <span className="text-xs font-bold text-zinc-200">
                      {isRTL ? `رفع صورة لون (${c.name || 'هذا اللون'})` : `Upload ${c.name || 'Color'} Photo`}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {isRTL ? 'اضغط لاختيار صورة من جهازك' : 'Click to browse from device'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleColorImageUpload(e, idx)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 2. Add New Color Variant with its Image */}
        <div className="p-5 bg-zinc-900/60 border border-dashed border-zinc-700 rounded-xl space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isRTL ? '+ إضافة لون جديد وصورته مباشرة:' : '+ Add New Color Variant with Image:'}</span>
            </span>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[11px] text-zinc-400 block mb-1.5">
              {isRTL ? 'ألوان شائعة جاهزة (اضغط لاختيار فوري):' : 'Quick Color Presets:'}
            </span>
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
                  <span className="w-2.5 h-2.5 rounded-full border border-black/30" style={{ backgroundColor: preset.hex }} />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Inputs Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Color Hex & Name */}
            <div className="sm:col-span-4 flex items-center gap-2">
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-700 cursor-pointer p-0.5 shrink-0"
                title="Pick color"
              />
              <input
                type="text"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder={isRTL ? 'اسم اللون (مثال: كحلي، بيج)' : 'Color Name (e.g. Navy, Beige)'}
                className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white placeholder:text-zinc-500 rounded focus:outline-none focus:border-amber-400 font-bold"
              />
            </div>

            {/* Color Image (Upload from device or URL) */}
            <div className="sm:col-span-5 flex gap-2">
              <label className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded text-xs font-medium cursor-pointer transition-colors ${
                isUploadingNewColor ? 'opacity-50 pointer-events-none' : ''
              }`}>
                {isUploadingNewColor ? (
                  <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 text-emerald-400" />
                )}
                <span>
                  {newColorImage
                    ? isRTL ? '✓ تم رفع صورة اللون' : '✓ Photo Selected'
                    : isRTL ? 'رفع صورة هذا اللون' : 'Upload Color Photo'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploadingNewColor}
                  onChange={(e) => handleColorImageUpload(e)}
                  className="hidden"
                />
              </label>

              <input
                type="url"
                value={newColorImage}
                onChange={(e) => setNewColorImage(e.target.value)}
                placeholder={isRTL ? 'أو رابط صورة...' : 'Or image URL...'}
                className="w-28 bg-zinc-900 border border-zinc-700 px-2 py-1.5 text-xs text-white placeholder:text-zinc-500 rounded focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            {/* Add Button */}
            <div className="sm:col-span-3">
              <button
                type="button"
                onClick={handleAddColor}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow"
              >
                <Plus className="w-4 h-4" />
                <span>{isRTL ? 'إضافة اللون وصورته' : 'Add Color & Image'}</span>
              </button>
            </div>
          </div>

          {/* Live Preview of the new color being added */}
          {newColorImage && (
            <div className="flex items-center gap-2 p-2 bg-zinc-950 rounded border border-emerald-800 text-[11px] text-emerald-400 font-mono">
              <img src={newColorImage} alt="Preview" className="w-8 h-8 rounded object-cover border border-emerald-500" />
              <span>{isRTL ? 'الصورة جاهزة وسيتم حفظها مع هذا اللون عند الضغط على "إضافة اللون"' : 'Image ready to be linked with this color variant'}</span>
              <button
                type="button"
                onClick={() => setNewColorImage('')}
                className="text-red-400 hover:underline text-[10px] ml-auto rtl:ml-0 rtl:mr-auto cursor-pointer"
              >
                {isRTL ? 'إلغاء' : 'Clear'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Additional Gallery Angles (Optional extra images) */}
      <div className="space-y-3 pt-4 border-t border-zinc-800">
        <label className="text-xs text-zinc-300 font-bold block">
          {isRTL ? 'صور وزوايا إضافية للقطعة (اختياري - كالتفاصيل والظهر والأقمشة):' : 'Additional Detailed Angles (Optional):'}
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
            <span>{isRTL ? 'رفع صور إضافية من الجهاز (ملفات متعددة)' : 'Upload Additional Photos from Device'}</span>
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
              placeholder={isRTL ? 'أو ضع رابط صورة مباشر...' : 'Or direct image URL...'}
              className="flex-1 bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white placeholder:text-zinc-500 rounded focus:outline-none focus:border-amber-400 font-mono"
            />
            <button
              type="button"
              onClick={handleAddExtraUrl}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium border border-zinc-700 rounded transition-colors shrink-0 cursor-pointer"
            >
              {isRTL ? 'إضافة' : 'Add'}
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
                    title={isRTL ? 'حذف هذه الصورة' : 'Delete image'}
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
          {isRTL ? 'المقاسات المتاحة للقطعة (اختر المقاسات المتوفرة):' : 'Available Garment Sizes:'}
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
