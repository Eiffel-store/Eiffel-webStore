import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, RefreshCw, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage, EiffelLoader } from '@/shared';
import { useAuthStore } from '@/stores/useAuthStore';
import { authService } from '@/services/authService';
import { OtpSixDigitInput } from '../forgot-password/OtpSixDigitInput';
import toast from 'react-hot-toast';

interface CustomerVerifyFormProps {
  email: string;
  onSuccess?: () => void;
  onBackToRegister?: () => void;
  onBackToLogin?: () => void;
}

export const CustomerVerifyForm: React.FC<CustomerVerifyFormProps> = ({
  email,
  onSuccess,
  onBackToRegister,
  onBackToLogin,
}) => {
  const { t, isRTL } = useLanguage();
  const { verifyAccount } = useAuthStore();

  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Countdown timer for resending OTP
  useEffect(() => {
    let timer: any;
    if (countdown > 0 && !canResend) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown, canResend]);

  const currentOtp = otpDigits.join('');

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (currentOtp.length !== 6) {
      setError(t.enterFullSixDigits || 'يرجى إدخال رمز التحقق المكون من 6 أرقام');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await verifyAccount(email.trim(), currentOtp);
      setIsSuccess(true);
      toast.success(t.accountActivatedSuccess || 'تم تفعيل الحساب وتسجيل الدخول بنجاح');
      
      setTimeout(() => {
        onSuccess?.();
      }, 800);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || t.invalidOrExpiredOtp || 'رمز التحقق غير صحيح أو منتهي الصلاحية';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    setError(null);

    try {
      await authService.resendActivation(email.trim());
      toast.success(t.newActivationCodeSent || 'تم إرسال رمز تفعيل جديد إلى بريدك الإلكتروني');
      setCountdown(60);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || t.invalidOrExpiredOtp || 'تعذر إعادة إرسال الرمز';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  // Auto-submit when all 6 digits are typed
  useEffect(() => {
    if (currentOtp.length === 6 && !isLoading && !isSuccess) {
      handleVerify();
    }
  }, [currentOtp]);

  if (isSuccess) {
    return (
      <div className="text-center py-8 space-y-4 animate-fade-in">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-editorial font-bold text-primary dark:text-amber-300">
          {t.accountActivatedSuccess || 'تم تفعيل الحساب بنجاح!'}
        </h3>
        <p className="text-xs text-secondary dark:text-zinc-400">
          {t.redirectingToLogin || 'جاري نقلك إلى حسابك...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Target Email Info Box */}
      <div className="p-3.5 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 text-center space-y-1.5">
        <div className="flex items-center justify-center gap-1.5 text-secondary dark:text-zinc-400 text-xs">
          <Mail className="w-3.5 h-3.5 text-amber-500" />
          <span>{t.enterSixDigitOtp || 'تم إرسال رمز التحقق إلى:'}</span>
        </div>
        <div className="font-mono text-xs font-bold text-primary dark:text-amber-300 tracking-wide break-all">
          {email}
        </div>
        {onBackToRegister && (
          <button
            type="button"
            onClick={onBackToRegister}
            className="text-[11px] text-amber-500 hover:text-amber-400 underline transition-colors cursor-pointer block mx-auto"
          >
            {t.changeEmailPrompt}
          </button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* OTP Form */}
      <form onSubmit={handleVerify} className="space-y-6">
        <div>
          <label className="block text-center text-xs font-label-bold uppercase tracking-wider text-secondary dark:text-zinc-400 mb-3">
            {t.otpCode || 'رمز التحقق (6 أرقام)'}
          </label>
          <OtpSixDigitInput
            digits={otpDigits}
            onChange={(newDigits) => {
              setOtpDigits(newDigits);
              if (error) setError(null);
            }}
            disabled={isLoading}
          />
        </div>

        {/* Resend Countdown */}
        <div className="text-center">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-xs text-amber-500 hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 font-label-bold cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              <span>{t.resendCode || 'إعادة إرسال الرمز'}</span>
            </button>
          ) : (
            <span className="text-xs text-secondary dark:text-zinc-500 font-mono">
              {t.resendAvailableIn || 'إعادة الإرسال خلال'} ({countdown}s)
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || currentOtp.length !== 6}
          className="w-full py-3 bg-primary text-white dark:bg-amber-500 dark:text-black font-label-bold text-xs tracking-widest uppercase hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <EiffelLoader size="sm" />
              <span>{t.verifying || 'جاري التحقق...'}</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>{t.verifyAndActivate || 'تأكيد وتفعيل الحساب'}</span>
            </>
          )}
        </button>

        {/* Navigation Footers */}
        <div className="pt-2 text-center space-y-2">
          {onBackToLogin && (
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-xs text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              {isRTL ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{t.signIn}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
