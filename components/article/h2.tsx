import type { ReactNode } from 'react';

interface H2Props {
  children: ReactNode;
  id?: string;
}

export function H2({ children, id }: H2Props) {
  return (
    <h2
      id={id}
      className="group text-2xl font-bold text-white mb-vgap-sm mt-vgap-lg pt-vgap-sm border-t-2 border-white/20"
    >
      <span className="relative">
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
    </h2>
  );
}
