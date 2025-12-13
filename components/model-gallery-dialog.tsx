'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { getGalleryItemBySlug } from '@/data/gallery-data';
import { getEnlargedImageUrl } from '@/utils/cdn-urls';
import BaseImageDialog from './base-image-dialog';

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

  // Find current index and adjacent slugs within the scoped list
  const currentIndex = allSlugs.indexOf(currentSlug);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allSlugs.length - 1;
  const previousSlug = hasPrevious ? allSlugs[currentIndex - 1] : null;
  const nextSlug = hasNext ? allSlugs[currentIndex + 1] : null;

  // Get current item data
  const currentItem = getGalleryItemBySlug(currentSlug);

  // Get slugs to preload (memoized to prevent unnecessary effect re-runs)
  const slugsToPreload = useMemo(() => {
    const slugs: string[] = [];
    if (previousSlug) slugs.push(previousSlug);
    if (nextSlug) slugs.push(nextSlug);
    return slugs;
  }, [previousSlug, nextSlug]);

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

  if (!currentItem) {
    return null;
  }

  return (
    <BaseImageDialog
      testId="model-gallery-dialog"
      dialogId="model-gallery-dialog"
      currentSlug={currentSlug}
      imageUrl={getEnlargedImageUrl(currentSlug)}
      imageAlt={currentItem.imageAlt || `Model gallery image ${currentSlug}`}
      getImageUrl={getEnlargedImageUrl}
      slugsToPreload={slugsToPreload}
      onClose={onClose}
      onPrevious={handlePrevious}
      onNext={handleNext}
      hasPrevious={hasPrevious}
      hasNext={hasNext}
      screenReaderDescription={`Image ${currentIndex + 1} of ${allSlugs.length}. Use the arrow keys to navigate through images. Press Escape to close.`}
      additionalContent={
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-white text-sm">
          {currentIndex + 1} / {allSlugs.length}
        </div>
      }
    />
  );
}
