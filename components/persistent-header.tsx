'use client';

import AppHeader from './app-header';
import { useIsStandalone } from '@/hooks/use-is-standalone';
import { useCurrentPath } from '@/hooks/use-current-path';

export default function PersistentHeader() {
  const currentPath = useCurrentPath();
  const isStandalone = useIsStandalone();

  const isFullWidth = currentPath === '/m';

  // Hide header only on /m route when in iOS standalone mode
  const shouldHideHeader = currentPath === '/m' && isStandalone;

  if (shouldHideHeader) {
    return null;
  }

  return <AppHeader fullWidth={isFullWidth} />;
}
