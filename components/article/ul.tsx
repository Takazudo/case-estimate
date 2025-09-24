import type { ReactNode } from 'react';

interface ULProps {
  children: ReactNode;
}

export function UL({ children }: ULProps) {
  return (
    <ul
      className={`
        list-disc ml-[1.5em] pb-vgap-md
        [&_li]:pt-vgap-xs
      `}
    >
      {children}
    </ul>
  );
}
