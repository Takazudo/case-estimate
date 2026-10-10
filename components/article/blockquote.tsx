import type { Child } from '@takazudo/zfb/zudo-react';

interface BlockquoteProps {
  children: Child;
}

export function Blockquote({ children }: BlockquoteProps) {
  return (
    <blockquote class="border-l-4 border-white/40 pl-hgap-sm py-vgap-xs mb-vgap-sm italic text-white/80">
      {children}
    </blockquote>
  );
}
