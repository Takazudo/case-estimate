'use client';

import { BlurhashLoader } from '@/components/blurhash-loader';

interface ImgFloatRightProps {
  src: string;
  alt?: string;
  className?: string;
  blurhash?: string;
  aspectRatio?: string;
}

export function ImgFloatRight({
  src,
  alt = '',
  className = '',
  blurhash,
  aspectRatio,
}: ImgFloatRightProps) {
  return (
    <div className={`lg:float-right lg:ml-hgap-sm 2xl:-mr-hgap-md pb-vgap-lg`}>
      <div
        style={aspectRatio ? { aspectRatio } : undefined}
        className={`
          border border-zd-white
          ${className}
        `}
      >
        {blurhash ? (
          <div style={aspectRatio ? { aspectRatio } : undefined} className="w-full h-full">
            <BlurhashLoader
              blurHash={blurhash}
              imgUrl={src}
              alt={alt}
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        ) : (
          <img src={src} alt={alt} loading="lazy" />
        )}
      </div>
    </div>
  );
}
