'use client';

import React, { useState, useRef, useEffect, memo } from 'react';
import { Blurhash } from './blurhash';

interface BlurhashLoaderProps {
  blurHash?: string;
  imgUrl: string;
  className?: string;
  alt?: string;
  loading?: 'lazy' | 'eager';
}

// Fallback BlurHash representing a solid gray color.
// Chosen for its neutral appearance as a generic placeholder when no blurHash is provided.
const FALLBACK_HASH = 'L00000fQfQfQfQfQfQfQfQfQfQfQ';

const BlurhashLoaderComponent: React.FC<BlurhashLoaderProps> = ({
  blurHash,
  imgUrl,
  className = '',
  alt = '',
  loading = 'eager',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const hashToUse = blurHash || FALLBACK_HASH;

  useEffect(() => {
    if (!blurHash) {
      console.error('BlurHash was undefined, using fallback hash');
    }
  }, [blurHash]);

  useEffect(() => {
    // Reset loaded state when URL changes
    setImageLoaded(false);

    // Don't check for cached images - let onLoad handle it
    // This ensures blurhash is always visible initially
  }, [imgUrl]);

  return (
    <span className={`block relative overflow-hidden ${className}`}>
      <span
        className={`absolute inset-0 block transition-opacity duration-500 ease-in-out ${
          imageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <Blurhash
          hash={hashToUse}
          width="100%"
          height="100%"
          resolutionX={32}
          resolutionY={32}
          punch={1}
        />
      </span>
      <img
        ref={imgRef}
        src={imgUrl}
        className={`w-full relative z-10 aspect-square object-cover transition-opacity duration-500 ease-in-out ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        alt={alt}
        loading={loading}
        onLoad={() => {
          setImageLoaded(true);
        }}
        onError={() => {
          setImageLoaded(true);
        }}
      />
    </span>
  );
};

export const BlurhashLoader = memo(BlurhashLoaderComponent);
