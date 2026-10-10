'use client';

import { computed, Show } from '@takazudo/zfb/zudo-react';
import {
  getGalleryItemBySlug,
  getPreviousGalleryItem,
  getNextGalleryItem,
  getEnlargedImageUrl,
  getItemsForPreloading,
} from '@/data/gallery-data';
import type { Reactive } from '@/utils/reactive';
import { read } from '@/utils/reactive';
import BaseImageDialog from './base-image-dialog';

interface GalleryDialogProps {
  slug: Reactive<string>;
}

export default function GalleryDialog({ slug }: GalleryDialogProps) {
  const current = computed(() => getGalleryItemBySlug(read(slug)));
  const previous = computed(() => getPreviousGalleryItem(read(slug)));
  const next = computed(() => getNextGalleryItem(read(slug)));
  const imageUrl = computed(() => getEnlargedImageUrl(read(slug)));
  const imageAlt = computed(() => current.value?.imageAlt || `Gallery image ${read(slug)}`);
  const preload = computed(() => getItemsForPreloading(read(slug)).map((item) => item.slug));
  const navigate = (newSlug: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('id', newSlug);
    history.replaceState(null, '', `/gallery/?${params}`);
  };
  const close = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete('id');
    history.replaceState(null, '', params.toString() ? `/gallery/?${params}` : '/gallery/');
  };
  return (
    <Show when={computed(() => Boolean(current.value))}>
      {() => (
        <BaseImageDialog
          testId="gallery-dialog"
          dialogId="gallery-dialog"
          currentSlug={slug}
          imageUrl={imageUrl}
          imageAlt={imageAlt}
          getImageUrl={getEnlargedImageUrl}
          slugsToPreload={preload}
          onClose={close}
          onPrevious={() => {
            if (previous.value) navigate(previous.value.slug);
          }}
          onNext={() => {
            if (next.value) navigate(next.value.slug);
          }}
          hasPrevious={computed(() => Boolean(previous.value))}
          hasNext={computed(() => Boolean(next.value))}
        />
      )}
    </Show>
  );
}
