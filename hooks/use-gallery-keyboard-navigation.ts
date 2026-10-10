import { getScope } from '@takazudo/zfb/zudo-react';
import type { Reactive } from '@/utils/reactive';
import { read } from '@/utils/reactive';

interface Options {
  isActive: Reactive<boolean>;
  onClose?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function useGalleryKeyboardNavigation(options: Options) {
  getScope().effect(() => {
    if (!read(options.isActive)) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      const action =
        event.key === 'Escape'
          ? options.onClose
          : event.key === 'ArrowLeft'
            ? options.onPrevious
            : event.key === 'ArrowRight'
              ? options.onNext
              : undefined;
      if (!action) return;
      event.preventDefault();
      action();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });
}
