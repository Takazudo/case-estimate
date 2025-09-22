import type { ReactNode } from 'react';

interface PProps {
  children: ReactNode;
}

export function P({ children }: PProps) {
  return <p className="mb-vgap-sm text-white leading-relaxed">{children}</p>;
}
