'use client';

import React, {
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
import { useGalleryKeyboardNavigation } from '@/hooks/use-gallery-keyboard-navigation';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { CloseIcon } from '@/components/icons/close-icon';

interface GalleryDialogProps {
  slug: string;
}

export default function GalleryDialog({ slug }: GalleryDialogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
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

    // Close the dialog first
    if (dialogRef.current) {
      dialogRef.current.close();
    }

    router.replace(newUrl, { scroll: false });
  }, [router, searchParams]);

  const handleNavigate = useCallback(
    (newSlug: string) => {
      const params = new URLSearchParams(searchParams);
      params.set('id', newSlug);
      // Use replace instead of push to avoid page transition
      // This updates the URL without triggering a full navigation
      router.replace(`/gallery?${params.toString()}`, { scroll: false });
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

  // Open/close dialog based on currentItem
  useEffect(() => {
    if (currentItem && dialogRef.current) {
      // Use showModal for proper dialog behavior with backdrop
      if (!dialogRef.current.open) {
        dialogRef.current.showModal();
      }
    } else if (!currentItem && dialogRef.current && dialogRef.current.open) {
      dialogRef.current.close();
    }
  }, [currentItem]);

  // Handle backdrop click
  const handleDialogClick = useCallback(
    (event: ReactMouseEvent<HTMLDialogElement>) => {
      // Check if click is on the backdrop (dialog element itself, not its children)
      const rect = dialogRef.current?.getBoundingClientRect();
      if (rect) {
        const clickedInDialog =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;

        // If clicked outside the dialog content area (on the backdrop)
        if (!clickedInDialog || event.target === dialogRef.current) {
          handleClose();
        }
      }
    },
    [handleClose],
  );

  // Handle native dialog cancel event (ESC key)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (event: Event) => {
      event.preventDefault(); // Prevent default close behavior
      handleClose();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [handleClose]);

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
    setIsLoading(true);

    // Use a small delay to ensure the img element is properly set up
    const timeoutId = setTimeout(() => {
      if (imageRef.current && imageRef.current.complete && imageRef.current.naturalWidth > 0) {
        setImageLoaded(true);
        setIsLoading(false);
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
        setIsLoading(false);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [imageLoaded, imageError, slug]);

  if (!currentItem) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      data-testid="gallery-dialog"
      id="gallery-dialog"
      className="fixed inset-0 z-[60] m-0 max-h-screen h-screen max-w-screen w-screen bg-transparent p-0 backdrop:bg-zd-black/70"
      onClick={handleDialogClick}
      aria-labelledby={dialogTitleId}
      aria-describedby={dialogDescriptionId}
    >
      <div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className="relative flex h-full w-full items-center justify-center"
      >
        {/* Close button - positioned at top-right of viewport */}
        <button
          data-testid="gallery-dialog-close"
          onClick={handleClose}
          className="fixed top-4 right-4 z-[100] p-2 text-white hover:text-gray-300 transition-colors"
          aria-label="Close dialog"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        {/* Navigation buttons - properly centered at viewport edges */}
        {previousItem && (
          <button
            data-testid="gallery-dialog-prev"
            onClick={handlePrevious}
            className="fixed left-[10px] top-[50vh] z-[100] -translate-y-1/2 rounded-full text-white backdrop-blur transition-colors hover:bg-white/20 p-[10px]"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-[50px] w-[50px]" />
          </button>
        )}

        {nextItem && (
          <button
            data-testid="gallery-dialog-next"
            onClick={handleNext}
            className="fixed right-[10px] top-[50vh] z-[100] -translate-y-1/2 rounded-full text-white backdrop-blur transition-colors hover:bg-white/20 p-[10px]"
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-10 w-10" />
          </button>
        )}

        {/* Screen reader announcements */}
        <h2 id={dialogTitleId} className="sr-only">
          {currentItem.imageAlt || `Gallery image ${currentItem.slug}`}
        </h2>
        <p id={dialogDescriptionId} className="sr-only">
          Use the arrow keys to move through images. Press Escape to close.
        </p>

        {/* Image container */}
        <div className="relative flex h-full w-full items-center justify-center">
          <div className="relative flex h-full w-full items-center justify-center">
            {/* Loading spinner - shows while image is loading */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="loader" />
              </div>
            )}

            {/* Main image - centered in dialog */}
            <img
              ref={imageRef}
              src={getEnlargedImageUrl(currentItem.slug)}
              alt={currentItem.imageAlt || `Gallery image ${currentItem.slug}`}
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
      </div>
    </dialog>
  );
}
