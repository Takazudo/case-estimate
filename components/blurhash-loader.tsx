import { computed, signal } from '@takazudo/zfb/zudo-react';
import { Blurhash } from './blurhash';
import type { Reactive } from '@/utils/reactive';
import { read } from '@/utils/reactive';

interface BlurhashLoaderProps {
  blurHash?: Reactive<string | undefined>;
  imgUrl: Reactive<string>;
  className?: string;
  alt?: string;
  loading?: 'lazy' | 'eager';
}
const FALLBACK_HASH = 'L00000fQfQfQfQfQfQfQfQfQfQfQfQ';

export function BlurhashLoader({
  blurHash,
  imgUrl,
  className = '',
  alt = '',
  loading = 'eager',
}: BlurhashLoaderProps) {
  const loadedUrl = signal('');
  const failedUrl = signal('');
  const hash = computed(() => read(blurHash) || FALLBACK_HASH);
  const loaded = computed(() => loadedUrl.value === read(imgUrl));
  const failed = computed(() => failedUrl.value === read(imgUrl));
  return (
    <span class={`block relative overflow-hidden ${className}`}>
      <span
        class={computed(
          () =>
            `absolute inset-0 block transition-opacity duration-500 ease-in-out ${loaded.value || failed.value ? 'opacity-0 pointer-events-none' : 'opacity-100'}`,
        )}
      >
        <Blurhash hash={hash} width="100%" height="100%" />
      </span>
      <img
        src={imgUrl}
        class={computed(
          () =>
            `w-full relative z-10 aspect-square object-cover transition-opacity duration-500 ease-in-out ${loaded.value ? 'opacity-100' : 'opacity-0'}`,
        )}
        alt={alt}
        loading={loading}
        on:load={() => {
          loadedUrl.value = read(imgUrl);
          failedUrl.value = '';
        }}
        on:error={() => {
          failedUrl.value = read(imgUrl);
        }}
      />
      <span class="sr-only" role="status">
        {computed(() => (failed.value ? 'Image failed to load' : ''))}
      </span>
    </span>
  );
}
