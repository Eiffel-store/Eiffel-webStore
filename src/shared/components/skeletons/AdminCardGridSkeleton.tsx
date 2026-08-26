import React from 'react';
import { Skeleton } from './Skeleton';

interface AdminCardGridSkeletonProps {
  count?: number;
  cols?: 2 | 3 | 4;
}

export const AdminCardGridSkeleton: React.FC<AdminCardGridSkeletonProps> = ({
  count = 4,
  cols = 4
}) => {
  const colClass =
    cols === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : cols === 3
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={`grid ${colClass} gap-6 w-full animate-fade-in`}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={`admin-card-skel-${idx}`}
          className="bg-zinc-950 border border-zinc-800 overflow-hidden rounded-lg shadow-xl flex flex-col justify-between"
        >
          {/* Top Media / Thumbnail Skeleton */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900">
            <Skeleton className="w-full h-full" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <Skeleton className="w-16 h-4 rounded" />
              <Skeleton className="w-12 h-4 rounded" />
            </div>
          </div>

          {/* Content Details Skeleton */}
          <div className="p-5 space-y-4">
            <div className="space-y-2">
              <Skeleton className="w-3/4 h-5 rounded" />
              <Skeleton className="w-full h-3.5 rounded" />
              <Skeleton className="w-4/5 h-3.5 rounded" />
            </div>

            {/* Bottom Actions Row */}
            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
              <Skeleton className="w-20 h-4 rounded" />
              <div className="flex items-center gap-2">
                <Skeleton className="w-7 h-7 rounded" />
                <Skeleton className="w-7 h-7 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminCardGridSkeleton;
