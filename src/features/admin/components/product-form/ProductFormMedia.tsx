import React, { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, Upload, Check, Loader2 } from 'lucide-react';
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const fileList = Array.from(files);
      const results = await uploadService.uploadMultipleImages(fileList);
      const uploadedUrls = results.map(r => r.fileUrl);

      const currentImages = images.filter(img => img.trim() !== '');
      onChange([...currentImages, ...uploadedUrls]);
    } catch (err: any) {
      console.error('File upload failed', err);
      setUploadError(err.message || 'فشل رفع الصور إلى السيرفر');
    } finally {
      setIsUploading(false);
      // Reset input value
      e.target.value = '';
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
    <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-zinc-800 gap-2">
        <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-zinc-400" />
          <span>{isRTL ? '2. صور المنتج (رفع ملفات حقيقية أو روابط)' : '2. Product Images'}</span>
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

      {/* Add Image Controls: File Upload & URL */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Upload from device */}
        <div className="sm:col-span-5">
          <label className={`flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-dashed border-zinc-700 text-xs font-medium cursor-pointer transition-colors ${
            isUploading ? 'opacity-50 pointer-events-none' : ''
          }`}>
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                <span>{isRTL ? 'جاري رفع الصور للسيرفر...' : 'Uploading to Server...'}</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>{isRTL ? 'رفع صور من جهازك (ملفات حقيقية)' : 'Upload from Device (Real Files)'}</span>
              </>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              disabled={isUploading}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Add from URL */}
        <div className="sm:col-span-7 flex gap-2">
          <input
            type="url"
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            placeholder={isRTL ? 'أو ضع رابط صورة مباشر (https://...)' : 'Or paste direct image URL...'}
            className="flex-1 bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white transition-colors"
          />
          <button
            type="button"
            onClick={handleAddImageUrl}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium border border-zinc-700 transition-colors flex items-center gap-1.5 shrink-0"
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
            className={`relative group bg-zinc-900 border ${
              idx === 0 ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-zinc-800'
            } aspect-[3/4] overflow-hidden`}
          >
            <img
              src={img}
              alt={`Preview ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            {idx === 0 && (
              <span className="absolute top-1 left-1 bg-emerald-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                {isRTL ? 'الرئيسية' : 'Primary'}
              </span>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
              {idx !== 0 && (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(idx)}
                  className="px-2 py-1 bg-zinc-800 text-white hover:bg-zinc-700 text-[10px] rounded flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  <span>{isRTL ? 'تعيين كرئيسية' : 'Make Primary'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="p-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] rounded"
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
