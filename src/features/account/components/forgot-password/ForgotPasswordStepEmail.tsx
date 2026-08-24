import React from 'react';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useLanguage } from '@/shared';

interface ForgotPasswordStepEmailProps {
  email: string;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const ForgotPasswordStepEmail: React.FC<ForgotPasswordStepEmailProps> = ({
  email,
  onEmailChange,
  onSubmit,
  isLoading,
}) => {
  const { t, isRTL } = useLanguage();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-[11px] font-label-bold uppercase tracking-wider text-zinc-400 mb-1.5">
          {t.registeredEmailOrPhone}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            required
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="client@eiffel.com"
            autoFocus
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
            <span>{t.sendOtp}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>
    </form>
  );
};
