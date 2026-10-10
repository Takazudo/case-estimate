import type { Child } from '@takazudo/zfb/zudo-react';

interface H3Props {
  children: Child;
  subText?: string;
  id?: string;
}

export const H3 = ({ children, subText, id }: H3Props) => {
  return (
    <h3
      id={id}
      class="text-sm sm:text-lg font-bold border-t-1 border-zd-white pt-vgap-sm pb-vgap-sm font-futura"
    >
      <span class="flow-root">
        <span class="flex justify-between items-center relative group">
          <span>
            {children}
            {id && (
              <span class="inline-block w-0 h-0 relative align-bottom">
                <a
                  href={`#${id}`}
                  aria-hidden="true"
                  class="font-bold hidden no-underline text-zd-gray absolute left-0 bottom-0 px-[0.4em] group-hover:block"
                >
                  #
                </a>
              </span>
            )}
          </span>
          {subText && <span class="text-base font-normal text-zd-gray">{subText}</span>}
        </span>
      </span>
    </h3>
  );
};
