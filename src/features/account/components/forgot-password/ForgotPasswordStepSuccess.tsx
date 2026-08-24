import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/shared';

export const ForgotPasswordStepSuccess: React.FC = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="py-6 text-center space-y-4">
      <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <p className="text-sm font-medium text-emerald-300">{t.passwordResetSuccess}</p>
      <p className="text-xs text-zinc-500 font-mono">
        {t.redirectingToLogin}
      </p>
    </div>
  );
};
