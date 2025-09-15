import * as React from 'react';
import { ArticleH3 } from './article-h3';

interface GridItem {
  imageUrl: string;
  imageAlt: string;
  heading: string;
  content: React.ReactNode;
}

interface GridImagesAndNotesProps {
  items: GridItem[];
  className?: string;
}

const GridImagesAndNotes: React.FC<GridImagesAndNotesProps> = ({ items, className = '' }) => {
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-x-hgap-md gap-y-vgap-lg ${className}`}
    >
      {items.map((item, index) => (
        <div key={index} className="overflow-hidden">
          <ArticleH3>{item.heading}</ArticleH3>
          <div className="text-sm md:text-base">
            <div className="relative w-[200px] h-[200px] float-right ml-hgap-sm mb-vgap-sm">
              <img
                src={item.imageUrl}
                alt={item.imageAlt}
                className="w-full h-full object-contain bg-white"
              />
              <img
                src="/enlarge.svg"
                alt="Enlarge"
                className="absolute top-2 right-2 w-5 h-5 opacity-60 pointer-events-none"
              />
            </div>
            <div>{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { GridImagesAndNotes };
export type { GridItem };
