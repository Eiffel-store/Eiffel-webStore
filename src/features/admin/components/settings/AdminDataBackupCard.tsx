import React, { useState } from 'react';
import { Download, Upload, RefreshCw, AlertCircle } from 'lucide-react';
import { useStoreData, useLanguage } from '@/shared';

interface AdminDataBackupCardProps {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export const AdminDataBackupCard: React.FC<AdminDataBackupCardProps> = ({
  onSuccess,
  onError
}) => {
  const { exportData, importData, resetAllToDefault } = useStoreData();
  const { isRTL } = useLanguage();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleExportBackup = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eiffel_store_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onSuccess(isRTL ? 'تم تصدير النسخة الاحتياطية بنجاح!' : 'Backup exported successfully!');
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
          onSuccess(isRTL ? 'تم استيراد قاعدة البيانات بنجاح!' : 'Database restored successfully!');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          onError(isRTL ? 'الملف غير صالح أو تالف.' : 'Invalid backup file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetFactory = () => {
    resetAllToDefault();
    setShowResetConfirm(false);
    onSuccess(isRTL ? 'تمت استعادة الإعدادات الافتراضية بنجاح!' : 'Reset to default data completed!');
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-6 shadow-xl">
      <div className="pb-2 border-b border-zinc-800">
        <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Download className="w-4 h-4 text-blue-400" />
          <span>{isRTL ? '4. النسخ الاحتياطي واستعادة البيانات (Backup & Restore)' : '4. Database Backup & Restore'}</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          {isRTL
            ? 'احفظ نسخة من كافة المنتجات والفروع والعروض والطلبات على جهازك واستعدها في أي وقت.'
            : 'Export or import your entire store database as a JSON file.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Export Card */}
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
              <Download className="w-4 h-4 text-blue-400" />
              <span>{isRTL ? 'تصدير نسخة احتياطية' : 'Export JSON Backup'}</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              {isRTL ? 'تنزيل ملف JSON يحتوي على كافة بيانات المتجر.' : 'Download complete snapshot of catalog and settings.'}
            </p>
          </div>
          <button
            onClick={handleExportBackup}
            className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono font-bold border border-zinc-700 transition-colors"
          >
            {isRTL ? 'تنزيل ملف النسخة (JSON)' : 'Download Backup'}
          </button>
        </div>

        {/* Import Card */}
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>{isRTL ? 'استيراد نسخة سابقة' : 'Restore from JSON'}</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              {isRTL ? 'رفع ملف JSON تم تنزيله مسبقاً لاستعادة البيانات.' : 'Upload a previously exported backup file.'}
            </p>
          </div>
          <label className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono font-bold border border-zinc-700 transition-colors text-center cursor-pointer block">
            {isRTL ? 'اختيار ملف الاستيراد' : 'Select Backup File'}
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>

        {/* Factory Reset */}
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-red-400 flex items-center gap-1.5 mb-1">
              <RefreshCw className="w-4 h-4" />
              <span>{isRTL ? 'إعادة الضبط الافتراضي' : 'Factory Reset'}</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              {isRTL ? 'إرجاع المتجر للكتالوج والبيانات الأولية الأصلية.' : 'Reset all products and branches to default.'}
            </p>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-2 bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-mono font-bold border border-red-800 transition-colors"
          >
            {isRTL ? 'إعادة ضبط المتجر' : 'Reset to Default'}
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-red-800 max-w-sm w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-sm text-white">
                {isRTL ? 'تأكيد استعادة الضبط الافتراضي؟' : 'Confirm Factory Reset?'}
              </h3>
            </div>
            <p className="text-xs text-zinc-300">
              {isRTL
                ? 'سيتم مسح كافة التعديلات والمنتجات الجديدة وإرجاع الكتالوج الأصلي. هل تريد الاستمرار؟'
                : 'This will revert all products, branches and coupons to their initial demo state.'}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleResetFactory}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                {isRTL ? 'نعم، استعد الافتراضي' : 'Reset All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
