import React from 'react';
import { Link } from 'react-router-dom';
import { PackageOpen, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/shared';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: IconComponent = PackageOpen,
  actionText,
  actionLink,
  onAction,
  className = ''
}) => {
  const { t, isRTL } = useLanguage();

  const displayTitle = title || t.noPiecesFound;
  const displayDesc = description || t.noPiecesFoundDesc;

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className={`w-full py-16 px-6 text-center bg-zinc-950/60 border border-zinc-850 rounded-2xl flex flex-col items-center justify-center space-y-4 my-6 shadow-xl ${className}`}>
      {/* Icon Frame */}
      <div className="w-16 h-16 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-amber-400 shadow-inner">
        <IconComponent className="w-8 h-8 opacity-80 stroke-1" />
      </div>

      {/* Texts */}
      <div className="max-w-md space-y-1.5">
        <h3 className="font-editorial text-lg sm:text-xl font-bold text-white tracking-wide">
          {displayTitle}
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
          {displayDesc}
        </p>
      </div>

      {/* Action Button */}
      {(actionText && (actionLink || onAction)) && (
        <div className="pt-2">
          {actionLink ? (
            <Link
              to={actionLink}
              className="px-6 py-2.5 bg-white text-black hover:bg-zinc-200 transition-all font-label-bold text-xs uppercase tracking-wider rounded-lg shadow-lg inline-flex items-center gap-2"
            >
              <span>{actionText}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="px-6 py-2.5 bg-white text-black hover:bg-zinc-200 transition-all font-label-bold text-xs uppercase tracking-wider rounded-lg shadow-lg inline-flex items-center gap-2 cursor-pointer"
            >
              <span>{actionText}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
