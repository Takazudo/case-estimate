import type { Child } from '@takazudo/zfb/zudo-react';

interface StrongProps {
  children: Child;
}

export function Strong({ children }: StrongProps) {
  return <strong class="font-bold text-zd-strong">{children}</strong>;
}
