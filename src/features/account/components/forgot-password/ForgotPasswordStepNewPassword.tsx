import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
import { useLanguage } from '@/shared';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

interface ForgotPasswordStepNewPasswordProps {
  newPassword: string;
  onNewPasswordChange: (val: string) => void;
  confirmPassword: string;
  onConfirmPasswordChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const ForgotPasswordStepNewPassword: React.FC<ForgotPasswordStepNewPasswordProps> = ({
  newPassword,
  onNewPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
  onSubmit,
  isLoading,
}) => {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-[11px] font-label-bold uppercase tracking-wider text-zinc-400 mb-1.5">
          {t.newPasswordTitle}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-zinc-500" />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={newPassword}
            onChange={(e) => onNewPasswordChange(e.target.value)}
            placeholder="••••••••"
            autoFocus
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-10 py-2.5 bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors font-mono"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 rtl:right-auto rtl:left-3 top-3 text-zinc-500 hover:text-zinc-300"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <PasswordStrengthMeter password={newPassword} />
      </div>

      <div>
        <label className="block text-[11px] font-label-bold uppercase tracking-wider text-zinc-400 mb-1.5">
          {t.confirmNewPassword}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-zinc-500" />
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors font-mono"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-amber-400 text-black font-label-bold text-xs tracking-widest uppercase hover:bg-amber-300 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-4 cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{t.verifying}</span>
          </>
        ) : (
          <>
            <span>{t.resetPasswordButton}</span>
            <ShieldCheck className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};
