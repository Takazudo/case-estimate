import { getScope, type Ref } from '@takazudo/zfb/zudo-react';
import { read, type Reactive } from '@/utils/reactive';

interface UseFocusTrapOptions {
  isActive: Reactive<boolean>;
  autoFocus?: boolean;
  returnFocusOnDeactivate?: boolean;
  onClose?: () => void;
}

const focusableSelector =
  'button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[contenteditable="true"]';

export function useFocusTrap({
  isActive,
  autoFocus = true,
  returnFocusOnDeactivate = true,
}: UseFocusTrapOptions) {
  const containerRef: Ref<HTMLDivElement> = { current: null };
  let previous: HTMLElement | null = null;
  const elements = () =>
    Array.from(containerRef.current?.querySelectorAll<HTMLElement>(focusableSelector) || []);
  getScope().effect(() => {
    if (!read(isActive)) {
      if (returnFocusOnDeactivate && previous?.isConnected) previous.focus();
      return;
    }
    previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusTimer = autoFocus
      ? window.setTimeout(() => {
          if (read(isActive)) elements()[0]?.focus();
        }, 0)
      : undefined;
    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = elements();
      if (!items.length) {
        event.preventDefault();
        return;
      }
      const first = items[0],
        last = items[items.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !containerRef.current?.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || !containerRef.current?.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleTab);
    return () => {
      if (focusTimer !== undefined) window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleTab);
      if (returnFocusOnDeactivate && previous?.isConnected) previous.focus();
    };
  });
  return {
    containerRef,
    focusFirstElement: () => elements()[0]?.focus(),
    focusLastElement: () => elements().at(-1)?.focus(),
  };
}
