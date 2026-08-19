import React, { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, Upload, Check, Loader2, Sparkles } from 'lucide-react';
import { useLanguage } from '@/shared';
import { uploadService } from '@/services/uploadService';

interface ProductFormMediaProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export const ProductFormMedia: React.FC<ProductFormMediaProps> = ({
  images,
  onChange
}) => {
  const { isRTL } = useLanguage();
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const processFiles = async (fileList: File[]) => {
    if (fileList.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const results = await uploadService.uploadMultipleImages(fileList);
      const uploadedUrls = results.map(r => r.fileUrl);

      const currentImages = images.filter(img => img.trim() !== '');
      onChange([...currentImages, ...uploadedUrls]);
    } catch (err: any) {
      console.error('File upload failed', err);
      // Fallback: read locally if server upload fails
      try {
        const dataUrls = await Promise.all(
          fileList.map(f => new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : '');
            reader.readAsDataURL(f);
          }))
        );
        const validUrls = dataUrls.filter(u => u.length > 0);
        const currentImages = images.filter(img => img.trim() !== '');
        onChange([...currentImages, ...validUrls]);
      } catch {
        setUploadError(err.message || 'فشل رفع الصور إلى السيرفر');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await processFiles(Array.from(files));
    e.target.value = '';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const imageFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      await processFiles(imageFiles);
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    const currentImages = images.filter(img => img.trim() !== '');
    onChange([...currentImages, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated.length === 0 ? [''] : updated);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const rest = images.filter((_, i) => i !== index);
    onChange([target, ...rest]);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-5 shadow-xl rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-zinc-800 gap-2">
        <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-zinc-400" />
          <span>{isRTL ? '2. صور المنتج (رفع ملفات حقيقية من الجهاز أو روابط)' : '2. Product Images'}</span>
        </h2>
        <span className="text-[11px] text-zinc-500 font-mono">
          {isRTL ? 'الصورة الأولى هي الصورة الرئيسية للمنتج' : 'First image is used as primary thumbnail'}
        </span>
      </div>

      {uploadError && (
        <div className="p-3 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded">
          {uploadError}
        </div>
      )}

      {/* Main Drag-and-Drop / File Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
          isDraggingOver
            ? 'border-amber-400 bg-amber-500/10'
            : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-900'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
              <p className="text-sm font-bold text-white">
                {isRTL ? 'جاري رفع ومعالجة الصور...' : 'Uploading and Processing Images...'}
              </p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-amber-400 shadow-inner">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-white">
                {isRTL ? 'اسحب الصور وأفلتها هنا مباشرة، أو اضغط للاختيار من جهازك' : 'Drag & drop image files here, or click to browse'}
              </p>
              <p className="text-[11px] text-zinc-400 font-mono">
                {isRTL ? 'يدعم اختيار صور متعددة معاً (JPG, PNG, WebP)' : 'Supports multiple image files simultaneously (JPG, PNG, WebP)'}
              </p>
              <label className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded cursor-pointer transition-colors shadow">
                <Upload className="w-4 h-4" />
                <span>{isRTL ? 'اختيار صور من الجهاز' : 'Select Images from Device'}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={isUploading}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </>
          )}
        </div>
      </div>

      {/* Alternative: Add from URL */}
      <div className="pt-2 border-t border-zinc-800/60 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        <span className="text-xs text-zinc-400 shrink-0">
          {isRTL ? 'أو إضافة عبر رابط مباشر:' : 'Or add via direct URL:'}
        </span>
        <div className="flex-1 flex gap-2">
          <input
            type="url"
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            placeholder={isRTL ? 'ضع رابط صورة مباشر (https://...)' : 'Paste direct image URL (https://...)'}
            className="flex-1 bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white placeholder:text-zinc-500 rounded focus:outline-none focus:border-amber-400 font-mono"
          />
          <button
            type="button"
            onClick={handleAddImageUrl}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium border border-zinc-700 rounded transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isRTL ? 'إضافة' : 'Add'}</span>
          </button>
        </div>
      </div>

      {/* Images Previews Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
        {images.filter(img => img.trim() !== '').map((img, idx) => (
          <div
            key={idx}
            className={`relative group bg-zinc-900 border rounded overflow-hidden ${
              idx === 0 ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-zinc-800'
            } aspect-[3/4]`}
          >
            <img
              src={img}
              alt={`Preview ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            {idx === 0 && (
              <span className="absolute top-1.5 left-1.5 rtl:left-auto rtl:right-1.5 bg-amber-500 text-black text-[9px] font-bold px-2 py-0.5 rounded shadow">
                {isRTL ? 'الرئيسية' : 'Primary'}
              </span>
            )}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
              {idx !== 0 && (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(idx)}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] rounded flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>{isRTL ? 'تعيين كرئيسية' : 'Make Primary'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="p-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] rounded-full shadow cursor-pointer"
                title={isRTL ? 'حذف الصورة' : 'Delete'}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
