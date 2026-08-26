import React from 'react';
import { Skeleton } from './Skeleton';

export const StoreLocatorSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface py-12 px-4 sm:px-8 md:px-12 max-w-[1440px] mx-auto w-full animate-fade-in">
      {/* Header Skeleton */}
      <div className="text-center space-y-3 mb-12">
        <Skeleton className="w-24 h-4 mx-auto rounded" />
        <Skeleton className="w-64 h-9 mx-auto rounded" />
        <Skeleton className="w-96 max-w-full h-4 mx-auto rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Branch Cards List Skeleton (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Skeleton className="w-full h-11 rounded-md" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={`store-skel-${i}`} className="p-4 border border-zinc-800 bg-zinc-950 rounded space-y-3">
                <div className="flex justify-between items-start">
                  <Skeleton className="w-40 h-5 rounded" />
                  <Skeleton className="w-14 h-4 rounded" />
                </div>
                <Skeleton className="w-full h-4 rounded" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="w-24 h-8 rounded" />
                  <Skeleton className="w-24 h-8 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map Canvas Skeleton (7 cols) */}
        <div className="lg:col-span-7 h-[500px] sm:h-[600px] rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default StoreLocatorSkeleton;
