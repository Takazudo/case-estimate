import { getScope } from '@takazudo/zfb/zudo-react';
import type { CSSProperties } from '@takazudo/zfb/zudo-react';
import { decode } from 'blurhash';
import type { Reactive } from '@/utils/reactive';
import { read } from '@/utils/reactive';

interface BlurhashProps {
  hash: Reactive<string>;
  width?: number | string;
  height?: number | string;
  resolutionX?: number;
  resolutionY?: number;
  punch?: number;
  className?: string;
  style?: CSSProperties;
}

export function Blurhash({
  hash,
  width = '100%',
  height = '100%',
  resolutionX = 32,
  resolutionY = 32,
  punch = 1,
  className = '',
  style,
}: BlurhashProps) {
  const canvasRef: { current: HTMLCanvasElement | null } = { current: null };
  getScope().effect(() => {
    const value = read(hash);
    const canvas = canvasRef.current;
    if (!value || !canvas) return;
    try {
      const pixels = decode(value, resolutionX, resolutionY, punch);
      const context = canvas.getContext('2d');
      if (!context) return;
      const image = context.createImageData(resolutionX, resolutionY);
      image.data.set(pixels);
      context.putImageData(image, 0, 0);
    } catch (error) {
      console.error('Blurhash decode error:', error);
    }
  });
  return (
    <span
      class={`inline-block relative ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        width={resolutionX}
        height={resolutionY}
        class="absolute top-0 bottom-0 left-0 right-0 w-full h-full"
        style={{ 'image-rendering': 'auto' }}
      />
    </span>
  );
}
