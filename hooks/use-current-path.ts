import { getScope, signal, type ReadonlySignal } from '@takazudo/zfb/zudo-react';
import { normalizePath } from '@/utils/normalize-path';

/** Browser pathname, initialized without touching window during SSR. */
export function useCurrentPath(initialPath = ''): ReadonlySignal<string> {
  const path = signal(normalizePath(initialPath));
  getScope().onActivate(() => {
    const update = () => {
      path.value = normalizePath(window.location.pathname);
    };
    update();
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  });
  return path;
}
