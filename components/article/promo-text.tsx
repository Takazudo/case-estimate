import type { ReactNode } from 'react';

interface PromoTextProps {
  children: ReactNode;
}

export function PromoText({ children }: PromoTextProps) {
  return <p className="text-lg font-bold">{children}</p>;
}
