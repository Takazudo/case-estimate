'use client';

import { computed, For, getScope, Show, signal } from '@takazudo/zfb/zudo-react';
import { getGalleryItemBySlug } from '@/data/gallery-data';
import { getImageUrl } from '@/utils/cdn-urls';
import { Blurhash } from '@/components/blurhash';
import ModelGalleryDialog from '@/components/model-gallery-dialog';

interface ModelGalleryProps {
  main: string;
  subs: string[];
}

function ModelImage({
  slug,
  size,
  onOpen,
  main = false,
}: {
  slug: string;
  size: '900w' | '600w';
  onOpen: (slug: string) => void;
  main?: boolean;
}) {
  const item = getGalleryItemBySlug(slug);
  const url = getImageUrl(slug, size);
  const loaded = signal(false);
  const error = signal(false);
  const ref: { current: HTMLImageElement | null } = { current: null };
  getScope().onActivate(() => {
    const image = ref.current;
    if (!image) return;
    let timeout: number | undefined;
    let observer: IntersectionObserver | undefined;
    const load = () => {
      if (!image.src) image.src = url;
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
    } else load();
    return () => {
      if (timeout !== undefined) window.clearTimeout(timeout);
      observer?.disconnect();
    };
  });
  return (
    <button
      type="button"
      on:click={() => onOpen(slug)}
      class={
        main
          ? 'relative block border border-zd-white w-full aspect-square overflow-hidden bg-gray-900 transition-transform hover:ring-3 hover:ring-zd-link focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black'
          : 'relative block border border-zd-white aspect-square overflow-hidden bg-gray-900 transition-transform hover:ring-2 hover:ring-zd-link focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-black'
      }
      aria-label={item?.imageAlt || `View enlarged image ${slug}`}
    >
      <Show when={computed(() => !error.value && Boolean(item?.blurhash))}>
        {() => (
          <div class="absolute inset-0">
            <Blurhash
              hash={item!.blurhash!}
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
            ref={ref}
            data-src={url}
            alt={item?.imageAlt || `Gallery image ${slug}`}
            class="absolute inset-0 block h-full w-full object-cover transition-opacity duration-300"
            decoding="async"
            loading="lazy"
            style={computed(() => ({ opacity: loaded.value ? 1 : 0 }))}
            on:load={() => {
              loaded.value = true;
            }}
            on:error={() => {
              error.value = true;
            }}
          />
        )}
      </Show>
    </button>
  );
}

export default function ModelGallery({ main, subs }: ModelGalleryProps) {
  const selected = signal<string | null>(null);
  const allSlugs = [main, ...subs];
  return (
    <div class="w-full">
      <div class="relative mb-4">
        <ModelImage
          slug={main}
          size="900w"
          main
          onOpen={(slug) => {
            selected.value = slug;
          }}
        />
      </div>
      <Show when={signal(subs.length > 0)}>
        {() => (
          <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[5px]">
            <For each={signal(subs)} by={(slug) => slug}>
              {(slug) => (
                <ModelImage
                  slug={slug.value}
                  size="600w"
                  onOpen={(value) => {
                    selected.value = value;
                  }}
                />
              )}
            </For>
          </div>
        )}
      </Show>
      <Show when={computed(() => selected.value !== null)}>
        {() => (
          <ModelGalleryDialog
            slug={selected.value!}
            allSlugs={allSlugs}
            onClose={() => {
              selected.value = null;
            }}
          />
        )}
      </Show>
    </div>
  );
}
