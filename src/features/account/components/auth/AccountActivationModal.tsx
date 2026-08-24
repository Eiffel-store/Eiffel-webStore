import React, { useState, useEffect } from 'react';
import { X, Mail, ShieldCheck, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage, EiffelLoader } from '@/shared';
import { useAuthStore } from '@/stores/useAuthStore';
import { authService } from '@/services/authService';
import { OtpSixDigitInput } from '../forgot-password/OtpSixDigitInput';
import toast from 'react-hot-toast';

interface AccountActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onSuccess?: () => void;
}

export const AccountActivationModal: React.FC<AccountActivationModalProps> = ({
  isOpen,
  onClose,
  email,
  onSuccess,
}) => {
  const { isRTL } = useLanguage();
  const { verifyAccount } = useAuthStore();

  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Timer countdown
  useEffect(() => {
    let timer: any;
    if (isOpen && countdown > 0 && !canResend) {
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
  }, [isOpen, countdown, canResend]);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setOtpDigits(['', '', '', '', '', '']);
      setCountdown(60);
      setCanResend(false);
      setError(null);
      setIsSuccess(false);
    }
  }, [isOpen, email]);

  const currentOtp = otpDigits.join('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentOtp.length !== 6) {
      setError(isRTL ? 'يرجى إدخال رمز التحقق كاملاً (6 أرقام)' : 'Please enter the full 6-digit code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await verifyAccount(email.trim(), currentOtp);
      setIsSuccess(true);
      toast.success(isRTL ? 'تم تفعيل حسابك بنجاح! مرحباً بك في متجر إيفل' : 'Account activated successfully! Welcome to Eiffel');
      
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1200);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || (isRTL ? 'رمز التحقق غير صحيح أو منتهي' : 'Invalid or expired activation code');
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
      toast.success(isRTL ? 'تم إرسال رمز تفعيل جديد إلى بريدك الإلكتروني' : 'New activation code sent to your email');
      setCountdown(60);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || (isRTL ? 'فشل إعادة الإرسال' : 'Failed to resend code');
      setError(msg);
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-md bg-zinc-950 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden p-6 z-10 text-white animate-scale-up"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 rtl:left-auto rtl:right-4 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-bold text-amber-300 mb-2">
              {isRTL ? 'تم تفعيل الحساب بنجاح!' : 'Account Activated!'}
            </h3>
            <p className="text-xs text-zinc-400">
              {isRTL ? 'جاري توجيهك إلى حسابك...' : 'Redirecting to your account...'}
            </p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-amber-300">
                {isRTL ? 'تفعيل الحساب الجديد' : 'Activate Your Account'}
              </h3>
              <p className="text-xs text-zinc-400 mt-2 flex items-center justify-center gap-1.5 flex-wrap">
                <Mail className="w-3.5 h-3.5 text-amber-400/80 inline" />
                <span>
                  {isRTL
                    ? 'أدخل رمز التحقق (6 أرقام) المرسل إلى:'
                    : 'Enter the 6-digit code sent to:'}
                </span>
                <strong className="text-amber-200 font-mono underline">{email}</strong>
              </p>
            </div>

            {/* Error Box */}
            {error && (
              <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* OTP Form */}
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label className="block text-center text-xs font-medium text-zinc-300 mb-3">
                  {isRTL ? 'رمز التحقق (OTP)' : 'Verification Code'}
                </label>
                <OtpSixDigitInput
                  digits={otpDigits}
                  onChange={setOtpDigits}
                  disabled={isLoading}
                />
              </div>

              {/* Resend row */}
              <div className="text-center">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="text-xs text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1 font-medium disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                    {isRTL ? 'إعادة إرسال رمز التحقق' : 'Resend Code'}
                  </button>
                ) : (
                  <span className="text-xs text-zinc-500 font-mono">
                    {isRTL
                      ? `إعادة الإرسال متاحة خلال (${countdown} ثانية)`
                      : `Resend available in (${countdown}s)`}
                  </span>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading || currentOtp.length !== 6}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <EiffelLoader size="sm" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isRTL ? 'تأكيد وتفعيل الحساب' : 'Verify & Activate Account'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
