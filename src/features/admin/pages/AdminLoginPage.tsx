import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, ArrowLeft, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useLanguage } from '@/shared';
import { ForgotPasswordModal } from '@/features/account/components/ForgotPasswordModal';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const { loginAdminWithCredentials, isAdminAuthenticated } = useAdminAuth();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin';

  React.useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAdminAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await loginAdminWithCredentials(email.trim(), password);
    setLoading(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.message);
    }
  };

  const handleQuickFill = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    setError('');
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
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-widest text-white uppercase">
            EIFFEL CONTROL
          </h1>
          <p className="text-xs text-zinc-400 mt-2 font-mono">
            {isRTL ? 'تسجيل دخول الإدارة والموظفين' : 'Executive & Staff Administration'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form with Email & Password */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-label-bold uppercase tracking-wider text-zinc-300 mb-2">
              {isRTL ? 'البريد الإلكتروني للإدارة' : 'Staff / Admin Email'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="admin@eiffel.com"
                required
                autoFocus
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-white pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-label-bold uppercase tracking-wider text-zinc-300">
                {isRTL ? 'كلمة المرور' : 'Password'}
              </label>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-[11px] font-mono text-zinc-500 hover:text-amber-400 transition-colors"
              >
                {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
                required
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-white pl-10 rtl:pl-4 rtl:pr-10 pr-10 py-3 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 rtl:right-auto rtl:left-3 top-3.5 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-white text-black font-label-bold text-xs tracking-widest uppercase hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-4 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isRTL ? 'جاري التحقق والربط...' : 'Authenticating...'}</span>
              </>
            ) : (
              <>
                <span>{isRTL ? 'دخول لوحة التحكم' : 'Authenticate & Enter'}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="mt-8 pt-6 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-3 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
            <span>{isRTL ? 'حسابات الإدارة الجاهزة (Quick Fill):' : 'Pre-configured Staff Accounts:'}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@eiffel.com', 'admin123')}
              className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left rtl:text-right transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400">👑 Admin</span>
                <span className="text-[9px] text-zinc-500 font-mono">Full</span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">admin@eiffel.com</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('staff@eiffel.com', 'staff123')}
              className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left rtl:text-right transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400">💼 Staff</span>
                <span className="text-[9px] text-zinc-500 font-mono">Ops</span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">staff@eiffel.com</p>
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-[10px] font-mono text-zinc-500">
          SECURE 256-BIT JWT ENCRYPTION • RESTRICTED ACCESS
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        initialEmail={email}
        onSuccessLogin={(resetEmail) => {
          setEmail(resetEmail);
        }}
      />
    </div>
  );
};
