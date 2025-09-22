import type { ReactNode } from 'react';

interface ULProps {
  children: ReactNode;
}

export function UL({ children }: ULProps) {
  return <ul className="mb-vgap-sm ml-hgap-sm list-disc space-y-2 text-white">{children}</ul>;
}
