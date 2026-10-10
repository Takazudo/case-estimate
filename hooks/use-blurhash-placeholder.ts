import { computed, getScope, signal } from '@takazudo/zfb/zudo-react';
import { decode } from 'blurhash';
import type { Reactive } from '@/utils/reactive';
import { read } from '@/utils/reactive';

const SIZE = 32;
const cache = new Map<string, string>();
let canvas: HTMLCanvasElement | null = null;

export function useBlurhashPlaceholder(blurhash?: Reactive<string | null | undefined>) {
  const placeholder = signal('');
  const hash = computed(() => read(blurhash));
  getScope().effect(() => {
    const value = hash.value;
    placeholder.value = '';
    if (!value) return;
    const cached = cache.get(value);
    if (cached) {
      placeholder.value = cached;
      return;
    }
    canvas ??= document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    const context = canvas.getContext('2d');
    if (!context) return;
    try {
      const pixels = decode(value, SIZE, SIZE);
      const imageData = context.createImageData(SIZE, SIZE);
      imageData.data.set(pixels);
      context.putImageData(imageData, 0, 0);
      const url = canvas.toDataURL();
      cache.set(value, url);
      placeholder.value = url;
    } catch {
      placeholder.value = '';
    }
  });
  return placeholder;
}
