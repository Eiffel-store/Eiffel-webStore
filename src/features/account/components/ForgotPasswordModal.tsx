import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, KeyRound, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Loader2, X, RefreshCw, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { authService } from '@/services/authService';
import { useLanguage } from '@/shared';
import toast from 'react-hot-toast';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  onSuccessLogin?: (email: string) => void;
}

type FlowStep = 'EMAIL' | 'OTP' | 'PASSWORD' | 'SUCCESS';

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialEmail = '',
  onSuccessLogin,
}) => {
  const { t, isRTL } = useLanguage();

  const [step, setStep] = useState<FlowStep>('EMAIL');
  const [email, setEmail] = useState(initialEmail);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resend OTP Countdown
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail || '');
      setStep('EMAIL');
      setOtpDigits(['', '', '', '', '', '']);
      setNewPassword('');
      setConfirmPassword('');
      setError(null);
      setResendTimer(60);
      setCanResend(false);
    }
  }, [isOpen, initialEmail]);

  // Countdown timer effect
  useEffect(() => {
    let interval: any;
    if (step === 'OTP' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  const currentOtp = otpDigits.join('');

  // 1. Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError(isRTL ? 'يرجى إدخال البريد الإلكتروني أو الهاتف' : 'Please enter your email or phone');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.forgotPassword(email.trim());
      toast.success(t.otpSentSuccess);
      setStep('OTP');
      setResendTimer(60);
      setCanResend(false);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || (isRTL ? 'فشل إرسال رمز التحقق' : 'Failed to send OTP');
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      await authService.forgotPassword(email.trim());
      toast.success(t.otpSentSuccess);
      setResendTimer(60);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || (isRTL ? 'فشل إعادة الإرسال' : 'Failed to resend OTP');
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Input Handling
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      const nextFocus = Math.min(pasted.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
      return;
    }

    const singleDigit = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = singleDigit;
    setOtpDigits(newDigits);

    if (singleDigit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // 2. Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentOtp.length !== 6) {
      setError(isRTL ? 'يجب إدخال رمز التحقق كاملاً (6 أرقام)' : 'Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.verifyOtp(email.trim(), currentOtp);
      toast.success(t.otpVerifiedSuccess);
      setStep('PASSWORD');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || (isRTL ? 'رمز التحقق غير صحيح' : 'Invalid OTP code');
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setError(isRTL ? 'كلمة المرور يجب ألا تقل عن 6 أحرف' : 'Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.resetPassword({
        email: email.trim(),
        otp: currentOtp,
        newPassword: newPassword,
      });

      toast.success(t.passwordResetSuccess);
      setStep('SUCCESS');

      setTimeout(() => {
        onSuccessLogin?.(email);
        onClose();
      }, 2500);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || (isRTL ? 'فشل إعادة تعيين كلمة المرور' : 'Failed to reset password');
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 25;
    if (pass.length >= 10) score += 25;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const strengthScore = getPasswordStrength(newPassword);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-lg bg-zinc-950 text-white border border-zinc-800 shadow-2xl p-6 sm:p-8 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-zinc-400 hover:text-white transition-colors p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-3 text-amber-400">
            {step === 'EMAIL' && <Mail className="w-6 h-6" />}
            {step === 'OTP' && <KeyRound className="w-6 h-6" />}
            {step === 'PASSWORD' && <Lock className="w-6 h-6" />}
            {step === 'SUCCESS' && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
          </div>

          <span className="font-mono text-[10px] tracking-widest text-amber-400 uppercase">
            EIFFEL SECURITY • OTP FLOW
          </span>

          <h2 className="font-editorial text-2xl text-white mt-1">
            {step === 'EMAIL' && t.forgotPasswordTitle}
            {step === 'OTP' && t.enterOtpTitle}
            {step === 'PASSWORD' && t.newPasswordTitle}
            {step === 'SUCCESS' && (isRTL ? 'تمت العملية بنجاح' : 'Password Updated!')}
          </h2>

          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            {step === 'EMAIL' && t.forgotPasswordSubtitle}
            {step === 'OTP' && `${t.enterOtpSubtitle}: ${email}`}
            {step === 'PASSWORD' && t.newPasswordSubtitle}
            {step === 'SUCCESS' && t.passwordResetSuccess}
          </p>
        </div>

        {/* Step Indicator */}
        {step !== 'SUCCESS' && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 'EMAIL' ? 'w-8 bg-amber-400' : 'w-3 bg-amber-400/40'}`} />
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 'OTP' ? 'w-8 bg-amber-400' : step === 'PASSWORD' ? 'w-3 bg-amber-400/40' : 'w-3 bg-zinc-800'}`} />
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 'PASSWORD' ? 'w-8 bg-amber-400' : 'w-3 bg-zinc-800'}`} />
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: REQUEST EMAIL */}
        {step === 'EMAIL' && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-[11px] font-label-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                {isRTL ? 'البريد الإلكتروني أو الهاتف المسجل' : 'Registered Email / Phone'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
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
        )}

        {/* STEP 2: ENTER OTP */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="flex justify-center gap-2 sm:gap-3 dir-ltr" dir="ltr">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpInputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-mono font-bold bg-zinc-900 border border-zinc-700 text-amber-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all rounded"
                />
              ))}
            </div>

            {/* Resend OTP Section */}
            <div className="flex items-center justify-between text-xs text-zinc-400 pt-2">
              <button
                type="button"
                onClick={() => setStep('EMAIL')}
                className="hover:text-white transition-colors flex items-center gap-1 text-[11px]"
              >
                {isRTL ? <ArrowRight className="w-3 h-3" /> : <ArrowLeft className="w-3 h-3" />}
                <span>{isRTL ? 'تعديل البريد' : 'Change email'}</span>
              </button>

              <div>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
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
              disabled={isLoading || currentOtp.length !== 6}
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
        )}

        {/* STEP 3: SET NEW PASSWORD */}
        {step === 'PASSWORD' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
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
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError(null);
                  }}
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

              {/* Strength Meter */}
              {newPassword && (
                <div className="mt-2">
                  <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strengthScore <= 25
                          ? 'w-1/4 bg-red-500'
                          : strengthScore <= 50
                          ? 'w-2/4 bg-amber-500'
                          : strengthScore <= 75
                          ? 'w-3/4 bg-sky-500'
                          : 'w-full bg-emerald-500'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                    <span>{isRTL ? 'قوة كلمة المرور' : 'Strength'}</span>
                    <span>
                      {strengthScore <= 25 && (isRTL ? 'ضعيفة' : 'Weak')}
                      {strengthScore > 25 && strengthScore <= 50 && (isRTL ? 'متوسطة' : 'Fair')}
                      {strengthScore > 50 && strengthScore <= 75 && (isRTL ? 'جيدة' : 'Good')}
                      {strengthScore > 75 && (isRTL ? 'قوية جداً 🔒' : 'Strong 🔒')}
                    </span>
                  </div>
                </div>
              )}
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
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError(null);
                  }}
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
        )}

        {/* STEP 4: SUCCESS */}
        {step === 'SUCCESS' && (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <p className="text-sm font-medium text-emerald-300">
              {t.passwordResetSuccess}
            </p>
            <p className="text-xs text-zinc-500 font-mono">
              {isRTL ? 'جاري تحويلك لتسجيل الدخول فوراً...' : 'Redirecting to login...'}
            </p>
          </div>
        )}

        {/* Bottom Back to Login Link */}
        {step !== 'SUCCESS' && (
          <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] font-mono text-zinc-500 hover:text-white transition-colors"
            >
              {t.backToLogin}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
