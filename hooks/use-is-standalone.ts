import { getScope, signal, type ReadonlySignal } from '@takazudo/zfb/zudo-react';

interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

export function useIsStandalone(): ReadonlySignal<boolean> {
  const standalone = signal(false);
  getScope().onActivate(() => {
    const media = window.matchMedia('(display-mode: standalone)');
    const update = () => {
      standalone.value =
        (window.navigator as NavigatorStandalone).standalone === true || media.matches;
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  });
  return standalone;
}
