import type { ReactNode } from 'react';

interface OLProps {
  children: ReactNode;
}

export function OL({ children }: OLProps) {
  return (
    <ol
      className={`
        list-decimal ml-[1.9em] pb-vgap-md
        [&_li]:pt-vgap-xs
      `}
    >
      {children}
    </ol>
  );
}
