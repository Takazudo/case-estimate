'use client';

import { computed, Show } from '@takazudo/zfb/zudo-react';
import type { Reactive } from '@/utils/reactive';
import { read } from '@/utils/reactive';
import BaseImageDialog from '@/components/base-image-dialog';

interface ImageItem {
  thumbUrl: string;
  enlargeUrl: string;
  imageAlt: string;
  heading: string;
  subHeading?: string;
  blurhash?: string;
}
interface Props {
  items: ImageItem[];
  currentIndex: Reactive<number | null>;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function ArticleImageDialog({ items, currentIndex, onClose, onNavigate }: Props) {
  const valid = computed(() => {
    const index = read(currentIndex);
    return index !== null && index >= 0 && index < items.length;
  });
  const item = computed(() => items[read(currentIndex) ?? -1]);
  const index = computed(() => read(currentIndex) ?? -1);
  return (
    <Show when={valid}>
      {() => (
        <BaseImageDialog
          testId="article-image-dialog"
          dialogId="article-image-dialog"
          currentSlug={computed(() => String(index.value))}
          imageUrl={computed(() => item.value.enlargeUrl)}
          imageAlt={computed(
            () => item.value.imageAlt || `Image ${index.value + 1} of ${items.length}`,
          )}
          getImageUrl={(value) => items[Number(value)]?.enlargeUrl || ''}
          slugsToPreload={computed(() =>
            [index.value - 2, index.value - 1, index.value + 1, index.value + 2]
              .filter((value) => value >= 0 && value < items.length)
              .map(String),
          )}
          onClose={onClose}
          onPrevious={() => {
            if (index.value > 0) onNavigate(index.value - 1);
          }}
          onNext={() => {
            if (index.value < items.length - 1) onNavigate(index.value + 1);
          }}
          hasPrevious={computed(() => index.value > 0)}
          hasNext={computed(() => index.value < items.length - 1)}
          screenReaderDescription={computed(
            () =>
              `${item.value.heading}${item.value.subHeading ? ` - ${item.value.subHeading}` : ''}. Use the arrow keys to move through images. Press Escape to close.`,
          )}
          additionalContent={
            <div class="fixed bottom-4 left-4 right-4 flex justify-center pointer-events-none">
              <div class="bg-black/70 backdrop-blur px-4 py-2 rounded-lg max-w-2xl">
                <p class="text-white text-center">
                  <span class="font-semibold">{computed(() => item.value.heading)}</span>{' '}
                  <span class="text-gray-300">
                    {computed(() => (item.value.subHeading ? `(${item.value.subHeading})` : ''))}
                  </span>
                </p>
              </div>
            </div>
          }
        />
      )}
    </Show>
  );
}
