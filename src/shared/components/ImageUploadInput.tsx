import React, { useState } from 'react';
import { Upload, Loader2, Image as ImageIcon, X, Check } from 'lucide-react';
import { uploadService } from '@/services/uploadService';
import { useLanguage } from '@/shared';

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: '16/9' | '3/4' | '1/1' | 'auto';
  placeholder?: string;
  required?: boolean;
  helpText?: string;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  value,
  onChange,
  label,
  aspectRatio = '16/9',
  placeholder,
  required = false,
  helpText
}) => {
  const { isRTL } = useLanguage();
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // 1. Live server / Cloudinary upload
      const res = await uploadService.uploadImage(file);
      if (res?.fileUrl) {
        onChange(res.fileUrl);
        return;
      }
      throw new Error('No file URL returned');
    } catch {
      // 2. Offline / local fallback
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
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
    onChange(urlInput.trim());
    setUrlInput('');
  };

  const aspectClass =
    aspectRatio === '16/9'
      ? 'aspect-[16/9]'
      : aspectRatio === '3/4'
      ? 'aspect-[3/4]'
      : aspectRatio === '1/1'
      ? 'aspect-square'
      : 'aspect-auto min-h-[140px]';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs text-zinc-300 font-bold">
          {label} {required && <span className="text-amber-400">*</span>}
        </label>
      )}

      {error && (
        <div className="text-[11px] text-red-400 bg-red-950/40 p-2 rounded border border-red-800">
          {error}
        </div>
      )}

      {/* Dual Upload: File Picker & URL Input */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
        {/* Device File Upload Button */}
        <label
          className={`sm:col-span-6 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-dashed border-zinc-700 rounded text-xs font-medium cursor-pointer transition-colors ${
            isUploading ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 text-emerald-400" />
          )}
          <span>
            {isUploading
              ? isRTL ? 'جاري الرفع...' : 'Uploading...'
              : isRTL ? 'تحميل صورة من جهازك' : 'Upload from Device'}
          </span>
          <input
            type="file"
            accept="image/*"
            disabled={isUploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {/* URL Input */}
        <div className="sm:col-span-6 flex gap-1.5">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={placeholder || (isRTL ? 'أو ضع رابط صورة...' : 'Or paste URL...')}
            className="flex-1 bg-zinc-900 border border-zinc-700 px-2.5 py-1.5 text-xs text-white placeholder:text-zinc-500 rounded focus:outline-none focus:border-amber-400 font-mono"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium border border-zinc-700 rounded transition-colors shrink-0 cursor-pointer"
          >
            {isRTL ? 'تطبيق' : 'Apply'}
          </button>
        </div>
      </div>

      {helpText && <p className="text-[10px] text-zinc-500 font-mono">{helpText}</p>}

      {/* Image Preview */}
      {value && (
        <div className="relative group bg-zinc-900 border border-zinc-800 rounded overflow-hidden mt-2 max-w-sm">
          <div className={`${aspectClass} w-full overflow-hidden`}>
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 rtl:right-auto rtl:left-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
            title={isRTL ? 'حذف الصورة' : 'Remove image'}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
