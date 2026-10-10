'use client';

import { computed, signal } from '@takazudo/zfb/zudo-react';
import { getGalleryItemBySlug } from '@/data/gallery-data';
import { getEnlargedImageUrl } from '@/utils/cdn-urls';
import BaseImageDialog from './base-image-dialog';

interface ModelGalleryDialogProps {
  slug: string;
  allSlugs: string[];
  onClose: () => void;
}

export default function ModelGalleryDialog({ slug, allSlugs, onClose }: ModelGalleryDialogProps) {
  const currentSlug = signal(slug);
  const index = computed(() => allSlugs.indexOf(currentSlug.value));
  const current = computed(() => getGalleryItemBySlug(currentSlug.value));
  const previous = computed(() => (index.value > 0 ? allSlugs[index.value - 1] : null));
  const next = computed(() =>
    index.value >= 0 && index.value < allSlugs.length - 1 ? allSlugs[index.value + 1] : null,
  );
  const preload = computed(() =>
    [previous.value, next.value].filter((value): value is string => Boolean(value)),
  );
  return (
    <BaseImageDialog
      testId="model-gallery-dialog"
      dialogId="model-gallery-dialog"
      currentSlug={currentSlug}
      imageUrl={computed(() => getEnlargedImageUrl(currentSlug.value))}
      imageAlt={computed(
        () => current.value?.imageAlt || `Model gallery image ${currentSlug.value}`,
      )}
      getImageUrl={getEnlargedImageUrl}
      slugsToPreload={preload}
      onClose={onClose}
      onPrevious={() => {
        if (previous.value) currentSlug.value = previous.value;
      }}
      onNext={() => {
        if (next.value) currentSlug.value = next.value;
      }}
      hasPrevious={computed(() => Boolean(previous.value))}
      hasNext={computed(() => Boolean(next.value))}
      screenReaderDescription={computed(
        () =>
          `Image ${index.value + 1} of ${allSlugs.length}. Use the arrow keys to navigate through images. Press Escape to close.`,
      )}
      additionalContent={
        <div class="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-white text-sm">
          {computed(() => `${index.value + 1} / ${allSlugs.length}`)}
        </div>
      }
    />
  );
}
