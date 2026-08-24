import React from 'react';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useLanguage } from '@/shared';

interface CustomerLoginFormProps {
  email: string;
  onEmailChange: (val: string) => void;
  password: string;
  onPasswordChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPasswordClick: () => void;
  isLoading: boolean;
}

export const CustomerLoginForm: React.FC<CustomerLoginFormProps> = ({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  onSubmit,
  onForgotPasswordClick,
  isLoading,
}) => {
  const { t, isRTL } = useLanguage();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-[11px] font-label-bold uppercase tracking-wider text-secondary dark:text-zinc-400 mb-1.5">
          {isRTL ? 'البريد الإلكتروني أو رقم الهاتف' : 'Email or Mobile Phone'}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            required
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder={isRTL ? 'client@eiffel.com أو 010...' : 'client@eiffel.com or 010...'}
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2.5 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 text-xs text-primary dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary dark:focus:border-white transition-colors font-mono"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-[11px] font-label-bold uppercase tracking-wider text-secondary dark:text-zinc-400">
            {t.password}
          </label>
          <button
            type="button"
            onClick={onForgotPasswordClick}
            className="text-[11px] font-mono text-zinc-500 hover:text-amber-500 transition-colors"
          >
            {t.forgotPasswordPrompt}
          </button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2.5 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 text-xs text-primary dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary dark:focus:border-white transition-colors font-mono"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md mt-6 disabled:opacity-50 cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{t.verifying}</span>
          </>
        ) : (
          <>
            <span>{t.instantLogin}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>
    </form>
  );
};
