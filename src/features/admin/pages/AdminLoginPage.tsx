import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowRight, ArrowLeft, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from '@/features/admin';
import { useLanguage } from '@/shared';

export const AdminLoginPage: React.FC = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginAdmin, isAdminAuthenticated } = useAdminAuth();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin';

  React.useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAdminAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = loginAdmin(pin);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError(isRTL ? 'رمز الدخول غير صحيح، يرجى المحاولة مرة أخرى.' : 'Invalid Admin PIN/Password. Default: 123456');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className={`min-h-screen bg-[#0A0A0B] text-zinc-100 flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden ${isRTL ? 'font-arabic' : 'font-sans'}`}>
      {/* Background Architectural Glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-zinc-700/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to store link */}
      <div className="absolute top-6 left-6 rtl:left-auto rtl:right-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{isRTL ? 'العودة للمتجر' : 'Back to Storefront'}</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 p-8 sm:p-10 shadow-2xl relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-white text-black rounded mx-auto flex items-center justify-center mb-4 shadow-lg">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-editorial text-3xl font-bold tracking-widest text-white uppercase">
            EIFFEL CONTROL
          </h1>
          <p className="text-xs text-zinc-400 mt-2 font-mono">
            {isRTL ? 'لوحة تحكم وإدارة المتجر الإلكتروني' : 'Storefront Administration Portal'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-label-bold uppercase tracking-wider text-zinc-300 mb-2">
              {isRTL ? 'رمز الدخول أو كلمة المرور (Admin PIN)' : 'Master Admin PIN / Password'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder={isRTL ? 'أدخل كلمة المرور (الافتراضي: 123456)' : 'Enter PIN (Default: 123456)'}
                required
                autoFocus
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-white px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1.5 font-mono">
              {isRTL ? 'الرمز الافتراضي: 123456 أو eiffel2026' : 'Default PIN: 123456 or eiffel2026'}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !pin}
            className="w-full py-3.5 bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed font-label-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? (
              <span className="inline-block animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
            ) : (
              <>
                <span>{isRTL ? 'تسجيل الدخول للوحة التحكم' : 'Authenticate & Enter'}</span>
                <ShieldCheck className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 text-center text-[11px] text-zinc-600 font-mono">
        EIFFEL ARCHITECTURAL TAILORING © 2026 — STORE ENGINE v2.0
      </div>
    </div>
  );
};
