'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { GalleryItem } from '@/data/gallery-data';
import { getThumbnailUrl } from '@/data/gallery-data';
import { Blurhash } from '@/components/blurhash';

interface GalleryThumbnailGridProps {
  items: GalleryItem[];
}

interface GalleryThumbnailButtonProps {
  item: GalleryItem;
  isLoaded: boolean;
  isErrored: boolean;
  onActivate: (slug: string) => void;
  registerImage: (image: HTMLImageElement) => void;
  unregisterImage: (image: HTMLImageElement) => void;
  onImageLoad: (image: HTMLImageElement, src: string) => void;
  onImageError: (image: HTMLImageElement, src: string) => void;
}

function GalleryThumbnailButton({
  item,
  isLoaded,
  isErrored,
  onActivate,
  registerImage,
  unregisterImage,
  onImageLoad,
  onImageError,
}: GalleryThumbnailButtonProps) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const thumbnailSrc = getThumbnailUrl(item.slug);

  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) {
      return;
    }

    registerImage(imageElement);

    return () => {
      unregisterImage(imageElement);
    };
  }, [registerImage, unregisterImage]);

  return (
    <li className="relative" role="listitem">
      <button
        type="button"
        data-testid="gallery-thumbnail"
        data-slug={item.slug}
        onClick={() => onActivate(item.slug)}
        className="group relative block aspect-square w-full overflow-hidden bg-gray-900 transition-transform hover:ring-3 hover:ring-zd-link hover:z-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black focus:z-10"
        aria-haspopup="dialog"
        aria-label={item.imageAlt || `Open gallery image ${item.slug}`}
        aria-controls="gallery-dialog"
      >
        {/* Always show blurhash immediately as placeholder */}
        {!isErrored && item.blurhash && (
          <div className="absolute inset-0">
            <Blurhash
              hash={item.blurhash}
              width="100%"
              height="100%"
              className="absolute inset-0"
            />
            {/* Add blur overlay for aesthetic effect */}
            <div className="absolute inset-0 backdrop-blur-xl opacity-50" />
          </div>
        )}

        {!isErrored ? (
          <img
            ref={imageRef}
            data-src={thumbnailSrc}
            alt={item.imageAlt || `Gallery image ${item.slug}`}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
            decoding="async"
            style={{ opacity: isLoaded ? 1 : 0 }}
            onLoad={(event) => onImageLoad(event.currentTarget, thumbnailSrc)}
            onError={(event) => onImageError(event.currentTarget, thumbnailSrc)}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-sm text-gray-300">
            Image failed to load
          </span>
        )}
      </button>
    </li>
  );
}

export default function GalleryThumbnailGrid({ items }: GalleryThumbnailGridProps) {
  const router = useRouter();
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [erroredImages, setErroredImages] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pendingImagesRef = useRef(new Set<HTMLImageElement>());

  const handleThumbnailClick = useCallback(
    (slug: string) => {
      router.push(`/gallery?id=${slug}`);
    },
    [router],
  );

  const handleImageLoad = useCallback((image: HTMLImageElement, src: string) => {
    image.dataset.loaded = 'true';
    setLoadedImages((prev) => {
      const next = new Set(prev);
      next.add(src);
      return next;
    });
    setErroredImages((prev) => {
      if (!prev.has(src)) {
        return prev;
      }
      const next = new Set(prev);
      next.delete(src);
      return next;
    });
    observerRef.current?.unobserve(image);
    pendingImagesRef.current.delete(image);
  }, []);

  const handleImageError = useCallback((image: HTMLImageElement, src: string) => {
    image.dataset.error = 'true';
    setErroredImages((prev) => {
      const next = new Set(prev);
      next.add(src);
      return next;
    });
    observerRef.current?.unobserve(image);
    pendingImagesRef.current.delete(image);
  }, []);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      // Only process entries that are actually intersecting
      if (!entry.isIntersecting) {
        return;
      }

      const image = entry.target as HTMLImageElement;
      const source = image.dataset.src;
      if (!source) {
        observerRef.current?.unobserve(image);
        return;
      }

      // Skip if already loaded or errored
      if (image.dataset.loaded === 'true' || image.dataset.error === 'true') {
        observerRef.current?.unobserve(image);
        return;
      }

      // Only set src if not already set
      if (image.src !== source && !image.src.endsWith(source)) {
        image.src = source;
        // Don't unobserve yet - wait for the onLoad or onError handlers to do it
        // This prevents race conditions where the image isn't properly tracked
      }
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '100px',
      threshold: 0.01, // Lower threshold but we check intersectionRatio > 0 in handler
    });

    observerRef.current = observer;

    // Register any pending images with the observer
    // Use setTimeout to ensure DOM is fully settled before observing
    if (pendingImagesRef.current.size > 0) {
      // Convert to array to avoid modification during iteration
      const pendingImages = Array.from(pendingImagesRef.current);
      pendingImagesRef.current.clear();

      // Defer observation with timeout to ensure proper layout
      setTimeout(() => {
        // Register each image with the observer for lazy loading
        pendingImages.forEach((image) => {
          if (observerRef.current) {
            observer.observe(image);
          }
        });
      }, 50);
    }

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [handleIntersection]);

  const registerImage = useCallback((image: HTMLImageElement) => {
    // Always use the IntersectionObserver for lazy loading
    // This ensures images only load when they actually come into viewport
    if (observerRef.current) {
      // Defer observation with a small timeout to ensure DOM is fully settled
      // This prevents the IntersectionObserver from thinking all images are visible
      setTimeout(() => {
        if (observerRef.current) {
          observerRef.current.observe(image);
        }
      }, 50);
      return;
    }

    // If observer isn't ready yet, add to pending queue
    pendingImagesRef.current.add(image);
  }, []);

  const unregisterImage = useCallback((image: HTMLImageElement) => {
    if (observerRef.current) {
      observerRef.current.unobserve(image);
    }
    pendingImagesRef.current.delete(image);
  }, []);

  return (
    <ul
      data-testid="gallery-thumbnail-grid"
      className="grid grid-cols-2 gap-[1px] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      role="list"
    >
      {items.map((item) => {
        const thumbnailSrc = getThumbnailUrl(item.slug);

        return (
          <GalleryThumbnailButton
            key={item.slug}
            item={item}
            isLoaded={loadedImages.has(thumbnailSrc)}
            isErrored={erroredImages.has(thumbnailSrc)}
            onActivate={handleThumbnailClick}
            registerImage={registerImage}
            unregisterImage={unregisterImage}
            onImageLoad={handleImageLoad}
            onImageError={handleImageError}
          />
        );
      })}
    </ul>
  );
}
