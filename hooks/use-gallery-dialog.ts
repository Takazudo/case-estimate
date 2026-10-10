import { computed, getScope, signal } from '@takazudo/zfb/zudo-react';
import type { Reactive } from '@/utils/reactive';
import { read } from '@/utils/reactive';

interface Options {
  currentSlug: Reactive<string>;
  getImageUrl: (slug: string) => string;
  slugsToPreload?: Reactive<string[]>;
}

export function useGalleryDialog(options: Options) {
  const imageLoaded = signal(false);
  const imageError = signal(false);
  const isLoading = signal(true);
  const imageRef: { current: HTMLImageElement | null } = { current: null };
  const preloaded = new Set<string>();
  const imageUrl = computed(() => options.getImageUrl(read(options.currentSlug)));
  const scope = getScope();

  scope.effect(() => {
    const url = imageUrl.value;
    imageLoaded.value = false;
    imageError.value = false;
    isLoading.value = true;
    const check = () => {
      const image = imageRef.current;
      if (!image || !image.complete || !url) return;
      if (image.naturalWidth > 0) {
        imageLoaded.value = true;
        imageError.value = false;
      } else if (image.src) {
        imageError.value = true;
      }
      if (imageLoaded.value || imageError.value) isLoading.value = false;
    };
    const timeout = window.setTimeout(check, 0);
    const interval = window.setInterval(check, 100);
    const stop = window.setTimeout(() => window.clearInterval(interval), 30000);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
      window.clearTimeout(stop);
    };
  });

  scope.effect(() => {
    const slugs = read(options.slugsToPreload ?? []);
    const images: HTMLImageElement[] = [];
    for (const slug of slugs) {
      const url = options.getImageUrl(slug);
      if (preloaded.has(url)) continue;
      const image = new Image();
      image.onload = () => preloaded.add(url);
      image.onerror = () => preloaded.delete(url);
      image.src = url;
      images.push(image);
    }
    return () => {
      for (const image of images) {
        image.onload = null;
        image.onerror = null;
      }
    };
  });

  return {
    imageLoaded,
    imageError,
    isLoading,
    imageRef,
    handleImageLoad: () => {
      imageLoaded.value = true;
      imageError.value = false;
      isLoading.value = false;
    },
    handleImageError: () => {
      imageLoaded.value = false;
      imageError.value = true;
      isLoading.value = false;
    },
  };
}
