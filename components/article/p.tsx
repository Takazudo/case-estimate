import type { Child } from '@takazudo/zfb/zudo-react';

interface PProps {
  children: Child;
}

export function P({ children }: PProps) {
  return <p class="pb-vgap-md text-white">{children}</p>;
}
