import React from 'react';
import { Skeleton } from './Skeleton';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col bg-surface dark:bg-zinc-950 border border-surface-container dark:border-zinc-850 p-2 sm:p-2.5 rounded-sm">
      {/* 3:4 Aspect Ratio Product Image Skeleton */}
      <div className="relative aspect-[3/4] w-full mb-3 overflow-hidden rounded-sm">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Product Category & Brand Tag Skeleton */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <Skeleton className="w-16 h-3 rounded" />
        <Skeleton className="w-10 h-3 rounded" />
      </div>

      {/* Title Skeleton */}
      <Skeleton className="w-4/5 h-4 mb-2 rounded" />

      {/* Price & Rating Row Skeleton */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-surface-container dark:border-zinc-850/60">
        <Skeleton className="w-20 h-4 rounded" />
        <div className="flex gap-1">
          <Skeleton variant="circular" className="w-3.5 h-3.5" />
          <Skeleton variant="circular" className="w-3.5 h-3.5" />
          <Skeleton variant="circular" className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
