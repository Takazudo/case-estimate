import React from 'react';

interface GridImageItem {
  id: string;
  href?: string;
  caseId?: string;
  caption: string;
  imgSrc?: string; // Optional for future real images
}

interface GridImagesProps {
  items: GridImageItem[];
  onItemClick?: (caseId: string) => void;
  className?: string;
}

const GridImages: React.FC<GridImagesProps> = ({ items, onItemClick, className = '' }) => {
  const handleClick = (e: React.MouseEvent, item: GridImageItem) => {
    if (onItemClick && item.caseId) {
      e.preventDefault();
      onItemClick(item.caseId);
    }
  };

  return (
    <div
      className={`
        lg:-mx-hgap-md
        grid grid-cols-2 md:grid-cols-4 
        gap-hgap-xs md:gap-hgap-xs
        ${className}
      `}
    >
      {items.map((item) => (
        <a
          key={item.id}
          href={item.href || '#'}
          onClick={(e) => handleClick(e, item)}
          className="group block cursor-pointer"
        >
          <div className="space-y-vgap-xs">
            {/* Image placeholder - white square */}
            <div className="aspect-square bg-white rounded-sm overflow-hidden">
              {item.imgSrc ? (
                <img src={item.imgSrc} alt={item.caption} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
            {/* Caption */}
            <p className="text-sm text-center text-zd-white group-hover:text-zd-link transition-colors">
              {item.caption}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default GridImages;
