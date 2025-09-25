import type { ReactNode } from 'react';

interface PProps {
  children: ReactNode;
}

export function P({ children }: PProps) {
  return <p className="pb-vgap-md text-white">{children}</p>;
}
