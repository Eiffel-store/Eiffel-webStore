import React, { useState } from 'react';
import { ShoppingBag, Upload, Loader2 } from 'lucide-react';
import { ShopTheLookSettings } from '@/types';
import { useLanguage } from '@/shared';
import { uploadService } from '@/services/uploadService';

interface AdminShopLookFormProps {
  shopLook: ShopTheLookSettings;
  onChange: (look: ShopTheLookSettings) => void;
}

export const AdminShopLookForm: React.FC<AdminShopLookFormProps> = ({
  shopLook,
  onChange
}) => {
  const { isRTL } = useLanguage();
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      if (res?.fileUrl) {
        onChange({ ...shopLook, imageUrl: res.fileUrl });
        return;
      }
      throw new Error('No URL returned');
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onChange({ ...shopLook, imageUrl: reader.result });
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
    onChange({ ...shopLook, imageUrl: urlInput.trim() });
    setUrlInput('');
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-6 shadow-xl">
      <div className="pb-3 border-b border-zinc-800 flex items-center justify-between">
        <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-purple-400" />
          <span>{isRTL ? '3. قسم تنسيق الإطلالة (Shop The Look)' : '3. Shop The Look Editorial'}</span>
        </h2>
        <span className="text-[11px] text-zinc-500 font-mono">
          {isRTL ? 'يظهر في أسفل الصفحة الرئيسية قبل الفوتر' : 'Displays near bottom of the homepage'}
        </span>
      </div>

      {/* Media Upload & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-5 relative aspect-[3/4] bg-zinc-900 border border-zinc-800 overflow-hidden">
          <img
            src={shopLook.imageUrl}
            alt="Shop The Look Preview"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="lg:col-span-7 space-y-3">
          <label className="block text-xs text-zinc-300 font-bold">
            {isRTL ? 'صورة الموديل الرئيسية (Editorial Model Image)' : 'Editorial Model Image'}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-dashed border-zinc-700 text-xs font-medium cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>{isRTL ? 'رفع صورة من الجهاز' : 'Upload from Device'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div className="flex gap-1.5">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={isRTL ? 'أو ضع رابط صورة مباشر...' : 'Or paste image URL...'}
                className="flex-1 bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium border border-zinc-700 transition-colors"
              >
                {isRTL ? 'تطبيق' : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Headings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1">
            {isRTL ? 'عنوان القسم (عربي)' : 'Title (Arabic)'}
          </label>
          <input
            type="text"
            value={shopLook.titleAr}
            onChange={(e) => onChange({ ...shopLook, titleAr: e.target.value })}
            placeholder="تسوق الإطلالة"
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1">
            {isRTL ? 'عنوان القسم (إنجليزي)' : 'Title (English)'}
          </label>
          <input
            type="text"
            value={shopLook.titleEn}
            onChange={(e) => onChange({ ...shopLook, titleEn: e.target.value })}
            placeholder="SHOP THE COMPLETE LOOK"
            className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
          />
        </div>
      </div>
    </div>
  );
};
