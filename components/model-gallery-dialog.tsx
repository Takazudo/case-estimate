'use client';

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { getGalleryItemBySlug } from '@/data/gallery-data';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useGalleryKeyboardNavigation } from '@/hooks/use-gallery-keyboard-navigation';
import { useFocusTrap } from '@/hooks/use-focus-trap';

interface ModelGalleryDialogProps {
  slug: string;
  allSlugs: string[]; // [main, ...subs] - the complete list for navigation
  onClose: () => void;
}

/**
 * ModelGalleryDialog - Scoped gallery dialog for model images
 *
 * Similar to GalleryDialog but navigates only within the provided slug list.
 * Features:
 * - Enlarged image view (2000w.webp)
 * - Navigation limited to allSlugs array
 * - Keyboard navigation (arrow keys, ESC)
 * - Click backdrop to close
 * - Image preloading for smooth navigation
 *
 * Usage:
 * <ModelGalleryDialog
 *   slug="current-slug"
 *   allSlugs={["main-slug", "sub1", "sub2"]}
 *   onClose={() => setDialogOpen(false)}
 * />
 */
export default function ModelGalleryDialog({ slug, allSlugs, onClose }: ModelGalleryDialogProps) {
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const preloadedImagesRef = useRef(new Set<string>());

  const dialogTitleId = useMemo(() => `model-gallery-dialog-title-${currentSlug}`, [currentSlug]);
  const dialogDescriptionId = useMemo(
    () => `model-gallery-dialog-description-${currentSlug}`,
    [currentSlug],
  );

  // Find current index and adjacent slugs within the scoped list
  const currentIndex = allSlugs.indexOf(currentSlug);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allSlugs.length - 1;
  const previousSlug = hasPrevious ? allSlugs[currentIndex - 1] : null;
  const nextSlug = hasNext ? allSlugs[currentIndex + 1] : null;

  // Get current item data
  const currentItem = getGalleryItemBySlug(currentSlug);

  // Helper to generate image URL
  const getEnlargedImageUrl = (slug: string) => {
    return `https://takazudomodular.com/images/p/${slug}/2000w.webp`;
  };

  const handlePrevious = useCallback(() => {
    if (previousSlug) {
      setCurrentSlug(previousSlug);
    }
  }, [previousSlug]);

  const handleNext = useCallback(() => {
    if (nextSlug) {
      setCurrentSlug(nextSlug);
    }
  }, [nextSlug]);

  const { containerRef } = useFocusTrap({
    isActive: true,
    onClose,
  });

  useGalleryKeyboardNavigation({
    isActive: true,
    onClose,
    onPrevious: hasPrevious ? handlePrevious : undefined,
    onNext: hasNext ? handleNext : undefined,
  });

  // Open dialog on mount
  useEffect(() => {
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }, []);

  // Handle backdrop click
  const handleDialogClick = useCallback(
    (event: ReactMouseEvent<HTMLDialogElement>) => {
      // Check if click is on the backdrop
      const rect = dialogRef.current?.getBoundingClientRect();
      if (rect) {
        const clickedInDialog =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;

        // If clicked outside the dialog content area (on the backdrop)
        if (!clickedInDialog || event.target === dialogRef.current) {
          onClose();
        }
      }
    },
    [onClose],
  );

  // Handle native dialog cancel event (ESC key)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [onClose]);

  // Preload adjacent images
  useEffect(() => {
    const indicesToPreload: number[] = [];

    // Add previous image
    if (currentIndex > 0) {
      indicesToPreload.push(currentIndex - 1);
    }

    // Add next image
    if (currentIndex < allSlugs.length - 1) {
      indicesToPreload.push(currentIndex + 1);
    }

    indicesToPreload.forEach((index) => {
      const slugToPreload = allSlugs[index];
      const url = getEnlargedImageUrl(slugToPreload);

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
  }, [currentSlug, currentIndex, allSlugs]);

  // Reset image loaded state when slug changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setIsLoading(true);

    // Check if image is already loaded
    const timeoutId = setTimeout(() => {
      if (imageRef.current && imageRef.current.complete && imageRef.current.naturalWidth > 0) {
        setImageLoaded(true);
        setIsLoading(false);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [currentSlug]);

  // Periodically check if image has loaded
  useEffect(() => {
    if (imageLoaded || imageError) return;

    const intervalId = setInterval(() => {
      if (imageRef.current && imageRef.current.complete && imageRef.current.naturalWidth > 0) {
        setImageLoaded(true);
        setImageError(false);
        setIsLoading(false);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [imageLoaded, imageError, currentSlug]);

  if (!currentItem) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      data-testid="model-gallery-dialog"
      id="model-gallery-dialog"
      className="fixed inset-0 z-[60] m-0 max-h-screen h-screen max-w-screen w-screen bg-transparent p-0 backdrop:bg-zd-black/70"
      onClick={handleDialogClick}
      aria-labelledby={dialogTitleId}
      aria-describedby={dialogDescriptionId}
    >
      <div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className="relative flex h-full w-full items-center justify-center"
      >
        {/* Close button */}
        <button
          data-testid="model-gallery-dialog-close"
          onClick={onClose}
          className="fixed top-4 right-4 z-[100] p-2 text-white hover:text-gray-300 transition-colors"
          aria-label="Close dialog"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation buttons */}
        {hasPrevious && (
          <button
            data-testid="model-gallery-dialog-prev"
            onClick={handlePrevious}
            className="fixed left-[10px] top-[50vh] z-[100] -translate-y-1/2 rounded-full text-white backdrop-blur transition-colors hover:bg-white/20 p-[10px]"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-[50px] w-[50px]" />
          </button>
        )}

        {hasNext && (
          <button
            data-testid="model-gallery-dialog-next"
            onClick={handleNext}
            className="fixed right-[10px] top-[50vh] z-[100] -translate-y-1/2 rounded-full text-white backdrop-blur transition-colors hover:bg-white/20 p-[10px]"
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-10 w-10" />
          </button>
        )}

        {/* Screen reader announcements */}
        <h2 id={dialogTitleId} className="sr-only">
          {currentItem.imageAlt || `Model gallery image ${currentSlug}`}
        </h2>
        <p id={dialogDescriptionId} className="sr-only">
          Image {currentIndex + 1} of {allSlugs.length}. Use the arrow keys to navigate through
          images. Press Escape to close.
        </p>

        {/* Image container */}
        <div className="relative flex h-full w-full items-center justify-center">
          <div className="relative flex h-full w-full items-center justify-center">
            {/* Loading spinner */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="loader" />
              </div>
            )}

            {/* Main image */}
            <img
              ref={imageRef}
              src={getEnlargedImageUrl(currentSlug)}
              alt={currentItem.imageAlt || `Model gallery image ${currentSlug}`}
              className="relative max-h-[95vh] max-w-[calc(100vw-200px)] object-contain transition-opacity duration-300 border border-zd-white"
              onLoad={() => {
                setImageLoaded(true);
                setImageError(false);
                setIsLoading(false);
              }}
              onError={() => {
                setImageLoaded(false);
                setImageError(true);
                setIsLoading(false);
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

        {/* Image counter */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-white text-sm">
          {currentIndex + 1} / {allSlugs.length}
        </div>
      </div>
    </dialog>
  );
}
