import React from 'react';
import { Skeleton } from './Skeleton';

export const ProductDetailPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface py-10 px-4 sm:px-8 md:px-12 max-w-[1440px] mx-auto w-full animate-fade-in">
      {/* Breadcrumb Skeleton */}
      <div className="flex gap-2 mb-6">
        <Skeleton className="w-16 h-3 rounded" />
        <Skeleton className="w-4 h-3 rounded" />
        <Skeleton className="w-20 h-3 rounded" />
        <Skeleton className="w-4 h-3 rounded" />
        <Skeleton className="w-32 h-3 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Gallery Skeleton (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="aspect-[3/4] w-full rounded-sm overflow-hidden bg-zinc-950">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="flex gap-3 overflow-x-auto">
            <Skeleton className="w-20 h-24 rounded-sm shrink-0" />
            <Skeleton className="w-20 h-24 rounded-sm shrink-0" />
            <Skeleton className="w-20 h-24 rounded-sm shrink-0" />
          </div>
        </div>

        {/* Right Info Skeleton (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <Skeleton className="w-24 h-3 rounded" />
            <Skeleton className="w-4/5 h-8 rounded" />
            <Skeleton className="w-32 h-6 rounded" />
          </div>

          <div className="space-y-3 pt-4 border-t border-surface-container dark:border-zinc-800">
            <Skeleton className="w-24 h-4 rounded" />
            <div className="flex gap-2">
              <Skeleton variant="circular" className="w-8 h-8" />
              <Skeleton variant="circular" className="w-8 h-8" />
              <Skeleton variant="circular" className="w-8 h-8" />
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-surface-container dark:border-zinc-800">
            <Skeleton className="w-20 h-4 rounded" />
            <div className="flex gap-2">
              <Skeleton className="w-12 h-10 rounded" />
              <Skeleton className="w-12 h-10 rounded" />
              <Skeleton className="w-12 h-10 rounded" />
              <Skeleton className="w-12 h-10 rounded" />
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <Skeleton className="w-full h-14 rounded-sm" />
            <Skeleton className="w-full h-12 rounded-sm" />
          </div>

          <div className="space-y-2 pt-6">
            <Skeleton className="w-full h-12 rounded-sm" />
            <Skeleton className="w-full h-12 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPageSkeleton;
