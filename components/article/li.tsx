import type { ReactNode } from 'react';

interface LIProps {
  children: ReactNode;
}

export function LI({ children }: LIProps) {
  return <li className="text-white leading-relaxed">{children}</li>;
}
