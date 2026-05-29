'use client';

import React from 'react';
import { encodeCase } from '@/utils/url-encoder';
import { BlurhashLoader } from '@/components/blurhash-loader';

interface GridImageItem {
  id: string;
  href?: string;
  caseId?: string;
  caption: string;
  imgSrc?: string; // Optional for future real images
  blurhash?: string;
}

interface GridImagesProps {
  items: GridImageItem[];
  onItemClick?: (caseId: string) => void;
  className?: string;
}

const GridImages: React.FC<GridImagesProps> = ({ items, onItemClick, className = '' }) => {
  const getHref = (item: GridImageItem): string => {
    if (item.href) return item.href;
    if (item.caseId) return `/m?c=${encodeCase(item.caseId)}`;
    return '#';
  };

  return (
    <div
      className={`
        grid grid-cols-2 md:grid-cols-4
        gap-hgap-sm md:gap-hgap-sm
        ${className}
      `}
    >
      {items.map((item) => (
        <a
          key={item.id}
          href={getHref(item)}
          onClick={() => onItemClick?.(item.caseId || '')}
          className="group block cursor-pointer border-[3px] border-zd-link rounded-md p-[3px]"
        >
          <div className="space-y-vgap-xs">
            {/* Image placeholder - white square */}
            <div className="aspect-square bg-white rounded-sm overflow-hidden">
              {item.imgSrc ? (
                item.blurhash ? (
                  <BlurhashLoader
                    blurHash={item.blurhash}
                    imgUrl={item.imgSrc}
                    alt={item.caption}
                    className="w-full h-full"
                    loading="lazy"
                  />
                ) : (
                  <img
                    src={item.imgSrc}
                    alt={item.caption}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
            {/* Caption */}
            <p className="py-vgap-sm text-center group-hover:text-zd-link transition-colors">
              {item.caption}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default GridImages;
