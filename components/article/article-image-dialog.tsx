'use client';

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useGalleryKeyboardNavigation } from '@/hooks/use-gallery-keyboard-navigation';
import { useFocusTrap } from '@/hooks/use-focus-trap';

interface ImageItem {
  thumbUrl: string;
  enlargeUrl: string;
  imageAlt: string;
  heading: string;
  subHeading?: string;
  blurhash?: string;
}

interface ArticleImageDialogProps {
  items: ImageItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function ArticleImageDialog({
  items,
  currentIndex,
  onClose,
  onNavigate,
}: ArticleImageDialogProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const preloadedImagesRef = useRef(new Set<string>());

  // Get current item based on index
  const currentItem =
    currentIndex !== null && currentIndex >= 0 && currentIndex < items.length
      ? items[currentIndex]
      : null;

  const hasPrevious = currentIndex !== null && currentIndex > 0;
  const hasNext = currentIndex !== null && currentIndex < items.length - 1;

  const dialogTitleId = useMemo(() => `article-image-dialog-title-${currentIndex}`, [currentIndex]);
  const dialogDescriptionId = useMemo(
    () => `article-image-dialog-description-${currentIndex}`,
    [currentIndex],
  );

  const handleClose = useCallback(() => {
    // Close the dialog first
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    onClose();
  }, [onClose]);

  const handlePrevious = useCallback(() => {
    if (currentIndex !== null && currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  }, [onNavigate, currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex !== null && currentIndex < items.length - 1) {
      onNavigate(currentIndex + 1);
    }
  }, [onNavigate, currentIndex, items.length]);

  const { containerRef } = useFocusTrap({
    isActive: Boolean(currentItem),
    onClose: handleClose,
  });

  useGalleryKeyboardNavigation({
    isActive: Boolean(currentItem),
    onClose: handleClose,
    onPrevious: hasPrevious ? handlePrevious : undefined,
    onNext: hasNext ? handleNext : undefined,
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
    if (currentIndex === null) return;

    const indicesToPreload: number[] = [];

    // Add previous image
    if (currentIndex > 0) {
      indicesToPreload.push(currentIndex - 1);
    }

    // Add next image
    if (currentIndex < items.length - 1) {
      indicesToPreload.push(currentIndex + 1);
    }

    // Add two images ahead if possible
    if (currentIndex < items.length - 2) {
      indicesToPreload.push(currentIndex + 2);
    }

    // Add two images behind if possible
    if (currentIndex > 1) {
      indicesToPreload.push(currentIndex - 2);
    }

    indicesToPreload.forEach((index) => {
      const item = items[index];
      if (!item) return;

      const url = item.enlargeUrl;
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
  }, [currentIndex, items]);

  // Reset image loaded state when index changes
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
  }, [currentIndex]);

  // Additional effect to periodically check if image has loaded
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
  }, [imageLoaded, imageError, currentIndex]);

  if (!currentItem) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      data-testid="article-image-dialog"
      id="article-image-dialog"
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
          data-testid="article-image-dialog-close"
          onClick={handleClose}
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

        {/* Navigation buttons - properly centered at viewport edges */}
        {hasPrevious && (
          <button
            data-testid="article-image-dialog-prev"
            onClick={handlePrevious}
            className="fixed left-[10px] top-[50vh] z-[100] -translate-y-1/2 rounded-full text-white backdrop-blur transition-colors hover:bg-white/20 p-[10px]"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-[50px] w-[50px]" />
          </button>
        )}

        {hasNext && (
          <button
            data-testid="article-image-dialog-next"
            onClick={handleNext}
            className="fixed right-[10px] top-[50vh] z-[100] -translate-y-1/2 rounded-full text-white backdrop-blur transition-colors hover:bg-white/20 p-[10px]"
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-10 w-10" />
          </button>
        )}

        {/* Screen reader announcements */}
        <h2 id={dialogTitleId} className="sr-only">
          {currentItem.imageAlt ||
            `Image ${currentIndex !== null ? currentIndex + 1 : '?'} of ${items.length}`}
        </h2>
        <p id={dialogDescriptionId} className="sr-only">
          {currentItem.heading}
          {currentItem.subHeading ? ` - ${currentItem.subHeading}` : ''}. Use the arrow keys to move
          through images. Press Escape to close.
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
              src={currentItem.enlargeUrl}
              alt={
                currentItem.imageAlt ||
                `Image ${currentIndex !== null ? currentIndex + 1 : '?'} of ${items.length}`
              }
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

          {/* Image info overlay - shows heading and subheading */}
          {imageLoaded && (
            <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
              <div className="bg-black/70 backdrop-blur px-4 py-2 rounded-lg max-w-2xl">
                <p className="text-white text-center">
                  <span className="font-semibold">{currentItem.heading}</span>
                  {currentItem.subHeading && (
                    <span className="text-gray-300 ml-2">({currentItem.subHeading})</span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
