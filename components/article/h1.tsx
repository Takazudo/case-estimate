import type { ReactNode } from 'react';

interface H1Props {
  children: ReactNode;
  id?: string;
}

export function H1({ children, id }: H1Props) {
  return (
    <h1
      id={id}
      className={`
        text-3xl font-bold text-white text-center
        text-shadow-lg
        mb-vgap-xl
        font-futura
      `}
    >
      {children}
    </h1>
  );
}
