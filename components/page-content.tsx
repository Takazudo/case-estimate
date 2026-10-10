import { computed, type Child } from '@takazudo/zfb/zudo-react';
import { useCurrentPath } from '@/hooks/use-current-path';
import type { NavigationController } from './navigation-context';
export default function PageContent({
  children,
  navigation,
}: {
  children: Child;
  navigation?: NavigationController;
}) {
  const path = useCurrentPath();
  const isConfigurator = computed(() => path.value === '/m');
  const containerClass = computed(
    () => `${isConfigurator.value ? 'h-screen' : 'min-h-screen'} flex flex-col`,
  );
  const mainClass = computed(
    () =>
      `${isConfigurator.value ? 'flex-1 overflow-hidden ' : ''}${navigation?.pageAnimationClass.value ?? ''}`,
  );
  const items = Array.isArray(children) ? children : [children];
  return (
    <div class={containerClass}>
      {items.map((child, index) => (index === 1 ? <main class={mainClass}>{child}</main> : child))}
    </div>
  );
}
