import React, { useState } from 'react';
import { Shield, KeyRound, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/shared';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';

export const AdminSecuritySettingsForm: React.FC = () => {
  const { isRTL } = useLanguage();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (newPassword.length < 6) {
      const msg = isRTL
        ? 'كلمة المرور الجديدة يجب ألا تقل عن 6 أحرف أو أرقام.'
        : 'New password must be at least 6 characters.';
      setStatusMessage({ type: 'error', text: msg });
      return;
    }

    if (newPassword !== confirmPassword) {
      const msg = isRTL
        ? 'كلمة المرور الجديدة وتأكيدها غير متطابقين.'
        : 'New password and confirmation do not match.';
      setStatusMessage({ type: 'error', text: msg });
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.changePassword(currentPassword, newPassword);
      const successMsg = res.message || (isRTL ? 'تم تحديث كلمة المرور بنجاح!' : 'Password updated successfully!');
      setStatusMessage({ type: 'success', text: successMsg });
      toast.success(successMsg);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const errorMsg = err.message || (isRTL ? 'فشل تغيير كلمة المرور، يرجى التأكد من كلمة المرور الحالية.' : 'Failed to change password.');
      setStatusMessage({ type: 'error', text: errorMsg });
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdatePassword} className="bg-zinc-950 border border-zinc-800 p-6 space-y-6 shadow-xl">
      <div className="pb-2 border-b border-zinc-800 flex items-center justify-between">
        <h2 className="text-sm font-label-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-400" />
          <span>{isRTL ? '3. أمان الحساب وتغيير كلمة المرور' : '3. Account Security & Password'}</span>
        </h2>
        <span className="text-[11px] text-zinc-500 font-mono">
          {isRTL ? 'تشفير BCrypt آمن' : 'Encrypted & Secure'}
        </span>
      </div>

      {statusMessage && (
        <div
          className={`p-3 text-xs flex items-center gap-2 rounded animate-fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
              : 'bg-red-950/60 border border-red-800 text-red-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <Check className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5 flex items-center gap-1">
            <KeyRound className="w-3 h-3 text-zinc-500" />
            <span>{isRTL ? 'كلمة المرور الحالية *' : 'Current Password *'}</span>
          </label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white tracking-widest focus:outline-none focus:border-white font-mono"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {isRTL ? 'كلمة المرور الجديدة *' : 'New Password *'}
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white tracking-widest focus:outline-none focus:border-white font-mono"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-300 font-bold mb-1.5">
            {isRTL ? 'تأكيد كلمة المرور الجديدة *' : 'Confirm New Password *'}
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white tracking-widest focus:outline-none focus:border-white font-mono"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-label-bold uppercase tracking-wider flex items-center gap-2 border border-zinc-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <KeyRound className="w-3.5 h-3.5" />
          )}
          <span>{isRTL ? (isLoading ? 'جاري التحديث...' : 'تحديث كلمة المرور') : (isLoading ? 'Updating...' : 'Update Password')}</span>
        </button>
      </div>
    </form>
  );
};
