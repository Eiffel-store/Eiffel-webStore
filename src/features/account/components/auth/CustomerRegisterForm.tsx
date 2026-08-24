import React from 'react';
import { User as UserIcon, Phone, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useLanguage } from '@/shared';

interface CustomerRegisterFormProps {
  name: string;
  onNameChange: (val: string) => void;
  phone: string;
  onPhoneChange: (val: string) => void;
  email: string;
  onEmailChange: (val: string) => void;
  password: string;
  onPasswordChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const CustomerRegisterForm: React.FC<CustomerRegisterFormProps> = ({
  name,
  onNameChange,
  phone,
  onPhoneChange,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  onSubmit,
  isLoading,
}) => {
  const { t, isRTL } = useLanguage();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-[11px] font-label-bold uppercase tracking-wider text-secondary dark:text-zinc-400 mb-1.5">
          {t.fullName}
        </label>
        <div className="relative">
          <UserIcon className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            required
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Tarek Mansour"
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2.5 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 text-xs text-primary dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary dark:focus:border-white transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-label-bold uppercase tracking-wider text-secondary dark:text-zinc-400 mb-1.5">
          {t.phone}
        </label>
        <div className="relative">
          <Phone className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="+20 100 123 4567"
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2.5 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 text-xs text-primary dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary dark:focus:border-white transition-colors font-mono"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-label-bold uppercase tracking-wider text-secondary dark:text-zinc-400 mb-1.5">
          {t.emailLabel}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="client@eiffel.com"
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2.5 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 text-xs text-primary dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary dark:focus:border-white transition-colors font-mono"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-label-bold uppercase tracking-wider text-secondary dark:text-zinc-400 mb-1.5">
          {t.password}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2.5 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 text-xs text-primary dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary dark:focus:border-white transition-colors font-mono"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md mt-6 disabled:opacity-50 cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{t.verifying}</span>
          </>
        ) : (
          <>
            <span>{t.confirmRegister}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>
    </form>
  );
};
