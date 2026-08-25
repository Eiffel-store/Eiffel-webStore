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
  const { t } = useLanguage();
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
    onSuccess(t.adminBackupExportSuccess);
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
          onSuccess(t.adminDatabaseRestoreSuccess);
          setTimeout(() => window.location.reload(), 1000);
        } else {
          onError(t.adminInvalidBackupFile);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetFactory = () => {
    resetAllToDefault();
    setShowResetConfirm(false);
    onSuccess(t.adminResetDefaultSuccess);
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-6 shadow-xl">
      <div className="pb-2 border-b border-zinc-800">
        <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Download className="w-4 h-4 text-blue-400" />
          <span>{t.adminBackupRestoreSection}</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          {t.adminBackupRestoreDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Export Card */}
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
              <Download className="w-4 h-4 text-blue-400" />
              <span>{t.adminExportBackup}</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              {t.adminExportBackupDesc}
            </p>
          </div>
          <button
            onClick={handleExportBackup}
            className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono font-bold border border-zinc-700 transition-colors cursor-pointer"
          >
            {t.adminDownloadBackupJson}
          </button>
        </div>

        {/* Import Card */}
        <div className="p-4 bg-zinc-900/60 border border-zinc-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>{t.adminRestoreBackup}</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              {t.adminRestoreBackupDesc}
            </p>
          </div>
          <label className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono font-bold border border-zinc-700 transition-colors text-center cursor-pointer block">
            {t.adminSelectBackupFile}
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
              <span>{t.adminFactoryReset}</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              {t.adminFactoryResetDesc}
            </p>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-2 bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-mono font-bold border border-red-800 transition-colors cursor-pointer"
          >
            {t.adminResetStore}
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
                {t.adminConfirmFactoryResetTitle}
              </h3>
            </div>
            <p className="text-xs text-zinc-300">
              {t.adminConfirmFactoryResetDesc}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700 cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleResetFactory}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                {t.adminYesResetDefault}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
