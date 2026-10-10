import type { Child } from '@takazudo/zfb/zudo-react';

interface H1Props {
  children: Child;
  id?: string;
}

export function H1({ children, id }: H1Props) {
  return (
    <h1
      id={id}
      class={`
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
