import { getScope, signal, type ReadonlySignal } from '@takazudo/zfb/zudo-react';
import { normalizePath } from '@/utils/normalize-path';

const FADE_IN = 400;
const NAVIGATION_TIMEOUT = 2000;

/** One controller per mounted chrome island. Timers and listeners belong to its scope. */
export function createNavigationController(initialPath = '') {
  const scope = getScope();
  const currentPath = signal(normalizePath(initialPath));
  const isPageLoading = signal(false);
  const pageAnimationClass = signal('');
  let navigationTimer: ReturnType<typeof setTimeout> | undefined;
  let fadeTimer: ReturnType<typeof setTimeout> | undefined;
  let previousPath = normalizePath(initialPath);

  const clearTimers = () => {
    if (navigationTimer) clearTimeout(navigationTimer);
    if (fadeTimer) clearTimeout(fadeTimer);
    navigationTimer = fadeTimer = undefined;
  };
  const setPath = (path: string) => {
    const next = normalizePath(path);
    currentPath.value = next;
    if (next === previousPath) return;
    previousPath = next;
    clearTimers();
    isPageLoading.value = false;
    pageAnimationClass.value = next === '/m' ? '' : 'page-fade-in';
    if (next !== '/m')
      fadeTimer = setTimeout(() => {
        pageAnimationClass.value = '';
      }, FADE_IN);
  };
  scope.onActivate(() => {
    const initial = normalizePath(window.location.pathname);
    previousPath = initial;
    currentPath.value = initial;
    pageAnimationClass.value = initial === '/m' ? '' : 'page-fade-in';
    if (initial !== '/m')
      fadeTimer = setTimeout(() => {
        pageAnimationClass.value = '';
      }, FADE_IN);
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
      clearTimers();
    };
  });
  const triggerNavigation = (path: string) => {
    clearTimers();
    if (normalizePath(path) === '/m') {
      isPageLoading.value = false;
      pageAnimationClass.value = '';
      return;
    }
    isPageLoading.value = true;
    pageAnimationClass.value = 'page-loading';
    navigationTimer = setTimeout(() => {
      isPageLoading.value = false;
      pageAnimationClass.value = 'page-fade-in';
      fadeTimer = setTimeout(() => {
        pageAnimationClass.value = '';
      }, FADE_IN);
      navigationTimer = undefined;
    }, NAVIGATION_TIMEOUT);
  };
  return {
    currentPath: currentPath as ReadonlySignal<string>,
    isPageLoading: isPageLoading as ReadonlySignal<boolean>,
    pageAnimationClass: pageAnimationClass as ReadonlySignal<string>,
    triggerNavigation,
  };
}

export type NavigationController = ReturnType<typeof createNavigationController>;
