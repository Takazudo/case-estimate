'use client';

import * as React from 'react';
import { useState } from 'react';
import { ArticleH3 } from './article-h3';
import { ImageModal } from '../modal/image-modal';

interface GridItem {
  thumbUrl: string;
  enlargeUrl: string;
  imageAlt: string;
  heading: string;
  subHeading?: string;
  content: React.ReactNode;
}

interface GridImagesAndNotesProps {
  items: GridItem[];
  className?: string;
}

const GridImagesAndNotes: React.FC<GridImagesAndNotesProps> = ({ items, className = '' }) => {
  const [modalImage, setModalImage] = useState<{ url: string; alt: string } | null>(null);

  const handleEnlargeClick = (enlargeUrl: string, alt: string) => {
    setModalImage({ url: enlargeUrl, alt });
  };

  const handleCloseModal = () => {
    setModalImage(null);
  };

  return (
    <>
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-x-hgap-md gap-y-vgap-lg ${className}`}
      >
        {items.map((item, index) => (
          <div key={index} className="overflow-hidden">
            <ArticleH3 subText={item.subHeading}>{item.heading}</ArticleH3>
            <div className="text-sm md:text-base">
              <button
                onClick={() => handleEnlargeClick(item.enlargeUrl, item.imageAlt)}
                className="relative w-[200px] h-[200px] float-right ml-hgap-sm mb-vgap-sm group cursor-pointer"
                aria-label={`Enlarge ${item.imageAlt} image`}
              >
                <img
                  src={item.thumbUrl}
                  alt={item.imageAlt}
                  className="w-full h-full object-contain bg-white group-hover:opacity-90 transition-opacity"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 p-1 bg-black bg-opacity-20 rounded opacity-60 group-hover:opacity-80 transition-opacity">
                  <img src="/enlarge.svg" alt="Enlarge" className="w-5 h-5 brightness-0 invert" />
                </div>
              </button>
              <div>{item.content}</div>
            </div>
          </div>
        ))}
      </div>

      <ImageModal
        isOpen={modalImage !== null}
        imageUrl={modalImage?.url || ''}
        imageAlt={modalImage?.alt || ''}
        onClose={handleCloseModal}
      />
    </>
  );
};

export { GridImagesAndNotes };
export type { GridItem };
