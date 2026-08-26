import React from 'react';
import { Skeleton } from './Skeleton';

interface AdminTableSkeletonProps {
  rows?: number;
}

export const AdminTableSkeleton: React.FC<AdminTableSkeletonProps> = ({ rows = 5 }) => {
  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950 w-full animate-fade-in">
      {/* Table Header Columns Skeleton */}
      <div className="h-12 bg-zinc-900/90 border-b border-zinc-800 flex items-center px-4 gap-4">
        <Skeleton className="w-24 h-4 rounded" />
        <Skeleton className="w-36 h-4 rounded" />
        <Skeleton className="w-20 h-4 rounded" />
        <Skeleton className="w-28 h-4 rounded" />
        <Skeleton className="w-16 h-4 rounded ml-auto" />
      </div>

      {/* Table Body Rows Skeleton */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={`admin-row-skel-${i}`}
          className="h-16 border-b border-zinc-800/60 flex items-center px-4 gap-4 last:border-b-0"
        >
          <Skeleton className="w-10 h-10 rounded" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="w-48 max-w-full h-4 rounded" />
            <Skeleton className="w-28 max-w-full h-3 rounded" />
          </div>
          <Skeleton className="w-24 h-4 rounded hidden sm:block" />
          <Skeleton className="w-20 h-6 rounded-full hidden md:block" />
          <Skeleton className="w-16 h-8 rounded ml-auto" />
        </div>
      ))}
    </div>
  );
};

export default AdminTableSkeleton;
