'use client';

import * as React from 'react';
import { useState, useCallback } from 'react';
import ArticleImageDialog from './article-image-dialog';
import { BlurhashLoader } from '@/components/blurhash-loader';

interface GridImageItem {
  thumbUrl: string;
  enlargeUrl: string;
  imageAlt: string;
  heading: string;
  subHeading?: string;
  blurhash?: string;
}

interface ArticleGridImageListProps {
  items: GridImageItem[];
  className?: string;
}

const ArticleGridImageList: React.FC<ArticleGridImageListProps> = ({ items, className = '' }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);

  const handleEnlargeClick = useCallback((index: number) => {
    setCurrentImageIndex(index);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setCurrentImageIndex(null);
  }, []);

  return (
    <>
      <div
        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-hgap-sm gap-y-vgap-md pt-vgap-sm pb-vgap-lg ${className}`}
      >
        {items.map((item, index) => (
          <dl key={index}>
            <dt className="text-sm lg:text-base font-bold text-zd-white border-t-1 border-zd-white pt-vgap-sm pb-vgap-sm">
              <span className="flex justify-between items-center">
                <span>{item.heading}</span>
                {item.subHeading && (
                  <span className="text-sm font-normal text-zd-gray">{item.subHeading}</span>
                )}
              </span>
            </dt>
            <dd className="mt-0">
              <button
                onClick={() => handleEnlargeClick(index)}
                className="relative w-full aspect-square group cursor-pointer border-[3px] border-zd-link rounded-md p-[3px]"
                aria-label={`Enlarge ${item.imageAlt} image`}
              >
                {item.blurhash ? (
                  <BlurhashLoader
                    blurHash={item.blurhash}
                    imgUrl={item.thumbUrl}
                    alt={item.imageAlt}
                    className="w-full h-full bg-white group-hover:opacity-90 transition-opacity rounded-md"
                  />
                ) : (
                  <img
                    src={item.thumbUrl}
                    alt={item.imageAlt}
                    className="w-full h-full object-cover bg-white group-hover:opacity-90 transition-opacity rounded-md"
                    loading="lazy"
                  />
                )}
                <div className="absolute top-2 right-2 p-1 bg-black bg-opacity-20 rounded opacity-100 z-20">
                  <img src="/enlarge.svg" alt="Enlarge" className="w-5 h-5 brightness-0 invert" />
                </div>
              </button>
            </dd>
          </dl>
        ))}
      </div>

      <ArticleImageDialog
        items={items}
        currentIndex={currentImageIndex}
        onClose={handleCloseDialog}
        onNavigate={setCurrentImageIndex}
      />
    </>
  );
};

export { ArticleGridImageList };
export type { GridImageItem };
