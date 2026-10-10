import type { Child } from '@takazudo/zfb/zudo-react';

interface H2Props {
  children: Child;
  id?: string;
  noTopPad?: boolean;
}

export const H2 = ({ children, id, noTopPad = false }: H2Props) => {
  return (
    <h2
      id={id}
      class={`
        group
        ${noTopPad ? '' : 'md:pt-vgap-sm lg:pt-vgap-lg'}
        text-base md:text-lg lg:text-xl pb-vgap-md lg:pb-vgap-lg font-bold -ml-[1.5em] pl-[1.5em]
        clear-both
        font-futura
      `}
    >
      <span class="block border-t-1 border-zd-white will-change-[transform]">
        <span
          class="
            inline-block border-t-[8px] border-zd-white
            pt-vgap-md -mt-[1px]
            min-w-[30%]
          "
        >
          <span class="block relative">
            {children}
            {id && (
              <span
                class="
                  inline-block w-0 h-0
                  relative align-bottom
                "
              >
                <a
                  href={`#${id}`}
                  aria-hidden="true"
                  class="
                    font-bold hidden no-underline text-zd-white
                    text-sm sm:text-base md:text-xl
                    hover:text-white
                    group-hover:block
                    absolute left-0 bottom-0
                    px-[.4em]
                  "
                >
                  #
                </a>
              </span>
            )}
          </span>
        </span>
      </span>
    </h2>
  );
};
