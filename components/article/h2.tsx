import React from 'react';

interface H2Props {
  children: React.ReactNode;
  id?: string;
  noTopPad?: boolean;
}

export const H2: React.FC<H2Props> = ({ children, id, noTopPad = false }) => {
  return (
    <h2
      id={id}
      className={`
        group
        ${noTopPad ? '' : 'md:pt-vgap-sm lg:pt-vgap-lg'}
        text-base md:text-lg sm:text-xl pb-vgap-md font-bold ml-[-1.5em] pl-[1.5em]
        clear-both
      `}
    >
      <span className="block border-t-1 border-zd-white will-change-[transform]">
        <span
          className="
            inline-block border-t-[8px] border-zd-white
            pt-vgap-sm mt-[-1px]
            min-w-[30%]
          "
        >
          <span className="block relative">
            {children}
            {id && (
              <span
                className="
                  inline-block w-0 h-0
                  relative align-bottom
                "
              >
                <a
                  href={`#${id}`}
                  aria-hidden="true"
                  className="
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
