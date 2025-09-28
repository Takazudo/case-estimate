'use client';

import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  getGalleryItemBySlug,
  getPreviousGalleryItem,
  getNextGalleryItem,
  getEnlargedImageUrl,
  getItemsForPreloading,
} from '@/data/gallery-data';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Blurhash } from '@/components/blurhash';
import { useGalleryKeyboardNavigation } from '@/hooks/use-gallery-keyboard-navigation';
import { useFocusTrap } from '@/hooks/use-focus-trap';

interface GalleryDialogProps {
  slug: string;
}

export default function GalleryDialog({ slug }: GalleryDialogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const preloadedImagesRef = useRef(new Set<string>());
  const dialogTitleId = useMemo(() => `gallery-dialog-title-${slug}`, [slug]);
  const dialogDescriptionId = useMemo(() => `gallery-dialog-description-${slug}`, [slug]);

  const currentItem = getGalleryItemBySlug(slug);
  const previousItem = getPreviousGalleryItem(slug);
  const nextItem = getNextGalleryItem(slug);

  const handleClose = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete('id');
    const newUrl = params.toString() ? `/gallery?${params.toString()}` : '/gallery';
    router.replace(newUrl);
  }, [router, searchParams]);

  const handleNavigate = useCallback(
    (newSlug: string) => {
      const params = new URLSearchParams(searchParams);
      params.set('id', newSlug);
      router.push(`/gallery?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handlePrevious = useCallback(() => {
    if (previousItem) {
      handleNavigate(previousItem.slug);
    }
  }, [handleNavigate, previousItem]);

  const handleNext = useCallback(() => {
    if (nextItem) {
      handleNavigate(nextItem.slug);
    }
  }, [handleNavigate, nextItem]);

  const { containerRef } = useFocusTrap({
    isActive: Boolean(currentItem),
    onClose: handleClose,
  });

  useGalleryKeyboardNavigation({
    isActive: Boolean(currentItem),
    onClose: handleClose,
    onPrevious: previousItem ? handlePrevious : undefined,
    onNext: nextItem ? handleNext : undefined,
  });

  // Preload adjacent images
  useEffect(() => {
    const itemsToPreload = getItemsForPreloading(slug);
    itemsToPreload.forEach((item) => {
      const url = getEnlargedImageUrl(item.slug);
      if (preloadedImagesRef.current.has(url)) {
        return;
      }

      const img = new Image();
      img.src = url;
      img.onload = () => {
        preloadedImagesRef.current.add(url);
      };
      img.onerror = () => {
        preloadedImagesRef.current.delete(url);
      };
    });
  }, [slug]);

  // Reset image loaded state when slug changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [slug]);

  const handleBackdropClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  if (!currentItem) {
    return null;
  }

  return (
    <div
      data-testid="gallery-dialog-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        data-testid="gallery-dialog"
        id="gallery-dialog"
        ref={containerRef}
        className="relative h-full w-full max-w-7xl p-4"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogTitleId}
        aria-describedby={dialogDescriptionId}
      >
        {/* Close button */}
        <button
          data-testid="gallery-dialog-close"
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black bg-opacity-50 p-2 text-white transition-colors hover:bg-opacity-70"
          aria-label="Close dialog"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Navigation buttons */}
        {previousItem && (
          <button
            data-testid="gallery-dialog-prev"
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black bg-opacity-50 p-2 text-white transition-colors hover:bg-opacity-70"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
        )}

        {nextItem && (
          <button
            data-testid="gallery-dialog-next"
            onClick={handleNext}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black bg-opacity-50 p-2 text-white transition-colors hover:bg-opacity-70"
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        )}

        {/* Image container */}
        <div className="relative flex h-full items-center justify-center">
          <h2 id={dialogTitleId} className="sr-only">
            {currentItem.imageAlt || `Gallery image ${currentItem.slug}`}
          </h2>
          <p id={dialogDescriptionId} className="sr-only">
            Use the arrow keys to move through images. Press Escape to close.
          </p>
          {/* Blurhash placeholder - shows immediately */}
          {currentItem.blurhash && !imageLoaded && !imageError && (
            <div className="absolute inset-0">
              <Blurhash
                hash={currentItem.blurhash}
                width="100%"
                height="100%"
                className="absolute inset-0"
              />
              <div className="absolute inset-0 backdrop-blur-xl" />
            </div>
          )}

          {/* Main image */}
          <img
            src={getEnlargedImageUrl(currentItem.slug)}
            alt={currentItem.imageAlt || `Gallery image ${currentItem.slug}`}
            className="relative max-h-full max-w-full object-contain transition-opacity duration-300"
            onLoad={() => {
              setImageLoaded(true);
              setImageError(false);
            }}
            onError={() => {
              setImageLoaded(false);
              setImageError(true);
            }}
            style={{
              opacity: imageLoaded ? 1 : 0,
            }}
            aria-busy={!imageLoaded && !imageError}
          />

          {imageError && (
            <div
              role="alert"
              className="absolute inset-0 flex items-center justify-center bg-black/80 px-4 text-center text-sm text-gray-200"
            >
              Unable to load this image. Please try another item.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
