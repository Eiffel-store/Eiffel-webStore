import React, { useState, useEffect } from 'react';
import { Mail, Lock, KeyRound, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { authService } from '@/services/authService';
import { useLanguage } from '@/shared';
import toast from 'react-hot-toast';
import {
  ForgotPasswordStepEmail,
  ForgotPasswordStepOtp,
  ForgotPasswordStepNewPassword,
  ForgotPasswordStepSuccess,
} from './forgot-password';

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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resend OTP Countdown State
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

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

  // Step 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError(t.emailOrPhone);
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
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || t.invalidOrExpiredOtp;
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
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || t.invalidOrExpiredOtp;
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentOtp.length !== 6) {
      setError(t.enterFullSixDigits);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.verifyOtp(email.trim(), currentOtp);
      toast.success(t.otpVerifiedSuccess);
      setStep('PASSWORD');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || t.invalidOrExpiredOtp;
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setError(t.passwordMinLength);
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
      }, 2200);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || t.invalidOrExpiredOtp;
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-lg bg-zinc-950 text-white border border-zinc-800 shadow-2xl p-6 sm:p-8 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-zinc-400 hover:text-white transition-colors p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
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
            {step === 'SUCCESS' && t.operationSuccessful}
          </h2>

          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            {step === 'EMAIL' && t.forgotPasswordSubtitle}
            {step === 'OTP' && `${t.enterOtpSubtitle}: ${email}`}
            {step === 'PASSWORD' && t.newPasswordSubtitle}
            {step === 'SUCCESS' && t.passwordResetSuccess}
          </p>
        </div>

        {/* Progress Step Indicator */}
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

        {/* Step Views */}
        {step === 'EMAIL' && (
          <ForgotPasswordStepEmail
            email={email}
            onEmailChange={(val) => {
              setEmail(val);
              setError(null);
            }}
            onSubmit={handleRequestOtp}
            isLoading={isLoading}
          />
        )}

        {step === 'OTP' && (
          <ForgotPasswordStepOtp
            digits={otpDigits}
            onDigitsChange={setOtpDigits}
            onSubmit={handleVerifyOtp}
            onBackToEmail={() => setStep('EMAIL')}
            onResendOtp={handleResendOtp}
            resendTimer={resendTimer}
            canResend={canResend}
            isLoading={isLoading}
          />
        )}

        {step === 'PASSWORD' && (
          <ForgotPasswordStepNewPassword
            newPassword={newPassword}
            onNewPasswordChange={(val) => {
              setNewPassword(val);
              setError(null);
            }}
            confirmPassword={confirmPassword}
            onConfirmPasswordChange={(val) => {
              setConfirmPassword(val);
              setError(null);
            }}
            onSubmit={handleResetPassword}
            isLoading={isLoading}
          />
        )}

        {step === 'SUCCESS' && <ForgotPasswordStepSuccess />}

        {/* Back to Login Footer */}
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
