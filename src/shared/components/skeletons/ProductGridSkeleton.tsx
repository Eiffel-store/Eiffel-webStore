import React from 'react';
import { ProductCardSkeleton } from './ProductCardSkeleton';

interface ProductGridSkeletonProps {
  count?: number;
  cols?: 2 | 3 | 4;
}

export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({
  count = 8,
  cols = 4
}) => {
  const colClasses =
    cols === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : cols === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={`grid ${colClasses} gap-6 w-full`}>
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={`product-skel-${idx}`} />
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
