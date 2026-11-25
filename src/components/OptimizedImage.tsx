import { useState, type ReactNode } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  fallback?: ReactNode;
}

export function OptimizedImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = 'relative w-full h-full overflow-hidden',
  priority = false,
  fallback,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed && fallback) {
    return <div className={containerClassName}>{fallback}</div>;
  }

  const showImage = priority || loaded;

  return (
    <div className={containerClassName}>
      {!showImage && !failed && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-slate-200/70 dark:bg-slate-800/70 animate-pulse"
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`${className} ${
          showImage ? 'opacity-100' : 'opacity-0 transition-opacity duration-200'
        }`}
      />
    </div>
  );
}
