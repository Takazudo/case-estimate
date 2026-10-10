import type { Child } from '@takazudo/zfb/zudo-react';

interface ULProps {
  children: Child;
}

export function UL({ children }: ULProps) {
  return (
    <ul
      class={`
        list-disc ml-[1.5em] pb-vgap-md
        article-list
      `}
    >
      {children}
    </ul>
  );
}
