import type { ReactNode } from 'react';

interface PromoTextProps {
  children: ReactNode;
}

export function PromoText({ children }: PromoTextProps) {
  return <p className="text-lg pb-vgap-sm font-bold">{children}</p>;
}
