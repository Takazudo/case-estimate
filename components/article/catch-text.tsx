import type { ReactNode } from 'react';

interface CatchTextProps {
  children: ReactNode;
}

export function CatchText({ children }: CatchTextProps) {
  return <p className="text-lg font-bold">{children}</p>;
}
