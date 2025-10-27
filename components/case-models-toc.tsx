import React from 'react';
import { BookmarkIcon } from '@/components/icons/bookmark-icon';
import { ArrowDownIcon } from '@/components/icons/arrow-down-icon';

interface TocItem {
  id: string;
  label: string;
}

interface CaseModelsTocProps {
  items: TocItem[];
}

export const CaseModelsToc: React.FC<CaseModelsTocProps> = ({ items }) => {
  const iconClassName = `
    absolute
    top-[10px] md:top-[15px] lg:top-0
    scale-50 md:scale-75 lg:scale-100
    origin-top-right
    right-[20px] lg:right-auto lg:left-[-60px]
    text-zd-white
  `;

  const listClassName = `
    pt-vgap-sm mb-vgap-sm
    pr-[50px] md:pr-[60px] lg:pr-hgap-md
    border-t border-dashed border-zd-white border-l-0 border-r-0 border-b-0
    lg:border lg:pl-hgap-md
    list-none pl-0
    sm:text-base sm:leading-[var(--zd-font-base-lineHeight)]
    md:pt-vgap-md
    [&_li]:pl-[28px]
    [&_li+li]:mt-vgap-xs
  `;

  const arrowClassName = `
    inline-block
    w-[20px] h-[20px]
    mr-[8px]
    translate-y-[0.4em]
  `;

  return (
    <div className="mt-vgap-lg">
      <div className="relative text-zd-white">
        <BookmarkIcon className={iconClassName} />
      </div>
      <ul className={listClassName}>
        {items.map((item) => (
          <li key={item.id}>
            <ArrowDownIcon className={arrowClassName} />
            <a href={`#${item.id}`} className="text-zd-link hover:text-white no-underline">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
