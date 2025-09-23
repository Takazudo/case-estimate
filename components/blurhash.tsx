import React, { useEffect, useRef } from 'react';
import { decode } from 'blurhash';

interface BlurhashProps {
  hash: string;
  width?: number | string;
  height?: number | string;
  resolutionX?: number;
  resolutionY?: number;
  punch?: number;
  className?: string;
  style?: React.CSSProperties;
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!hash || !canvasRef.current) return;

    try {
      const pixels = decode(hash, resolutionX, resolutionY, punch);
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      const imageData = ctx.createImageData(resolutionX, resolutionY);
      imageData.data.set(pixels);
      ctx.putImageData(imageData, 0, 0);
    } catch (error) {
      console.error('Blurhash decode error:', error);
    }
  }, [hash, resolutionX, resolutionY, punch]);

  const dynamicStyles: React.CSSProperties = {
    width,
    height,
    ...style,
  };

  return (
    <span className={`inline-block relative ${className}`} style={dynamicStyles}>
      <canvas
        ref={canvasRef}
        width={resolutionX}
        height={resolutionY}
        className="absolute top-0 bottom-0 left-0 right-0 w-full h-full"
        style={{ imageRendering: 'auto' }}
      />
    </span>
  );
}
