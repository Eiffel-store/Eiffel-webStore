import React, { useState } from 'react';
import { Shield, KeyRound, Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/shared';
import { useAdminAuth } from '@/features/admin';

export const AdminSecuritySettingsForm: React.FC = () => {
  const { isRTL } = useLanguage();
  const { updateAdminPin } = useAdminAuth();

  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMessage, setPinMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  return (
    <form onSubmit={handleUpdatePin} className="bg-zinc-950 border border-zinc-800 p-6 space-y-6 shadow-xl">
      <div className="pb-2 border-b border-zinc-800 flex items-center justify-between">
        <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-400" />
          <span>{isRTL ? '3. أمان لوحة التحكم (تغيير رمز الدخول)' : '3. Admin Security & PIN Code'}</span>
        </h2>
        <span className="text-[11px] text-zinc-500 font-mono">
          {isRTL ? 'الافتراضي: 123456' : 'Default: 123456'}
        </span>
      </div>

      {pinMessage && (
        <div
          className={`p-3 text-xs flex items-center gap-2 rounded animate-fade-in ${
            pinMessage.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
              : 'bg-red-950/60 border border-red-800 text-red-300'
          }`}
        >
          {pinMessage.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{pinMessage.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5 flex items-center gap-1">
            <KeyRound className="w-3 h-3 text-zinc-500" />
            <span>{isRTL ? 'رمز الدخول الحالي *' : 'Current PIN *'}</span>
          </label>
          <input
            type="password"
            required
            value={currentPin}
            onChange={(e) => setCurrentPin(e.target.value)}
            placeholder="••••••"
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white tracking-widest focus:outline-none focus:border-white font-mono"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {isRTL ? 'رمز الدخول الجديد *' : 'New PIN *'}
          </label>
          <input
            type="password"
            required
            minLength={4}
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            placeholder="••••••"
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white tracking-widest focus:outline-none focus:border-white font-mono"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {isRTL ? 'تأكيد الرمز الجديد *' : 'Confirm New PIN *'}
          </label>
          <input
            type="password"
            required
            minLength={4}
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
            placeholder="••••••"
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white tracking-widest focus:outline-none focus:border-white font-mono"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-label-bold uppercase tracking-wider flex items-center gap-2 border border-zinc-700"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>{isRTL ? 'تحديث رمز الدخول' : 'Update Admin PIN'}</span>
        </button>
      </div>
    </form>
  );
};
