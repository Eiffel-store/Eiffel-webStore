import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User as UserIcon, Phone, ArrowRight, ShieldCheck, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLanguage } from '@/shared';

export const CustomerAuthView: React.FC = () => {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const { login, register, isLoading, error, clearError } = useAuthStore();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMsg(null);

    try {
      if (mode === 'login') {
        const res = await login({ email, password });
        if (res.role === 'ROLE_ADMIN' || res.role === 'ROLE_STAFF') {
          navigate('/admin');
        }
      } else {
        await register({ name, email, password, phone });
        setSuccessMsg(isRTL ? 'تم إنشاء حسابك بنجاح! جاري تسجيل الدخول...' : 'Account created successfully!');
      }
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    clearError();
    try {
      const res = await login({ email: demoEmail, password: demoPass });
      if (res.role === 'ROLE_ADMIN' || res.role === 'ROLE_STAFF') {
        navigate('/admin');
      }
    } catch (err) {
      console.error('Demo login error:', err);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white dark:bg-zinc-950 border border-surface-container dark:border-zinc-800 p-6 sm:p-8 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center pb-6 border-b border-surface-container dark:border-zinc-800">
          <span className="font-mono text-[10px] tracking-widest text-secondary dark:text-zinc-400 uppercase">
            EIFFEL CLIENT PRIVÉ
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl text-primary dark:text-white mt-1">
            {mode === 'login'
              ? (isRTL ? 'تسجيل دخول العملاء' : 'Client Sign In')
              : (isRTL ? 'إنشاء حساب جديد' : 'Create an Account')}
          </h1>
          <p className="text-xs text-secondary dark:text-zinc-400 mt-1">
            {isRTL ? 'تمتع بتجربة تسوق راقية مع الشحن السريع في مصر' : 'Bespoke architectural luxury across Egypt'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 my-6 p-1 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800">
          <button
            type="button"
            onClick={() => { setMode('login'); clearError(); }}
            className={`py-2 text-xs font-label-bold tracking-wider uppercase transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-zinc-800 text-primary dark:text-white shadow-sm'
                : 'text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white'
            }`}
          >
            {isRTL ? 'تسجيل الدخول' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); clearError(); }}
            className={`py-2 text-xs font-label-bold tracking-wider uppercase transition-all ${
              mode === 'register'
                ? 'bg-white dark:bg-zinc-800 text-primary dark:text-white shadow-sm'
                : 'text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white'
            }`}
          >
            {isRTL ? 'حساب جديد' : 'Register'}
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-[11px] font-label-bold uppercase tracking-wider text-secondary dark:text-zinc-400 mb-1.5">
                  {isRTL ? 'الاسم بالكامل' : 'Full Name'}
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isRTL ? 'طارق منصور' : 'Tarek Mansour'}
                    className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2.5 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 text-xs text-primary dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary dark:focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-label-bold uppercase tracking-wider text-secondary dark:text-zinc-400 mb-1.5">
                  {isRTL ? 'رقم الهاتف (مصر)' : 'Phone Number (Egypt)'}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-zinc-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+20 100 123 4567"
                    className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2.5 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 text-xs text-primary dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary dark:focus:border-white transition-colors font-mono"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-label-bold uppercase tracking-wider text-secondary dark:text-zinc-400 mb-1.5">
              {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@eiffel.com"
                className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2.5 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 text-xs text-primary dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary dark:focus:border-white transition-colors font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-label-bold uppercase tracking-wider text-secondary dark:text-zinc-400 mb-1.5">
              {isRTL ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-zinc-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2.5 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 text-xs text-primary dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary dark:focus:border-white transition-colors font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md mt-6 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isRTL ? 'جاري التحقق...' : 'Verifying...'}</span>
              </>
            ) : (
              <>
                <span>{mode === 'login' ? (isRTL ? 'دخول فوري' : 'Sign In') : (isRTL ? 'تأكيد التسجيل' : 'Create Account')}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div className="mt-8 pt-6 border-t border-surface-container dark:border-zinc-800">
          <span className="block text-center text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-3">
            {isRTL ? 'حسابات التجربة السريعة (Demo Quick Fill)' : 'Fast Demo Accounts'}
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('client@eiffel.com', 'client123')}
              className="px-2 py-1.5 bg-surface-container-low dark:bg-zinc-900 hover:bg-zinc-800 border border-surface-container dark:border-zinc-800 text-[10px] font-mono text-primary dark:text-zinc-300 transition-colors"
            >
              عميل (Client)
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('staff@eiffel.com', 'staff123')}
              className="px-2 py-1.5 bg-surface-container-low dark:bg-zinc-900 hover:bg-zinc-800 border border-surface-container dark:border-zinc-800 text-[10px] font-mono text-primary dark:text-zinc-300 transition-colors"
            >
              موظف (Staff)
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@eiffel.com', 'admin123')}
              className="px-2 py-1.5 bg-surface-container-low dark:bg-zinc-900 hover:bg-zinc-800 border border-surface-container dark:border-zinc-800 text-[10px] font-mono text-primary dark:text-zinc-300 transition-colors"
            >
              أدمن (Admin)
            </button>
          </div>
        </div>

        {/* Admin Login Shortcut */}
        <div className="mt-6 text-center">
          <Link
            to="/admin/login"
            className="text-[11px] font-mono text-zinc-400 hover:text-primary dark:hover:text-white flex items-center justify-center gap-1 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{isRTL ? 'الدخول كمسؤول إدارة النظام (Admin Panel)' : 'Executive Staff Login'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
