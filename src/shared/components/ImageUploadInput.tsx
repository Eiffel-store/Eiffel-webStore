import React, { useState } from 'react';
import { Upload, Loader2, Image as ImageIcon, X, Link as LinkIcon, Sparkles } from 'lucide-react';
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
  const [uploadMode, setUploadMode] = useState<'device' | 'url'>('device');

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
      // 2. Local fallback
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

  const handleApplyUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
    <div className="space-y-2.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-zinc-200">
            {label} {required && <span className="text-amber-400">*</span>}
          </label>
          <span className="text-[10px] text-zinc-400 font-mono">
            {aspectRatio === '16/9' ? '16:9 Banner' : aspectRatio === '3/4' ? '3:4 Portrait' : 'Standard'}
          </span>
        </div>
      )}

      {error && (
        <div className="text-[11px] text-red-400 bg-red-950/40 p-2.5 rounded-lg border border-red-800 flex items-center gap-2">
          <X className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Controls & Mode Switcher */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 space-y-3">
        <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-2.5">
          <button
            type="button"
            onClick={() => setUploadMode('device')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              uploadMode === 'device'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isRTL ? 'رفع من الجهاز' : 'Upload File'}</span>
          </button>
          <button
            type="button"
            onClick={() => setUploadMode('url')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              uploadMode === 'url'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>{isRTL ? 'رابط مباشر (URL)' : 'Direct URL'}</span>
          </button>
        </div>

        {uploadMode === 'device' ? (
          <label
            className={`group relative flex flex-col items-center justify-center p-4 border-2 border-dashed border-zinc-700/80 hover:border-amber-500/60 bg-zinc-950/40 hover:bg-zinc-900/60 rounded-xl transition-all cursor-pointer ${
              isUploading ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 py-2">
                <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                <span className="text-xs text-zinc-300 font-medium">
                  {isRTL ? 'جاري رفع الصورة إلى السحابة...' : 'Uploading image...'}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-10 h-10 rounded-full bg-zinc-800/80 group-hover:bg-amber-500/10 text-zinc-300 group-hover:text-amber-400 flex items-center justify-center transition-colors">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-zinc-200 group-hover:text-white mt-1">
                  {isRTL ? 'اضغط لاختيار صورة من جهازك' : 'Click to browse image from device'}
                </span>
                <span className="text-[11px] text-zinc-500">
                  {isRTL ? 'يدعم صيغ JPG, PNG, WEBP حتى 20 ميجابايت' : 'PNG, JPG, WEBP up to 20MB'}
                </span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyUrl())}
                placeholder={placeholder || (isRTL ? 'ضع رابط الصورة https://...' : 'Paste image URL https://...')}
                className="flex-1 min-w-0 bg-zinc-950 border border-zinc-700 px-3 py-2 text-xs text-white placeholder:text-zinc-500 rounded-lg focus:outline-none focus:border-amber-400 font-mono transition-colors"
              />
              <button
                type="button"
                onClick={() => handleApplyUrl()}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer shadow-md"
              >
                {isRTL ? 'تطبيق الرابط' : 'Apply'}
              </button>
            </div>
          </div>
        )}
      </div>

      {helpText && <p className="text-[11px] text-zinc-400 font-mono">{helpText}</p>}

      {/* Image Preview */}
      {value && (
        <div className="relative group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl mt-3">
          <div className={`${aspectClass} w-full overflow-hidden bg-black/40 flex items-center justify-center`}>
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
            <span className="text-[10px] text-zinc-300 truncate max-w-[70%] font-mono bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
              {value.startsWith('data:') ? 'Local Image' : value}
            </span>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-1 text-[11px] font-bold"
              title={isRTL ? 'حذف الصورة' : 'Remove image'}
            >
              <X className="w-3.5 h-3.5" />
              <span>{isRTL ? 'حذف' : 'Remove'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

