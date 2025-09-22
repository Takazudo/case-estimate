import type { ReactNode } from 'react';

interface H3Props {
  children: ReactNode;
  id?: string;
}

export function H3({ children, id }: H3Props) {
  return (
    <h3 id={id} className="group text-xl font-semibold text-white mb-vgap-sm mt-vgap-md pt-vgap-xs">
      <span className="relative">
        <span className="block mb-vgap-xs h-px bg-gradient-to-r from-white/40 to-transparent" />
        {children}
        {id && (
          <a
            href={`#${id}`}
            aria-hidden="true"
            className="absolute -left-6 text-white/40 hover:text-white/60 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            #
          </a>
        )}
      </span>
    </h3>
  );
}
