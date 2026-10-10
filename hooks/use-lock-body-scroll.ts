import { getScope } from '@takazudo/zfb/zudo-react';
import { read, type Reactive } from '@/utils/reactive';

export function useLockBodyScroll(isLocked: Reactive<boolean>) {
  getScope().effect(() => {
    if (!read(isLocked)) return;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) document.body.style.paddingRight = `${scrollBarWidth}px`;
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  });
}
