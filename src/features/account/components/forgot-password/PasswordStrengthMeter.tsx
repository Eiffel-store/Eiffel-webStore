import React from 'react';
import { useLanguage } from '@/shared';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const { isRTL } = useLanguage();

  if (!password) return null;

  const calculateScore = (pass: string): number => {
    let score = 0;
    if (pass.length >= 6) score += 25;
    if (pass.length >= 10) score += 25;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const score = calculateScore(password);

  const getLabel = () => {
    if (score <= 25) return isRTL ? 'ضعيفة' : 'Weak';
    if (score <= 50) return isRTL ? 'متوسطة' : 'Fair';
    if (score <= 75) return isRTL ? 'جيدة' : 'Good';
    return isRTL ? 'قوية جداً 🔒' : 'Strong 🔒';
  };

  const getColorClass = () => {
    if (score <= 25) return 'w-1/4 bg-red-500';
    if (score <= 50) return 'w-2/4 bg-amber-500';
    if (score <= 75) return 'w-3/4 bg-sky-500';
    return 'w-full bg-emerald-500';
  };

  return (
    <div className="mt-2">
      <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-300 ${getColorClass()}`} />
      </div>
      <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
        <span>{isRTL ? 'قوة كلمة المرور' : 'Strength'}</span>
        <span>{getLabel()}</span>
      </div>
    </div>
  );
};
