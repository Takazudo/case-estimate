import type { Child } from '@takazudo/zfb/zudo-react';

interface OLProps {
  children: Child;
}

export function OL({ children }: OLProps) {
  return (
    <ol
      class={`
        list-decimal ml-[1.9em] pb-vgap-md
        article-list
      `}
    >
      {children}
    </ol>
  );
}
