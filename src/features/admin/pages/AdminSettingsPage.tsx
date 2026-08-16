import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Download,
  Upload,
  RefreshCw,
  Check,
  AlertCircle,
  Phone,
  MessageCircle,
  Globe,
  Share2,
  KeyRound,
  DollarSign
} from 'lucide-react';
import { FacebookIcon, WhatsAppIcon } from '@/shared';
import { useStoreData } from '@/shared';
import { useAdminAuth } from '@/features/admin';
import { useLanguage } from '@/shared';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings, exportData, importData, resetAllToDefault } = useStoreData();
  const { updateAdminPin } = useAdminAuth();
  const { isRTL } = useLanguage();

  const [formSettings, setFormSettings] = useState(settings);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setError] = useState('');

  // Password update state
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMessage, setPinMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Import file
  const [importJsonText, setImportJsonText] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formSettings);
    setSuccessMessage(isRTL ? 'تم حفظ إعدادات المتجر بنجاح!' : 'Store settings updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinMessage(null);

    if (newPin !== confirmPin) {
      setPinMessage({
        type: 'error',
        text: isRTL ? 'كلمة المرور الجديدة غير متطابقة.' : 'New PIN and confirmation do not match.'
      });
      return;
    }

    const result = updateAdminPin(currentPin, newPin);
    if (result.success) {
      setPinMessage({ type: 'success', text: isRTL ? 'تم تحديث رمز الدخول بنجاح!' : 'PIN updated successfully!' });
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
    } else {
      setPinMessage({ type: 'error', text: result.message });
    }
  };

  const handleExportBackup = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eiffel_store_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importData(content);
        if (success) {
          setSuccessMessage(isRTL ? 'تم استيراد قاعدة البيانات بنجاح!' : 'Database restored successfully!');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          setError(isRTL ? 'الملف غير صالح أو تالف.' : 'Invalid backup file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-wide">
          {isRTL ? 'إعدادات المتجر والنسخ الاحتياطي' : 'Store Settings & Data Backup'}
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          {isRTL
            ? 'التحكم في أرقام وروابط التواصل، شريط الإعلانات، وحفظ نسخة احتياطية من قاعدة بيانات المتجر.'
            : 'Configure contact links, announcement text, security credentials, and JSON backup.'}
        </p>
      </div>

      {/* Global Alerts */}
      {successMessage && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 rounded animate-fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2 rounded animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Section 1: Store Contact & Social Channels */}
      <form onSubmit={handleSaveSettings} className="bg-zinc-950 border border-zinc-800 p-6 space-y-6 shadow-xl">
        <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span>{isRTL ? '1. أرقام وروابط التواصل الاجتماعي' : '1. Contact & Social Channels'}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-300 font-bold mb-1.5 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-green-500" />
              <span>{isRTL ? 'رقم الواتساب (WhatsApp)' : 'WhatsApp Number'}</span>
            </label>
            <input
              type="text"
              value={formSettings.whatsappNumber}
              onChange={(e) => setFormSettings({ ...formSettings, whatsappNumber: e.target.value })}
              placeholder="+201009326801"
              className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
            />
            <p className="text-[11px] text-zinc-500 mt-1 font-mono">
              {isRTL ? 'مربوط بزر الواتساب العائم في أسفل الموقع.' : 'Connected to floating WhatsApp CTA button.'}
            </p>
          </div>

          <div>
            <label className="block text-xs text-zinc-300 font-bold mb-1.5 flex items-center gap-1.5">
              <FacebookIcon className="w-3.5 h-3.5 fill-blue-500" />
              <span>{isRTL ? 'رابط صفحة الفيسبوك (Facebook URL)' : 'Facebook Page URL'}</span>
            </label>
            <input
              type="text"
              value={formSettings.facebookUrl}
              onChange={(e) => setFormSettings({ ...formSettings, facebookUrl: e.target.value })}
              placeholder="https://www.facebook.com/profile.php?id=..."
              className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-300 font-bold mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-zinc-400" />
              <span>{isRTL ? 'رقم الهاتف الرئيسي للخدمة' : 'Customer Service Phone'}</span>
            </label>
            <input
              type="text"
              value={formSettings.phone}
              onChange={(e) => setFormSettings({ ...formSettings, phone: e.target.value })}
              placeholder="+20 100 932 6801"
              className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-300 font-bold mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-pink-500" />
              <span>{isRTL ? 'حساب الإنستجرام (Instagram)' : 'Instagram Handle / URL'}</span>
            </label>
            <input
              type="text"
              value={formSettings.instagramUrl}
              onChange={(e) => setFormSettings({ ...formSettings, instagramUrl: e.target.value })}
              placeholder="https://instagram.com/..."
              className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white"
            />
          </div>
        </div>

        {/* Announcement Bar text */}
        <div className="pt-3 border-t border-zinc-800 space-y-3">
          <label className="block text-xs text-zinc-300 font-bold">
            {isRTL ? 'نص شريط الإعلانات العلوي في الموقع' : 'Top Announcement Bar Text'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={formSettings.announcementTextAr}
              onChange={(e) => setFormSettings({ ...formSettings, announcementTextAr: e.target.value })}
              placeholder="خصم 10% على أول طلب باستخدام الكود"
              className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white"
            />
            <input
              type="text"
              value={formSettings.announcementTextEn}
              onChange={(e) => setFormSettings({ ...formSettings, announcementTextEn: e.target.value })}
              placeholder="Complimentary Express Delivery on orders over 1000 EGP"
              className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-white text-black hover:bg-zinc-200 text-xs font-label-bold uppercase tracking-wider transition-colors shadow-lg"
          >
            {isRTL ? 'حفظ إعدادات المتجر' : 'Save Store Settings'}
          </button>
        </div>
      </form>

      {/* Section 2: Security & Password Update */}
      <form onSubmit={handleUpdatePin} className="bg-zinc-950 border border-zinc-800 p-6 space-y-4 shadow-xl">
        <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
          <KeyRound className="w-4 h-4 text-purple-400" />
          <span>{isRTL ? '2. تغيير كلمة مرور لوحة التحكم (Admin PIN)' : '2. Admin Password / PIN'}</span>
        </h2>

        {pinMessage && (
          <div
            className={`p-3 text-xs flex items-center gap-2 rounded ${
              pinMessage.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                : 'bg-red-950/60 border border-red-800 text-red-300'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{pinMessage.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-zinc-300 font-bold mb-1.5">
              {isRTL ? 'كلمة المرور الحالية' : 'Current PIN'}
            </label>
            <input
              type="password"
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
              placeholder="••••••"
              required
              className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-300 font-bold mb-1.5">
              {isRTL ? 'كلمة المرور الجديدة' : 'New PIN'}
            </label>
            <input
              type="password"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="••••••"
              required
              className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-300 font-bold mb-1.5">
              {isRTL ? 'تأكيد كلمة المرور' : 'Confirm New PIN'}
            </label>
            <input
              type="password"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              placeholder="••••••"
              required
              className="w-full bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            {isRTL ? 'تحديث كلمة المرور' : 'Update Admin PIN'}
          </button>
        </div>
      </form>

      {/* Section 3: Backup, Restore, and Reset */}
      <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-6 shadow-xl">
        <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2 pb-2 border-b border-zinc-800">
          <Download className="w-4 h-4 text-blue-400" />
          <span>{isRTL ? '3. النسخ الاحتياطي واستعادة البيانات (Backup & Restore)' : '3. Backup & Restore Database'}</span>
        </h2>

        <p className="text-xs text-zinc-400 font-light">
          {isRTL
            ? 'يمكنك تنزيل نسخة كاملة من جميع المنتجات والفروع والعروض والطلبات كملف JSON وحفظها على جهازك، أو استعادتها في أي وقت بنقرة واحدة.'
            : 'Export complete catalog, orders, and branches database to a portable JSON file, or restore existing data.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Export */}
          <button
            onClick={handleExportBackup}
            className="p-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-center rounded transition-all group"
          >
            <Download className="w-6 h-6 mx-auto mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-white">{isRTL ? 'تصدير نسخة احتياطية' : 'Export Backup (JSON)'}</div>
            <div className="text-[10px] text-zinc-500 font-mono mt-1">{isRTL ? 'تنزيل على جهازك' : 'Download database'}</div>
          </button>

          {/* Import */}
          <label className="p-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-center rounded transition-all cursor-pointer group">
            <Upload className="w-6 h-6 mx-auto mb-2 text-emerald-400 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-white">{isRTL ? 'استيراد نسخة سابقة' : 'Import / Restore JSON'}</div>
            <div className="text-[10px] text-zinc-500 font-mono mt-1">{isRTL ? 'رفع ملف JSON' : 'Upload backup file'}</div>
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>

          {/* Reset Defaults */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="p-4 bg-zinc-900 hover:bg-red-950/40 border border-zinc-700 hover:border-red-800 text-center rounded transition-all group"
          >
            <RefreshCw className="w-6 h-6 mx-auto mb-2 text-amber-400 group-hover:text-red-400 group-hover:rotate-180 transition-all duration-500" />
            <div className="text-xs font-bold text-zinc-300 group-hover:text-red-300">{isRTL ? 'استعادة الافتراضي' : 'Reset to Defaults'}</div>
            <div className="text-[10px] text-zinc-500 font-mono mt-1">{isRTL ? 'إعادة ضبط المتجر' : 'Reset factory data'}</div>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-red-900 p-6 max-w-sm w-full shadow-2xl text-center space-y-4 animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-red-950 text-red-400 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              {isRTL ? 'تأكيد إعادة ضبط المتجر' : 'Factory Reset Confirmation'}
            </h3>
            <p className="text-xs text-zinc-400">
              {isRTL
                ? 'سيتم مسح أي تعديلات قمت بها واسترجاع الكتالوج والمنتجات الـ 38 الأصلية كما كانت.'
                : 'This will reset all modified products and data back to initial Eiffel catalog.'}
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-colors"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  resetAllToDefault();
                  setShowResetConfirm(false);
                  window.location.reload();
                }}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
              >
                {isRTL ? 'تأكيد الضبط' : 'Confirm Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
