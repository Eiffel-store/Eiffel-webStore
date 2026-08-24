import React from 'react';
import { RefreshCw, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useLanguage } from '@/shared';
import { OtpSixDigitInput } from './OtpSixDigitInput';

interface ForgotPasswordStepOtpProps {
  digits: string[];
  onDigitsChange: (digits: string[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBackToEmail: () => void;
  onResendOtp: () => void;
  resendTimer: number;
  canResend: boolean;
  isLoading: boolean;
}

export const ForgotPasswordStepOtp: React.FC<ForgotPasswordStepOtpProps> = ({
  digits,
  onDigitsChange,
  onSubmit,
  onBackToEmail,
  onResendOtp,
  resendTimer,
  canResend,
  isLoading,
}) => {
  const { t, isRTL } = useLanguage();
  const isComplete = digits.join('').length === 6;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <OtpSixDigitInput digits={digits} onChange={onDigitsChange} disabled={isLoading} />

      {/* Resend OTP Section */}
      <div className="flex items-center justify-between text-xs text-zinc-400 pt-2">
        <button
          type="button"
          onClick={onBackToEmail}
          className="hover:text-white transition-colors flex items-center gap-1 text-[11px]"
        >
          {isRTL ? <ArrowRight className="w-3 h-3" /> : <ArrowLeft className="w-3 h-3" />}
          <span>{t.changeEmail}</span>
        </button>

        <div>
          {canResend ? (
            <button
              type="button"
              onClick={onResendOtp}
              disabled={isLoading}
              className="text-amber-400 hover:text-amber-300 font-label-bold flex items-center gap-1 text-[11px] cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{t.resendOtp}</span>
            </button>
          ) : (
            <span className="font-mono text-[11px] text-zinc-500">
              {t.resendOtpIn} {resendTimer}s
            </span>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !isComplete}
        className="w-full py-3 bg-amber-400 text-black font-label-bold text-xs tracking-widest uppercase hover:bg-amber-300 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-4 cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{t.verifying}</span>
          </>
        ) : (
          <>
            <span>{t.verifyOtp}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>
    </form>
  );
};
