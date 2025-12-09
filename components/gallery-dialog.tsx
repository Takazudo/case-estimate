'use client';

import React, { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentItem = getGalleryItemBySlug(slug);
  const previousItem = getPreviousGalleryItem(slug);
  const nextItem = getNextGalleryItem(slug);

  // Get slugs to preload (memoized to prevent unnecessary effect re-runs)
  const slugsToPreload = useMemo(() => {
    const itemsToPreload = getItemsForPreloading(slug);
    return itemsToPreload.map((item) => item.slug);
  }, [slug]);

  const handleClose = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete('id');
    const newUrl = params.toString() ? `/gallery?${params.toString()}` : '/gallery';
    router.replace(newUrl, { scroll: false });
  }, [router, searchParams]);

  const handleNavigate = useCallback(
    (newSlug: string) => {
      const params = new URLSearchParams(searchParams);
      params.set('id', newSlug);
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
