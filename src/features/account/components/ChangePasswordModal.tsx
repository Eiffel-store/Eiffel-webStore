import React, { useState } from 'react';
import { KeyRound, Check, AlertCircle, X, Loader2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/shared';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const { isRTL, t } = useLanguage();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 6) {
      const msg = isRTL
        ? 'كلمة المرور الجديدة يجب ألا تقل عن 6 أحرف أو أرقام.'
        : 'New password must be at least 6 characters.';
      setMessage({ type: 'error', text: msg });
      return;
    }

    if (newPassword !== confirmPassword) {
      const msg = t.passwordMismatch;
      setMessage({ type: 'error', text: msg });
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.changePassword(currentPassword, newPassword);
      const successMsg = res.message || t.passwordResetSuccess;
      setMessage({ type: 'success', text: successMsg });
      toast.success(successMsg);
      setTimeout(() => {
        onClose();
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setMessage(null);
      }, 1500);
    } catch (err: any) {
      const errorMsg = err.message || (isRTL ? 'فشل تغيير كلمة المرور، يرجى التأكد من كلمة المرور الحالية.' : 'Failed to change password.');
      setMessage({ type: 'error', text: errorMsg });
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 text-primary dark:text-zinc-100">
        <div className="flex items-center justify-between pb-4 border-b border-surface-container dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-500 dark:text-amber-400 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-editorial text-lg text-primary dark:text-white">
                {t.changePassword}
              </h3>
              <p className="text-xs text-secondary dark:text-zinc-400 font-mono">
                {isRTL ? 'أمان حسابك مشفر ومحمي' : 'Secure & Encrypted'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {message && (
          <div
            className={`p-3 text-xs flex items-center gap-2 rounded-lg animate-fade-in ${
              message.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                : 'bg-red-950/60 border border-red-800 text-red-300'
            }`}
          >
            {message.type === 'success' ? (
              <Check className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-secondary dark:text-zinc-400 mb-1.5">
              {t.currentPassword} *
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 px-3.5 py-2.5 text-xs text-primary dark:text-white rounded-lg focus:outline-none focus:border-amber-400 font-mono tracking-widest"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-secondary dark:text-zinc-400 mb-1.5">
              {t.newPassword} *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 px-3.5 py-2.5 text-xs text-primary dark:text-white rounded-lg focus:outline-none focus:border-amber-400 font-mono tracking-widest"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-secondary dark:text-zinc-400 mb-1.5">
              {t.confirmPassword} *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-700 px-3.5 py-2.5 text-xs text-primary dark:text-white rounded-lg focus:outline-none focus:border-amber-400 font-mono tracking-widest"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white cursor-pointer"
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-label-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-amber-400/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5" />
              )}
              <span>{isLoading ? t.saving : t.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
