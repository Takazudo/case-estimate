import { useEffect, useState } from 'react';
import { decode } from 'blurhash';

const CANVAS_DIMENSION = 32;
const blurhashCache = new Map<string, string>();
let sharedCanvas: HTMLCanvasElement | null = null;

const getSharedCanvas = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!sharedCanvas) {
    sharedCanvas = document.createElement('canvas');
    sharedCanvas.width = CANVAS_DIMENSION;
    sharedCanvas.height = CANVAS_DIMENSION;
  }

  return sharedCanvas;
};

export const useBlurhashPlaceholder = (blurhash?: string | null) => {
  const [placeholder, setPlaceholder] = useState('');

  useEffect(() => {
    if (!blurhash) {
      setPlaceholder('');
      return;
    }

    const cachedValue = blurhashCache.get(blurhash);
    if (cachedValue) {
      setPlaceholder(cachedValue);
      return;
    }

    const canvas = getSharedCanvas();
    if (!canvas) {
      setPlaceholder('');
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      setPlaceholder('');
      return;
    }

    try {
      const pixels = decode(blurhash, CANVAS_DIMENSION, CANVAS_DIMENSION);
      const imageData = context.createImageData(CANVAS_DIMENSION, CANVAS_DIMENSION);
      imageData.data.set(pixels);
      context.clearRect(0, 0, CANVAS_DIMENSION, CANVAS_DIMENSION);
      context.putImageData(imageData, 0, 0);
      const dataUrl = canvas.toDataURL();
      blurhashCache.set(blurhash, dataUrl);
      setPlaceholder(dataUrl);
    } catch {
      setPlaceholder('');
    }
  }, [blurhash]);

  return placeholder;
};
