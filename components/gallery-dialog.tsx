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
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
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
  const imageRef = useRef<HTMLImageElement>(null);
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
      // Use replace instead of push to avoid page transition
      // This updates the URL without triggering a full navigation
      router.replace(`/gallery?${params.toString()}`);
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

  // Reset image loaded state when slug changes and check if already loaded
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);

    // Use a small delay to ensure the img element is properly set up
    const timeoutId = setTimeout(() => {
      if (imageRef.current && imageRef.current.complete && imageRef.current.naturalWidth > 0) {
        setImageLoaded(true);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [slug]);

  // Additional effect to periodically check if image has loaded
  // This handles cases where onLoad doesn't fire properly
  useEffect(() => {
    if (imageLoaded || imageError) return;

    const intervalId = setInterval(() => {
      if (imageRef.current && imageRef.current.complete && imageRef.current.naturalWidth > 0) {
        setImageLoaded(true);
        setImageError(false);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [imageLoaded, imageError, slug]);

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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-zd-black/70"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        data-testid="gallery-dialog"
        id="gallery-dialog"
        ref={containerRef}
        className="relative flex h-full w-full items-center justify-center"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogTitleId}
        aria-describedby={dialogDescriptionId}
      >
        {/* Close button */}
        <button
          data-testid="gallery-dialog-close"
          onClick={handleClose}
          className="fixed top-20 right-4 z-[70] p-2 text-white hover:text-gray-300 transition-colors pointer-events-auto"
          aria-label="Close dialog"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 pointer-events-none"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation buttons */}
        {previousItem && (
          <button
            data-testid="gallery-dialog-prev"
            onClick={handlePrevious}
            className="fixed left-8 top-1/2 z-[70] -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur transition-colors hover:bg-white/20 pointer-events-auto"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-10 w-10 pointer-events-none" />
          </button>
        )}

        {nextItem && (
          <button
            data-testid="gallery-dialog-next"
            onClick={handleNext}
            className="fixed right-8 top-1/2 z-[70] -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur transition-colors hover:bg-white/20 pointer-events-auto"
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-10 w-10 pointer-events-none" />
          </button>
        )}

        {/* Image container */}
        <div className="relative flex h-full max-h-[90vh] w-full max-w-7xl items-center justify-center p-16 pointer-events-auto">
          <h2 id={dialogTitleId} className="sr-only">
            {currentItem.imageAlt || `Gallery image ${currentItem.slug}`}
          </h2>
          <p id={dialogDescriptionId} className="sr-only">
            Use the arrow keys to move through images. Press Escape to close.
          </p>

          <div className="relative flex h-full w-full items-center justify-center">
            {/* Blurhash placeholder - shows immediately */}
            {currentItem.blurhash && !imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-full w-full max-h-[80vh] max-w-[80vw]">
                  <Blurhash
                    hash={currentItem.blurhash}
                    width="100%"
                    height="100%"
                    className="h-full w-full"
                  />
                  <div className="absolute inset-0 backdrop-blur-xl" />
                </div>
              </div>
            )}

            {/* Main image */}
            <img
              ref={imageRef}
              src={getEnlargedImageUrl(currentItem.slug)}
              alt={currentItem.imageAlt || `Gallery image ${currentItem.slug}`}
              className="relative max-h-[80vh] max-w-[80vw] object-contain transition-opacity duration-300"
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
          </div>

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
