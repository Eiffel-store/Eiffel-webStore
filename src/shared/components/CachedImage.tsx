import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { optimizeImageUrl, isImageCached, markImageCached } from '../utils/imageCache';

export interface CachedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  width?: number;
  priority?: boolean;
  fallbackSrc?: string;
  aspectRatio?: string;
}

const FALLBACK_LUXURY_IMG = 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop';

export const CachedImage: React.FC<CachedImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = 'w-full h-full',
  width,
  priority = false,
  fallbackSrc = FALLBACK_LUXURY_IMG,
  aspectRatio,
  loading,
  decoding = 'async',
  ...props
}) => {
  const optimizedSrc = optimizeImageUrl(src, width);
  const alreadyCached = isImageCached(optimizedSrc);

  const [isLoaded, setIsLoaded] = useState<boolean>(alreadyCached);
  const [hasError, setHasError] = useState<boolean>(false);
  const [currentSrc, setCurrentSrc] = useState<string>(optimizedSrc || fallbackSrc);

  useEffect(() => {
    const nextSrc = optimizeImageUrl(src, width) || fallbackSrc;
    setCurrentSrc(nextSrc);
    if (isImageCached(nextSrc)) {
      setIsLoaded(true);
      setHasError(false);
    } else {
      setIsLoaded(false);
      setHasError(false);
    }
  }, [src, width, fallbackSrc]);

  const handleLoad = () => {
    markImageCached(currentSrc);
    setIsLoaded(true);
  };

  const handleError = () => {
    // If the image fails due to network outage or offline state,
    // show the subtle branded placeholder instead of swapping to a random Unsplash model photo
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div
      className={`relative overflow-hidden ${containerClassName}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Luxury Shimmer Skeleton Placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-zinc-900 skeleton-shimmer z-0 animate-pulse" />
      )}

      {/* Error Fallback Box */}
      {hasError ? (
        <div className="w-full h-full min-h-[120px] bg-zinc-950 flex flex-col items-center justify-center p-4 text-zinc-600 gap-2 border border-zinc-900">
          <ImageIcon className="w-6 h-6 text-zinc-700" />
          <span className="text-[10px] font-mono tracking-wider uppercase text-zinc-600">
            EIFFEL BESPOKE
          </span>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={alt || 'Eiffel luxury garment'}
          loading={priority ? 'eager' : (loading || 'lazy')}
          decoding={decoding}
          // @ts-ignore fetchPriority is valid in modern React/browsers
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          className={`${className} transition-opacity duration-500 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
    </div>
  );
};

export default CachedImage;
