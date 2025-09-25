import type { ReactNode } from 'react';

interface StrongProps {
  children: ReactNode;
}

export function Strong({ children }: StrongProps) {
  return <strong className="font-bold text-zd-strong">{children}</strong>;
}
