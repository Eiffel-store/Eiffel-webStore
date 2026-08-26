import React from 'react';
import { Skeleton } from './Skeleton';
import { ProductGridSkeleton } from './ProductGridSkeleton';

export const HomePageSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background animate-fade-in">
      {/* 1. Hero Section Skeleton */}
      <div className="relative w-full h-[65vh] sm:h-[80vh] bg-zinc-950 overflow-hidden flex items-end p-6 sm:p-12">
        <Skeleton className="absolute inset-0 w-full h-full" />
        <div className="relative z-10 space-y-4 max-w-xl">
          <Skeleton className="w-24 h-4 rounded" />
          <Skeleton className="w-3/4 h-12 rounded" />
          <Skeleton className="w-1/2 h-6 rounded" />
          <div className="flex gap-4 pt-2">
            <Skeleton className="w-36 h-10 rounded" />
            <Skeleton className="w-36 h-10 rounded" />
          </div>
        </div>
      </div>

      {/* 2. Category Grid Skeleton */}
      <div className="max-w-[1440px] mx-auto w-full py-16 px-4 sm:px-8">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-surface-container dark:border-zinc-800">
          <Skeleton className="w-48 h-8 rounded" />
          <Skeleton className="w-20 h-4 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="aspect-[4/5] w-full rounded-sm" />
          <Skeleton className="aspect-[4/5] w-full rounded-sm" />
          <Skeleton className="aspect-[4/5] w-full rounded-sm" />
        </div>
      </div>

      {/* 3. New Arrivals Product Grid Skeleton */}
      <div className="max-w-[1440px] mx-auto w-full py-12 px-4 sm:px-8">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-surface-container dark:border-zinc-800">
          <div className="space-y-2">
            <Skeleton className="w-28 h-3 rounded" />
            <Skeleton className="w-48 h-7 rounded" />
          </div>
          <Skeleton className="w-24 h-4 rounded" />
        </div>
        <ProductGridSkeleton count={4} cols={4} />
      </div>
    </div>
  );
};

export default HomePageSkeleton;
