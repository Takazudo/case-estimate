import { computed, Show } from '@takazudo/zfb/zudo-react';
import AppHeader from './app-header';
import { useIsStandalone } from '@/hooks/use-is-standalone';
import { useCurrentPath } from '@/hooks/use-current-path';
export default function PersistentHeader() {
  const path = useCurrentPath();
  const standalone = useIsStandalone();
  const visible = computed(() => path.value !== '/m' || !standalone.value);
  return <Show when={visible}>{() => <AppHeader currentPath={path} />}</Show>;
}
