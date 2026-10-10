'use client';

import { computed, For, getScope, Show, signal } from '@takazudo/zfb/zudo-react';
import type { GalleryItem } from '@/data/gallery-data';
import { getThumbnailUrl } from '@/data/gallery-data';
import { Blurhash } from '@/components/blurhash';

interface GalleryThumbnailGridProps {
  items: GalleryItem[];
}

function GalleryThumbnailButton({ item }: { item: GalleryItem }) {
  const src = getThumbnailUrl(item.slug);
  const imageRef: { current: HTMLImageElement | null } = { current: null };
  const loaded = signal(false);
  const error = signal(false);
  getScope().onActivate(() => {
    const image = imageRef.current;
    if (!image) return;
    let timeout: number | undefined;
    let observer: IntersectionObserver | undefined;
    const load = () => {
      if (!image.src) image.src = src;
    };
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            load();
            observer?.disconnect();
          }
        },
        { rootMargin: '100px', threshold: 0.01 },
      );
      timeout = window.setTimeout(() => observer?.observe(image), 50);
    } else {
      load();
    }
    return () => {
      if (timeout !== undefined) window.clearTimeout(timeout);
      observer?.disconnect();
    };
  });
  return (
    <li class="relative" role="listitem">
      <button
        type="button"
        data-testid="gallery-thumbnail"
        data-slug={item.slug}
        on:click={() =>
          history.pushState(null, '', `/gallery/?id=${encodeURIComponent(item.slug)}`)
        }
        class="group relative block aspect-square w-full overflow-hidden bg-gray-900 transition-transform hover:ring-3 hover:ring-zd-link hover:z-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black focus:z-10"
        aria-haspopup="dialog"
        aria-label={item.imageAlt || `Open gallery image ${item.slug}`}
        aria-controls="gallery-dialog"
      >
        <Show when={computed(() => !error.value && Boolean(item.blurhash))}>
          {() => (
            <div class="absolute inset-0">
              <Blurhash
                hash={item.blurhash!}
                width="100%"
                height="100%"
                className="absolute inset-0"
              />
              <div class="absolute inset-0 backdrop-blur-xl opacity-50" />
            </div>
          )}
        </Show>
        <Show
          when={computed(() => !error.value)}
          fallback={() => (
            <span class="flex h-full w-full items-center justify-center text-sm text-gray-300">
              Image failed to load
            </span>
          )}
        >
          {() => (
            <img
              ref={imageRef}
              data-src={src}
              alt={item.imageAlt || `Gallery image ${item.slug}`}
              class="absolute inset-0 block h-full w-full object-cover transition-opacity duration-300"
              decoding="async"
              style={computed(() => ({ opacity: loaded.value ? 1 : 0 }))}
              on:load={() => {
                loaded.value = true;
                error.value = false;
              }}
              on:error={() => {
                error.value = true;
              }}
            />
          )}
        </Show>
      </button>
    </li>
  );
}

export default function GalleryThumbnailGrid({ items }: GalleryThumbnailGridProps) {
  return (
    <ul
      data-testid="gallery-thumbnail-grid"
      class="grid grid-cols-2 gap-[1px] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      role="list"
    >
      <For each={signal(items)} by={(item) => item.slug}>
        {(item) => <GalleryThumbnailButton item={item.value} />}
      </For>
    </ul>
  );
}
