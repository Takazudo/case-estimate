'use client';

import { computed, Show } from '@takazudo/zfb/zudo-react';
import { useIsStandalone } from '@/hooks/use-is-standalone';
import AppHeader from '@/components/app-header';
import { createNavigationController } from '@/components/navigation-context';

export default function SiteHeader({ currentPath = '' }: { currentPath?: string }) {
  const navigation = createNavigationController(currentPath);
  const standalone = useIsStandalone();
  return (
    <Show when={computed(() => navigation.currentPath.value !== '/m' || !standalone.value)}>
      {() => <AppHeader currentPath={navigation.currentPath} navigation={navigation} />}
    </Show>
  );
}
