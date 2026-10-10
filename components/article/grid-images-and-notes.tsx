'use client';

import { computed, For, Show, signal } from '@takazudo/zfb/zudo-react';
import type { Child } from '@takazudo/zfb/zudo-react';
import BaseImageDialog from '@/components/base-image-dialog';
import { BlurhashLoader } from '@/components/blurhash-loader';

interface GridItem {
  thumbUrl: string;
  enlargeUrl: string;
  imageAlt: string;
  heading: string;
  subHeading?: string;
  blurhash?: string;
  content: Child;
}
interface Props {
  items: GridItem[];
  className?: string;
}

export function GridImagesAndNotes({ items, className = '' }: Props) {
  const modalImage = signal<{ url: string; alt: string } | null>(null);
  return (
    <>
      <div
        class={`grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-x-hgap-md gap-y-vgap-lg ${className}`}
      >
        <For
          each={signal(items.map((item, index) => ({ item, index })))}
          by={(entry) => entry.index}
        >
          {(entry) => {
            const { item } = entry.value;
            return (
              <div class="overflow-hidden">
                <h3 class="text-sm sm:text-lg font-bold border-t-1 border-zd-white pt-vgap-sm pb-vgap-sm font-futura">
                  <span class="flow-root">
                    <span class="flex justify-between items-center relative group">
                      <span>{item.heading}</span>
                      {item.subHeading && (
                        <span class="text-base font-normal text-zd-gray">{item.subHeading}</span>
                      )}
                    </span>
                  </span>
                </h3>
                <div class="text-sm md:text-base">
                  <button
                    type="button"
                    on:click={() => {
                      modalImage.value = { url: item.enlargeUrl, alt: item.imageAlt };
                    }}
                    class="relative w-[200px] h-[200px] float-right ml-hgap-sm mb-vgap-sm group cursor-pointer"
                    aria-label={`Enlarge ${item.imageAlt} image`}
                  >
                    {item.blurhash ? (
                      <BlurhashLoader
                        blurHash={item.blurhash}
                        imgUrl={item.thumbUrl}
                        alt={item.imageAlt}
                        className="w-full h-full bg-white group-hover:opacity-90 transition-opacity"
                      />
                    ) : (
                      <img
                        src={item.thumbUrl}
                        alt={item.imageAlt}
                        class="w-full h-full object-contain bg-white group-hover:opacity-90 transition-opacity"
                        loading="lazy"
                      />
                    )}
                    <div class="absolute top-2 right-2 p-1 bg-black bg-opacity-20 rounded opacity-100 z-20">
                      <img src="/enlarge.svg" alt="Enlarge" class="w-5 h-5 brightness-0 invert" />
                    </div>
                  </button>
                  <div>{item.content}</div>
                </div>
              </div>
            );
          }}
        </For>
      </div>
      <Show when={computed(() => modalImage.value !== null)}>
        {() => (
          <BaseImageDialog
            testId="notes-image-dialog"
            dialogId="notes-image-dialog"
            currentSlug={modalImage.value!.url}
            imageUrl={modalImage.value!.url}
            imageAlt={modalImage.value!.alt}
            getImageUrl={(url) => url}
            slugsToPreload={[]}
            onClose={() => {
              modalImage.value = null;
            }}
          />
        )}
      </Show>
    </>
  );
}
export type { GridItem };
