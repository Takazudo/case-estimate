'use client';

import React, {
  useEffect,
  useCallback,
  useRef,
  useMemo,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useGalleryKeyboardNavigation } from '@/hooks/use-gallery-keyboard-navigation';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useGalleryDialog } from '@/hooks/use-gallery-dialog';
import { CloseIcon } from '@/components/icons/close-icon';

interface BaseImageDialogProps {
  testId: string;
  dialogId: string;
  currentSlug: string;
  imageUrl: string;
  imageAlt: string;
  getImageUrl: (slug: string) => string;
  slugsToPreload: string[];
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  additionalContent?: ReactNode;
  screenReaderDescription?: string;
}

/**
 * BaseImageDialog - Reusable base component for image dialog galleries
 *
 * Provides common functionality:
 * - Modal dialog with backdrop
 * - Image loading and preloading
 * - Keyboard navigation (arrow keys, ESC)
 * - Click backdrop to close
 * - Navigation buttons
 * - Focus trap
 * - Screen reader support
 */
export default function BaseImageDialog({
  testId,
  dialogId,
  currentSlug,
  imageUrl,
  imageAlt,
  getImageUrl,
  slugsToPreload,
  onClose,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  additionalContent,
  screenReaderDescription = 'Use the arrow keys to move through images. Press Escape to close.',
}: BaseImageDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogTitleId = useMemo(() => `${dialogId}-title-${currentSlug}`, [dialogId, currentSlug]);
  const dialogDescriptionId = useMemo(
    () => `${dialogId}-description-${currentSlug}`,
    [dialogId, currentSlug],
  );

  // Use gallery dialog hook for image loading and preloading
  const { imageLoaded, imageError, isLoading, imageRef, handleImageLoad, handleImageError } =
    useGalleryDialog({
      currentSlug,
      getImageUrl,
      slugsToPreload,
    });

  const { containerRef } = useFocusTrap({
    isActive: true,
    onClose,
  });

  useGalleryKeyboardNavigation({
    isActive: true,
    onClose,
    onPrevious: hasPrevious ? onPrevious : undefined,
    onNext: hasNext ? onNext : undefined,
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
      const rect = dialogRef.current?.getBoundingClientRect();
      if (rect) {
        const clickedInDialog =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;

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

  return (
    <dialog
      ref={dialogRef}
      data-testid={testId}
      id={dialogId}
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
          data-testid={`${testId}-close`}
          onClick={onClose}
          className="fixed top-4 right-4 z-[100] p-2 text-white hover:text-gray-300 transition-colors"
          aria-label="Close dialog"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        {/* Navigation buttons */}
        {hasPrevious && onPrevious && (
          <button
            data-testid={`${testId}-prev`}
            onClick={onPrevious}
            className="fixed left-[10px] top-[50vh] z-[100] -translate-y-1/2 rounded-full text-white backdrop-blur transition-colors hover:bg-white/20 p-[10px]"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-[50px] w-[50px]" />
          </button>
        )}

        {hasNext && onNext && (
          <button
            data-testid={`${testId}-next`}
            onClick={onNext}
            className="fixed right-[10px] top-[50vh] z-[100] -translate-y-1/2 rounded-full text-white backdrop-blur transition-colors hover:bg-white/20 p-[10px]"
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-[50px] w-[50px]" />
          </button>
        )}

        {/* Screen reader announcements */}
        <h2 id={dialogTitleId} className="sr-only">
          {imageAlt}
        </h2>
        <p id={dialogDescriptionId} className="sr-only">
          {screenReaderDescription}
        </p>

        {/* Image container */}
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
            src={imageUrl}
            alt={imageAlt}
            className="relative max-h-[95vh] max-w-[calc(100vw-200px)] object-contain transition-opacity duration-300 border border-zd-white"
            onLoad={handleImageLoad}
            onError={handleImageError}
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

        {/* Additional content (like image counter) */}
        {additionalContent}
      </div>
    </dialog>
  );
}
