import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLanguage } from '@/shared';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import {
  AuthBrandHeader,
  AuthModeTabs,
  CustomerLoginForm,
  CustomerRegisterForm,
  CustomerVerifyForm,
  AccountActivationModal,
} from './auth';
import toast from 'react-hot-toast';

export type AuthMode = 'login' | 'register' | 'verify';

export const CustomerAuthView: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { login, register, isLoading, error, clearError } = useAuthStore();

  const queryMode = searchParams.get('mode') as AuthMode | null;
  const queryEmail = searchParams.get('email') || '';
  const isVerifyPath = location.pathname === '/verify-account' || location.pathname === '/activate';

  const [mode, setMode] = useState<AuthMode>(() => {
    if (isVerifyPath || queryMode === 'verify') return 'verify';
    if (queryMode === 'register') return 'register';
    return 'login';
  });

  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);
  const [activationEmail, setActivationEmail] = useState(queryEmail);

  // Form States
  const [email, setEmail] = useState(queryEmail);
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync mode and email when URL search params change
  useEffect(() => {
    if (isVerifyPath || queryMode === 'verify') {
      setMode('verify');
      if (queryEmail && !activationEmail) {
        setActivationEmail(queryEmail);
      }
    } else if (queryMode === 'register' && mode !== 'register') {
      setMode('register');
    } else if (queryMode === 'login' && mode !== 'login') {
      setMode('login');
    }
  }, [queryMode, queryEmail, isVerifyPath]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMsg(null);

    try {
      const res = await login({ email, password });
      if (res.role === 'ROLE_ADMIN' || res.role === 'ROLE_STAFF') {
        navigate('/admin');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errMsg = err.response?.data?.message || err.message || '';
      if (errMsg.includes('غير مفعّل') || errMsg.includes('تفعيل')) {
        const targetEmail = email.trim();
        setActivationEmail(targetEmail);
        setMode('verify');
        setSearchParams({ mode: 'verify', email: targetEmail });
        toast.error('الحساب غير مفعّل بعد. تم تحويلك لصفحة إدخال رمز التفعيل المرسل لبريدك.');
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMsg(null);

    try {
      const res = await register({ name, email, password, phone });
      if (res && res.requiresActivation) {
        const targetEmail = (res.email || email).trim();
        setActivationEmail(targetEmail);
        setMode('verify');
        setSearchParams({ mode: 'verify', email: targetEmail });
        toast.success(res.message || t.newActivationCodeSent || 'تم إرسال رمز التحقق إلى بريدك الإلكتروني بنجاح!');
      } else {
        setSuccessMsg(t.accountCreatedSuccess);
      }
    } catch (err: any) {
      console.error('Register error:', err);
      const errMsg = err.response?.data?.message || err.message || '';
      if (errMsg.includes('مسبقاً') || errMsg.includes('مفعل') || errMsg.includes('تفعيل')) {
        const targetEmail = email.trim();
        setActivationEmail(targetEmail);
        setMode('verify');
        setSearchParams({ mode: 'verify', email: targetEmail });
      }
    }
  };

  const handleModeChange = (newMode: 'login' | 'register') => {
    setMode(newMode);
    clearError();
    setSuccessMsg(null);
    setSearchParams({ mode: newMode });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white dark:bg-zinc-950 border border-surface-container dark:border-zinc-800 p-6 sm:p-8 shadow-2xl">
        {/* Brand Header */}
        <AuthBrandHeader mode={mode} />

        {/* Tab Switcher (Visible only in login / register modes for focused OTP input) */}
        {mode !== 'verify' && (
          <AuthModeTabs
            mode={mode}
            onModeChange={handleModeChange}
          />
        )}

        {/* Alerts */}
        {error && (
          <div className="mb-4 mt-4 p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Dedicated Views: Verify OTP vs Login vs Register */}
        <div className={mode === 'verify' ? 'mt-6' : ''}>
          {mode === 'verify' ? (
            <CustomerVerifyForm
              email={activationEmail || email}
              onSuccess={() => {
                setSuccessMsg(t.accountActivatedSuccess);
                navigate('/account');
              }}
              onBackToRegister={() => {
                setMode('register');
                setSearchParams({ mode: 'register' });
              }}
              onBackToLogin={() => {
                setMode('login');
                setSearchParams({ mode: 'login' });
              }}
            />
          ) : mode === 'login' ? (
            <CustomerLoginForm
              email={email}
              onEmailChange={setEmail}
              password={password}
              onPasswordChange={setPassword}
              onSubmit={handleLoginSubmit}
              onForgotPasswordClick={() => setIsForgotModalOpen(true)}
              isLoading={isLoading}
            />
          ) : (
            <CustomerRegisterForm
              name={name}
              onNameChange={setName}
              phone={phone}
              onPhoneChange={setPhone}
              email={email}
              onEmailChange={setEmail}
              password={password}
              onPasswordChange={setPassword}
              onSubmit={handleRegisterSubmit}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Admin Login Shortcut */}
        {mode !== 'verify' && (
          <div className="mt-6 text-center">
            <Link
              to="/admin/login"
              className="text-[11px] font-mono text-zinc-400 hover:text-primary dark:hover:text-white flex items-center justify-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.adminLoginPrompt}</span>
            </Link>
          </div>
        )}
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        initialEmail={email}
        onSuccessLogin={(resetEmail: string) => {
          setEmail(resetEmail);
          setMode('login');
        }}
      />

      {/* Standalone Modal Fallback */}
      <AccountActivationModal
        isOpen={isActivationModalOpen}
        onClose={() => setIsActivationModalOpen(false)}
        email={activationEmail || email}
        onSuccess={() => {
          setSuccessMsg(t.accountActivatedSuccess);
          setMode('login');
        }}
      />
    </div>
  );
};

export default CustomerAuthView;
