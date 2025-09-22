import type { ReactNode } from 'react';

interface BlockquoteProps {
  children: ReactNode;
}

export function Blockquote({ children }: BlockquoteProps) {
  return (
    <blockquote className="border-l-4 border-white/40 pl-hgap-sm py-vgap-xs mb-vgap-sm italic text-white/80">
      {children}
    </blockquote>
  );
}
