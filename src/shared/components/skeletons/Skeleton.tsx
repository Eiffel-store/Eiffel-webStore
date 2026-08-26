import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  ...props
}) => {
  const variantClass =
    variant === 'circular'
      ? 'rounded-full'
      : variant === 'text'
      ? 'rounded h-4 my-1'
      : 'rounded';

  return (
    <div
      className={`skeleton-shimmer bg-zinc-800/60 dark:bg-zinc-900 border border-zinc-700/20 dark:border-zinc-800/40 ${variantClass} ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
