import type { Child } from '@takazudo/zfb/zudo-react';

interface PromoTextProps {
  children: Child;
}

export function PromoText({ children }: PromoTextProps) {
  return <p class="text-lg pb-vgap-sm font-bold">{children}</p>;
}
