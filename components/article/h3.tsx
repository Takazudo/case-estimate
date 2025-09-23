import * as React from 'react';

interface H3Props {
  children: React.ReactNode;
  subText?: string;
  id?: string;
}

export const H3: React.FC<H3Props> = ({ children, subText, id }) => {
  return (
    <h3
      id={id}
      className="text-sm sm:text-lg font-bold border-t-1 border-zd-white pt-vgap-sm pb-vgap-sm"
    >
      <span className="flow-root">
        <span className="flex justify-between items-center relative group">
          <span>
            {children}
            {id && (
              <span className="inline-block w-0 h-0 relative align-bottom">
                <a
                  href={`#${id}`}
                  aria-hidden="true"
                  className="font-bold hidden no-underline text-zd-gray absolute left-0 bottom-0 px-[0.4em] group-hover:block"
                >
                  #
                </a>
              </span>
            )}
          </span>
          {subText && <span className="text-base font-normal text-zd-gray">{subText}</span>}
        </span>
      </span>
    </h3>
  );
};
