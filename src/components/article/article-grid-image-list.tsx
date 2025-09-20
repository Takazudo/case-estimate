import * as React from 'react';
import { useState } from 'react';
import { ImageModal } from '../modal/image-modal';

interface GridImageItem {
  thumbUrl: string;
  enlargeUrl: string;
  imageAlt: string;
  heading: string;
  subHeading?: string;
}

interface ArticleGridImageListProps {
  items: GridImageItem[];
  className?: string;
}

const ArticleGridImageList: React.FC<ArticleGridImageListProps> = ({ items, className = '' }) => {
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
        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-hgap-sm gap-y-vgap-md ${className}`}
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
                onClick={() => handleEnlargeClick(item.enlargeUrl, item.imageAlt)}
                className="relative w-full aspect-square group cursor-pointer border-[3px] border-zd-link rounded-md p-[3px]"
                aria-label={`Enlarge ${item.imageAlt} image`}
              >
                <img
                  src={item.thumbUrl}
                  alt={item.imageAlt}
                  className="w-full h-full object-cover bg-white group-hover:opacity-90 transition-opacity rounded-md"
                />
                <div className="absolute top-2 right-2 p-1 bg-black bg-opacity-20 rounded opacity-60 group-hover:opacity-80 transition-opacity">
                  <img src="/enlarge.svg" alt="Enlarge" className="w-5 h-5 brightness-0 invert" />
                </div>
              </button>
            </dd>
          </dl>
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

export { ArticleGridImageList };
export type { GridImageItem };
