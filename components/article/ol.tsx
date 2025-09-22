import type { ReactNode } from 'react';

interface OLProps {
  children: ReactNode;
}

export function OL({ children }: OLProps) {
  return <ol className="mb-vgap-sm ml-hgap-sm list-decimal space-y-2 text-white">{children}</ol>;
}
