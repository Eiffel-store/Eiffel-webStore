import React from 'react';
import { Logo } from './Logo';
import { useLanguage } from '@/shared';

interface EiffelLoaderProps {
  fullScreen?: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const EiffelLoader: React.FC<EiffelLoaderProps> = ({
  fullScreen = false,
  message,
  size = 'md',
  className = ''
}) => {
  const { t } = useLanguage();
  const displayMsg = message || t.loadingBespokeCollection || t.loading;

  const content = (
    <div className={`flex flex-col items-center justify-center gap-4 text-center ${className}`}>
      {/* Animated Monogram Orb */}
      <div className="relative flex items-center justify-center">
        {/* Outer Rotating Glowing Ring */}
        <div className="absolute -inset-3 rounded-full border border-dashed border-amber-400/40 animate-[spin_8s_linear_infinite]" />
        
        {/* Inner Golden Pulse Ring */}
        <div className="absolute -inset-1.5 rounded-full border border-amber-500/30 animate-ping opacity-25" />

        {/* Ambient Radial Glow */}
        <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-xl scale-125 animate-pulse" />

        {/* Center Eiffel Emblem with Breathing Animation */}
        <div className="relative z-10 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] p-3 rounded-full bg-zinc-950/80 border border-zinc-800 shadow-2xl backdrop-blur-md">
          <Logo size={size === 'sm' ? 'sm' : size === 'lg' ? 'xl' : 'lg'} className="text-amber-400 dark:text-amber-300" />
        </div>
      </div>

      {/* Branded Text & Loading Line */}
      <div className="space-y-1.5 max-w-xs">
        <span className="font-editorial tracking-[0.3em] uppercase text-xs sm:text-sm font-bold text-white block">
          EIFFEL
        </span>
        <p className="text-[11px] sm:text-xs text-zinc-400 font-mono animate-pulse">
          {displayMsg}
        </p>

        {/* Shimmer Progress Line */}
        <div className="w-32 h-0.5 bg-zinc-800 rounded-full overflow-hidden mx-auto mt-2">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-[shimmer_1.5s_infinite]" />
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 min-h-screen">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full py-16 px-4 flex items-center justify-center">
      {content}
    </div>
  );
};
