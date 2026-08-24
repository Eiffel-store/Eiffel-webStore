import React from 'react';
import { useLanguage } from '@/shared';

interface AuthBrandHeaderProps {
  mode: 'login' | 'register';
}

export const AuthBrandHeader: React.FC<AuthBrandHeaderProps> = ({ mode }) => {
  const { t } = useLanguage();

  return (
    <div className="text-center pb-6 border-b border-surface-container dark:border-zinc-800">
      <span className="font-mono text-[10px] tracking-widest text-secondary dark:text-zinc-400 uppercase">
        EIFFEL CLIENT PRIVÉ
      </span>
      <h1 className="font-editorial text-2xl sm:text-3xl text-primary dark:text-white mt-1">
        {mode === 'login' ? t.clientSignIn : t.createAccount}
      </h1>
      <p className="text-xs text-secondary dark:text-zinc-400 mt-1">
        {t.authSubtitle}
      </p>
    </div>
  );
};
