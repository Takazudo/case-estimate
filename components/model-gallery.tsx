'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getGalleryItemBySlug } from '@/data/gallery-data';
import { getImageUrl } from '@/utils/cdn-urls';
import { Blurhash } from '@/components/blurhash';
import ModelGalleryDialog from '@/components/model-gallery-dialog';

interface ModelGalleryProps {
  main: string; // slug for main image
  subs: string[]; // array of slugs for sub images
}

/**
 * ModelGallery - Gallery component with main image and sub thumbnails
 *
 * Displays:
 * - Large main image (900w.webp)
 * - Grid of smaller sub images (600w.webp)
 * - Blurhash placeholders while loading
 * - Click any image to open dialog for enlarged view with navigation
 *
 * Usage:
 * <ModelGallery
 *   main="zb40-green-a-1"
 *   subs={["zb40-green-a-2", "zb40-green-a-3", "zb40-green-a-4"]}
 * />
 */
export default function ModelGallery({ main, subs }: ModelGalleryProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [erroredImages, setErroredImages] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // All slugs for dialog navigation (main + subs)
  const allSlugs = [main, ...subs];

  // Get gallery items for blurhash rendering
  const mainItem = getGalleryItemBySlug(main);
  const subItems = subs.map((slug) => getGalleryItemBySlug(slug)).filter(Boolean);

  const handleImageClick = useCallback((slug: string) => {
    setSelectedSlug(slug);
  }, []);

  const handleDialogClose = useCallback(() => {
    setSelectedSlug(null);
  }, []);

  const handleImageLoad = useCallback((imageUrl: string) => {
    setLoadedImages((prev) => {
      const next = new Set(prev);
      next.add(imageUrl);
      return next;
    });
    setErroredImages((prev) => {
      if (!prev.has(imageUrl)) {
        return prev;
      }
      const next = new Set(prev);
      next.delete(imageUrl);
      return next;
    });
  }, []);

  const handleImageError = useCallback((imageUrl: string) => {
    setErroredImages((prev) => {
      const next = new Set(prev);
      next.add(imageUrl);
      return next;
    });
  }, []);

  // Setup lazy loading observer
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const img = entry.target as HTMLImageElement;
        const source = img.dataset.src;
        if (!source) {
          observer.unobserve(img);
          return;
        }

        // Only set src if not already set
        if (img.src !== source && !img.src.endsWith(source)) {
          img.src = source;
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '100px',
      threshold: 0.01,
    });

    observerRef.current = observer;

    // Start observing images after a brief delay
    const images = document.querySelectorAll('img[data-src]');
    setTimeout(() => {
      images.forEach((img) => observer.observe(img));
    }, 50);

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, []);

  const mainImageUrl = getImageUrl(main, '900w');

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="relative mb-4">
        <button
          type="button"
          onClick={() => handleImageClick(main)}
          className="relative block border border-zd-white w-full aspect-square overflow-hidden bg-gray-900 transition-transform hover:ring-3 hover:ring-zd-link focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
          aria-label={mainItem?.imageAlt || `View enlarged image ${main}`}
        >
          {/* Blurhash placeholder */}
          {!erroredImages.has(mainImageUrl) && mainItem?.blurhash && (
            <div className="absolute inset-0">
              <Blurhash
                hash={mainItem.blurhash}
                width="100%"
                height="100%"
                className="absolute inset-0"
              />
              {/* Blur overlay */}
              <div className="absolute inset-0 backdrop-blur-xl opacity-50" />
            </div>
          )}

          {/* Main image */}
          {!erroredImages.has(mainImageUrl) ? (
            <img
              data-src={mainImageUrl}
              alt={mainItem?.imageAlt || `Gallery image ${main}`}
              className="absolute inset-0 block h-full w-full object-cover transition-opacity duration-300"
              decoding="async"
              loading="lazy"
              style={{ opacity: loadedImages.has(mainImageUrl) ? 1 : 0 }}
              onLoad={() => handleImageLoad(mainImageUrl)}
              onError={() => handleImageError(mainImageUrl)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-300">
              Image failed to load
            </div>
          )}
        </button>
      </div>

      {/* Sub Images Grid */}
      {subs.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[5px]">
          {subs.map((slug, index) => {
            const item = subItems[index];
            const imageUrl = getImageUrl(slug, '600w');

            return (
              <button
                key={slug}
                type="button"
                onClick={() => handleImageClick(slug)}
                className="relative block border border-zd-white aspect-square overflow-hidden bg-gray-900 transition-transform hover:ring-2 hover:ring-zd-link focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-black"
                aria-label={item?.imageAlt || `View enlarged image ${slug}`}
              >
                {/* Blurhash placeholder */}
                {!erroredImages.has(imageUrl) && item?.blurhash && (
                  <div className="absolute inset-0">
                    <Blurhash
                      hash={item.blurhash}
                      width="100%"
                      height="100%"
                      className="absolute inset-0"
                    />
                    {/* Blur overlay */}
                    <div className="absolute inset-0 backdrop-blur-xl opacity-50" />
                  </div>
                )}

                {/* Sub image */}
                {!erroredImages.has(imageUrl) ? (
                  <img
                    data-src={imageUrl}
                    alt={item?.imageAlt || `Gallery image ${slug}`}
                    className="absolute inset-0 block h-full w-full object-cover transition-opacity duration-300"
                    decoding="async"
                    loading="lazy"
                    style={{ opacity: loadedImages.has(imageUrl) ? 1 : 0 }}
                    onLoad={() => handleImageLoad(imageUrl)}
                    onError={() => handleImageError(imageUrl)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-300">
                    Failed to load
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Gallery Dialog */}
      {selectedSlug && (
        <ModelGalleryDialog slug={selectedSlug} allSlugs={allSlugs} onClose={handleDialogClose} />
      )}
    </div>
  );
}
