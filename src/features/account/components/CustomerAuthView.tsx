import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLanguage } from '@/shared';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import {
  AuthBrandHeader,
  AuthModeTabs,
  CustomerLoginForm,
  CustomerRegisterForm,
  AuthDemoAccountsBar,
  AccountActivationModal,
} from './auth';

export const CustomerAuthView: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { login, register, isLoading, error, clearError } = useAuthStore();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);
  const [activationEmail, setActivationEmail] = useState('');

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
        setActivationEmail(email.trim());
        setIsActivationModalOpen(true);
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
        setActivationEmail(res.email || email.trim());
        setIsActivationModalOpen(true);
      } else {
        setSuccessMsg(t.accountCreatedSuccess);
      }
    } catch (err) {
      console.error('Register error:', err);
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
        <AuthBrandHeader mode={mode} />

        {/* Tab Switcher */}
        <AuthModeTabs
          mode={mode}
          onModeChange={(newMode) => {
            setMode(newMode);
            clearError();
            setSuccessMsg(null);
          }}
        />

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

        {/* Forms */}
        {mode === 'login' ? (
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

        {/* Quick Demo Fill Buttons */}
        <AuthDemoAccountsBar onDemoSelect={handleDemoLogin} />

        {/* Admin Login Shortcut */}
        <div className="mt-6 text-center">
          <Link
            to="/admin/login"
            className="text-[11px] font-mono text-zinc-400 hover:text-primary dark:hover:text-white flex items-center justify-center gap-1 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.adminLoginPrompt}</span>
          </Link>
        </div>
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

      {/* Account Activation OTP Modal */}
      <AccountActivationModal
        isOpen={isActivationModalOpen}
        onClose={() => setIsActivationModalOpen(false)}
        email={activationEmail}
        onSuccess={() => {
          setSuccessMsg(isRTL ? 'تم تفعيل الحساب وتسجيل الدخول بنجاح!' : 'Account activated and logged in successfully!');
        }}
      />
    </div>
  );
};
