'use client';

import { For, signal } from '@takazudo/zfb/zudo-react';
import ArticleImageDialog from './article-image-dialog';
import { BlurhashLoader } from '@/components/blurhash-loader';

interface GridImageItem {
  thumbUrl: string;
  enlargeUrl: string;
  imageAlt: string;
  heading: string;
  subHeading?: string;
  blurhash?: string;
}
interface Props {
  items: GridImageItem[];
  className?: string;
}

export function ArticleGridImageList({ items, className = '' }: Props) {
  const currentImageIndex = signal<number | null>(null);
  return (
    <>
      <div
        class={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-hgap-sm gap-y-vgap-md pt-vgap-sm pb-vgap-lg ${className}`}
      >
        <For
          each={signal(items.map((item, index) => ({ item, index })))}
          by={(entry) => entry.index}
        >
          {(entry) => {
            const { item, index } = entry.value;
            return (
              <dl>
                <dt class="text-sm lg:text-base font-bold text-zd-white border-t-1 border-zd-white pt-vgap-sm pb-vgap-sm">
                  <span class="flex justify-between items-center">
                    <span>{item.heading}</span>
                    {item.subHeading && (
                      <span class="text-sm font-normal text-zd-gray">{item.subHeading}</span>
                    )}
                  </span>
                </dt>
                <dd class="mt-0">
                  <button
                    type="button"
                    on:click={() => {
                      currentImageIndex.value = index;
                    }}
                    class="relative w-full aspect-square group cursor-pointer border-[3px] border-zd-link rounded-md p-[3px]"
                    aria-label={`Enlarge ${item.imageAlt} image`}
                  >
                    {item.blurhash ? (
                      <BlurhashLoader
                        blurHash={item.blurhash}
                        imgUrl={item.thumbUrl}
                        alt={item.imageAlt}
                        className="w-full h-full bg-white group-hover:opacity-90 transition-opacity rounded-md"
                        loading="lazy"
                      />
                    ) : (
                      <img
                        src={item.thumbUrl}
                        alt={item.imageAlt}
                        class="w-full h-full object-cover bg-white group-hover:opacity-90 transition-opacity rounded-md"
                        loading="lazy"
                      />
                    )}
                    <div class="absolute top-2 right-2 p-1 bg-black bg-opacity-20 rounded opacity-100 z-20">
                      <img src="/enlarge.svg" alt="Enlarge" class="w-5 h-5 brightness-0 invert" />
                    </div>
                  </button>
                </dd>
              </dl>
            );
          }}
        </For>
      </div>
      <ArticleImageDialog
        items={items}
        currentIndex={currentImageIndex}
        onClose={() => {
          currentImageIndex.value = null;
        }}
        onNavigate={(index) => {
          currentImageIndex.value = index;
        }}
      />
    </>
  );
}
export type { GridImageItem };
