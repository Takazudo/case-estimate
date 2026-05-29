'use client';

import React, { useCallback, useMemo } from 'react';
import {
  getGalleryItemBySlug,
  getPreviousGalleryItem,
  getNextGalleryItem,
  getEnlargedImageUrl,
  getItemsForPreloading,
} from '@/data/gallery-data';
import BaseImageDialog from './base-image-dialog';

interface GalleryDialogProps {
  slug: string;
}

export default function GalleryDialog({ slug }: GalleryDialogProps) {
  const currentItem = getGalleryItemBySlug(slug);
  const previousItem = getPreviousGalleryItem(slug);
  const nextItem = getNextGalleryItem(slug);

  // Get slugs to preload (memoized to prevent unnecessary effect re-runs)
  const slugsToPreload = useMemo(() => {
    const itemsToPreload = getItemsForPreloading(slug);
    return itemsToPreload.map((item) => item.slug);
  }, [slug]);

  const handleClose = useCallback(() => {
    // Read current search params from browser (SSR-safe: this component only mounts client-side)
    const params = new URLSearchParams(window.location.search);
    params.delete('id');
    // Trailing slash is required: the zfb static host 301-redirects /gallery to
    // /gallery/ and drops the query string, which would break shared deep-links.
    const newUrl = params.toString() ? `/gallery/?${params.toString()}` : '/gallery/';
    // gallery-dialog-host.tsx patches replaceState to emit "locationchange",
    // keeping the dialog's ?id= in sync after this programmatic URL change.
    window.history.replaceState(null, '', newUrl);
  }, []);

  const handleNavigate = useCallback((newSlug: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('id', newSlug);
    // Trailing slash is required: the zfb static host 301-redirects /gallery to
    // /gallery/ and drops the query string, which would break shared deep-links.
    // gallery-dialog-host.tsx patches replaceState to emit "locationchange",
    // keeping the dialog's ?id= in sync after this programmatic URL change.
    window.history.replaceState(null, '', `/gallery/?${params.toString()}`);
  }, []);

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

  if (!currentItem) {
    return null;
  }

  return (
    <BaseImageDialog
      testId="gallery-dialog"
      dialogId="gallery-dialog"
      currentSlug={slug}
      imageUrl={getEnlargedImageUrl(currentItem.slug)}
      imageAlt={currentItem.imageAlt || `Gallery image ${currentItem.slug}`}
      getImageUrl={getEnlargedImageUrl}
      slugsToPreload={slugsToPreload}
      onClose={handleClose}
      onPrevious={handlePrevious}
      onNext={handleNext}
      hasPrevious={Boolean(previousItem)}
      hasNext={Boolean(nextItem)}
    />
  );
}
