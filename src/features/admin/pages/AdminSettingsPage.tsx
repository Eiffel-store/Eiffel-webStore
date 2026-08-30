import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Check, AlertCircle } from 'lucide-react';
import { useStoreData, useLanguage } from '@/shared';
import { AdminContactSettingsForm } from '../components/settings/AdminContactSettingsForm';
import { AdminAnnouncementSettingsForm } from '../components/settings/AdminAnnouncementSettingsForm';
import { AdminLoyaltyVIPSettingsForm } from '../components/settings/AdminLoyaltyVIPSettingsForm';
import { AdminDataBackupCard } from '../components/settings/AdminDataBackupCard';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useStoreData();
  const { t } = useLanguage();

  const [formSettings, setFormSettings] = useState(settings);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setError] = useState('');

  React.useEffect(() => {
    if (settings) {
      setFormSettings(settings);
    }
  }, [settings]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formSettings);
    const msg = t.adminSettingsSavedSuccess;
    setSuccessMessage(msg);
    toast.success(msg, { id: 'store-settings-save' });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-wide">
          {t.adminSettings}
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          {t.adminSettingsDesc}
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

      {/* Section 1, 2, 3: Store Contact, Social Channels & Announcement Form */}
      <form onSubmit={handleSaveSettings} className="bg-zinc-950 border border-zinc-800 p-6 space-y-6 shadow-xl">
        <AdminContactSettingsForm
          settings={formSettings}
          onChange={(updates) => setFormSettings(prev => ({ ...prev, ...updates }))}
        />

        <AdminAnnouncementSettingsForm
          settings={formSettings}
          onChange={(updates) => setFormSettings(prev => ({ ...prev, ...updates }))}
        />

        <AdminLoyaltyVIPSettingsForm
          settings={formSettings}
          onChange={(updates) => setFormSettings(prev => ({ ...prev, ...updates }))}
        />

        <div className="flex justify-end pt-3 border-t border-zinc-800">
          <button
            type="submit"
            className="px-8 py-3 bg-white text-black hover:bg-zinc-200 text-xs font-label-bold uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{t.saveChanges}</span>
          </button>
        </div>
      </form>

      {/* JSON Backup, Restore & Factory Reset */}
      <AdminDataBackupCard
        onSuccess={(msg) => {
          setSuccessMessage(msg);
          setTimeout(() => setSuccessMessage(''), 3000);
        }}
        onError={(msg) => {
          setError(msg);
          setTimeout(() => setError(''), 3000);
        }}
      />
    </div>
  );
};
