import React from 'react';
import { Skeleton } from './Skeleton';

export const AccountPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface py-12 px-4 sm:px-8 md:px-12 max-w-[1280px] mx-auto w-full animate-fade-in">
      {/* Profile Header Skeleton */}
      <div className="p-6 sm:p-8 bg-zinc-950 border border-zinc-800 rounded-lg mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Skeleton variant="circular" className="w-16 h-16" />
          <div className="space-y-2">
            <Skeleton className="w-48 h-6 rounded" />
            <Skeleton className="w-32 h-4 rounded" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="w-28 h-10 rounded" />
          <Skeleton className="w-28 h-10 rounded" />
        </div>
      </div>

      {/* Tabs Navigation Skeleton */}
      <div className="flex gap-3 mb-8 border-b border-zinc-800 pb-3">
        <Skeleton className="w-28 h-8 rounded" />
        <Skeleton className="w-28 h-8 rounded" />
        <Skeleton className="w-28 h-8 rounded" />
        <Skeleton className="w-28 h-8 rounded" />
      </div>

      {/* Content Cards Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={`acc-skel-${i}`} className="p-6 bg-zinc-950 border border-zinc-800 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="w-40 h-5 rounded" />
              <Skeleton className="w-20 h-5 rounded" />
            </div>
            <Skeleton className="w-full h-12 rounded" />
            <div className="flex justify-between items-center pt-3 border-t border-zinc-850">
              <Skeleton className="w-28 h-4 rounded" />
              <Skeleton className="w-32 h-8 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountPageSkeleton;
