import React from 'react';
import { Skeleton } from './Skeleton';
import { ProductGridSkeleton } from './ProductGridSkeleton';

export const CollectionsPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface py-8 px-4 sm:px-8 md:px-12 max-w-[1440px] mx-auto w-full animate-fade-in">
      {/* Category Banner Skeleton */}
      <div className="relative w-full h-44 sm:h-56 bg-zinc-950 rounded-sm mb-8 overflow-hidden flex flex-col justify-end p-6 sm:p-8">
        <Skeleton className="absolute inset-0 w-full h-full" />
        <div className="relative z-10 space-y-2">
          <Skeleton className="w-20 h-3 rounded" />
          <Skeleton className="w-64 h-8 rounded" />
          <Skeleton className="w-96 max-w-full h-4 rounded" />
        </div>
      </div>

      {/* Filter and Controls Bar Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 mb-8 border-y border-surface-container dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Skeleton className="w-20 h-8 rounded" />
          <Skeleton className="w-24 h-8 rounded" />
          <Skeleton className="w-24 h-8 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="w-32 h-8 rounded" />
          <Skeleton className="w-20 h-8 rounded" />
        </div>
      </div>

      {/* Product Grid Skeleton */}
      <ProductGridSkeleton count={8} cols={4} />
    </div>
  );
};

export default CollectionsPageSkeleton;
