import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Options for useGalleryDialog hook
 */
interface UseGalleryDialogOptions {
  /** Current slug to display */
  currentSlug: string;
  /** Function to get the enlarged image URL for a slug */
  getImageUrl: (slug: string) => string;
  /** Optional list of slugs to preload (adjacent images) */
  slugsToPreload?: string[];
}

/**
 * Return type for useGalleryDialog hook
 */
interface UseGalleryDialogReturn {
  /** Whether the current image has loaded */
  imageLoaded: boolean;
  /** Whether there was an error loading the image */
  imageError: boolean;
  /** Whether the image is currently loading */
  isLoading: boolean;
  /** Ref to attach to the image element */
  imageRef: React.RefObject<HTMLImageElement | null>;
  /** Callback for image onLoad event */
  handleImageLoad: () => void;
  /** Callback for image onError event */
  handleImageError: () => void;
}

/**
 * Custom hook for managing gallery dialog image loading and preloading
 *
 * Handles:
 * - Image loading state management
 * - Loading state tracking with fallback checks
 * - Preloading of adjacent images for smooth navigation
 * - Automatic cleanup on unmount
 *
 * @param options - Configuration options
 * @returns Image state and ref
 *
 * @example
 * ```tsx
 * const { imageLoaded, imageError, isLoading, imageRef } = useGalleryDialog({
 *   currentSlug: 'zudo-block-40-01',
 *   getImageUrl: (slug) => `https://example.com/images/${slug}-2000w.webp`,
 *   slugsToPreload: ['zudo-block-40-02', 'zudo-block-40-03'],
 * });
 *
 * return (
 *   <>
 *     {isLoading && <div className="loader" />}
 *     <img
 *       ref={imageRef}
 *       src={getImageUrl(currentSlug)}
 *       onLoad={() => {}}
 *       onError={() => {}}
 *       style={{ opacity: imageLoaded ? 1 : 0 }}
 *     />
 *   </>
 * );
 * ```
 */
export function useGalleryDialog({
  currentSlug,
  getImageUrl,
  slugsToPreload = [],
}: UseGalleryDialogOptions): UseGalleryDialogReturn {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const preloadedImagesRef = useRef(new Set<string>());

  // Callbacks for image load events
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
    setIsLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoaded(false);
    setImageError(true);
    setIsLoading(false);
  }, []);

  // Preload adjacent images
  useEffect(() => {
    slugsToPreload.forEach((slug) => {
      const url = getImageUrl(slug);
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
  }, [slugsToPreload, getImageUrl]);

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
  }, [currentSlug]);

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
  }, [imageLoaded, imageError, currentSlug]);

  return {
    imageLoaded,
    imageError,
    isLoading,
    imageRef,
    handleImageLoad,
    handleImageError,
  };
}
