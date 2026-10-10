import { BookmarkIcon } from '@/components/icons/bookmark-icon';
import { ArrowDownIcon } from '@/components/icons/arrow-down-icon';

interface TocItem {
  id: string;
  label: string;
}

interface CaseModelsTocProps {
  items: TocItem[];
}

export const CaseModelsToc = ({ items }: CaseModelsTocProps) => {
  const iconClassName = `
    absolute
    top-[10px] md:top-[15px] lg:top-0
    scale-50 md:scale-75 lg:scale-100
    origin-top-right
    right-[20px] lg:right-auto lg:-left-[60px]
    text-zd-white
  `;

  const listClassName = `
    pt-vgap-md pb-vgap-sm mb-vgap-sm
    pr-[50px] md:pr-[60px] lg:pr-hgap-md
    border-t border-dashed border-zd-white border-l-0 border-r-0 border-b-0
    lg:border lg:pl-hgap-md
    list-none pl-0
    sm:text-base leading-tight
    case-models-toc-list
  `;

  const arrowClassName = `
    inline-block
    w-[24px] h-[24px]
    mr-[8px]
    translate-y-[.3em]
    align-baseline
  `;

  return (
    <div class="mt-vgap-lg lg:pl-[60px]">
      <div class="mx-auto max-w-[1000px]">
        <div class="relative text-zd-white">
          <BookmarkIcon className={iconClassName} />
        </div>
        <ul class={listClassName}>
          {items.map((item) => (
            <li key={item.id} class="pb-vgap-xs">
              <ArrowDownIcon className={arrowClassName} />
              <a href={`#${item.id}`} class="zd-invert-color-link">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
