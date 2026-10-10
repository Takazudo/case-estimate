import { computed, type Child } from '@takazudo/zfb/zudo-react';
import { useCurrentPath } from '@/hooks/use-current-path';
import { normalizePath } from '@/utils/normalize-path';
import type { Reactive } from '@/utils/reactive';
import { read } from '@/utils/reactive';
import type { NavigationController } from './navigation-context';

interface NavigationLinkProps {
  href: string;
  className?: Reactive<string>;
  activeClassName?: string;
  children: Child;
  onClick?: () => void;
  currentPath?: Reactive<string>;
  navigation?: NavigationController;
}

export default function NavigationLink({
  href,
  className = '',
  activeClassName,
  children,
  onClick,
  currentPath,
  navigation,
}: NavigationLinkProps) {
  // The local hook keeps MDX/static links useful without an island controller.
  const browserPath = currentPath === undefined && !navigation ? useCurrentPath() : undefined;
  const active = computed(
    () =>
      normalizePath(read(currentPath ?? navigation?.currentPath ?? browserPath ?? '')) ===
      normalizePath(href),
  );
  const css = computed(
    () => `${read(className)}${active.value && activeClassName ? ` ${activeClassName}` : ''}`,
  );
  const tabindex = computed(() => (active.value ? -1 : 0));
  const ariaCurrent = computed(() => (active.value ? 'page' : undefined));
  const handleClick = (event: MouseEvent) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
      return;
    if (active.value) {
      event.preventDefault();
      return;
    }
    navigation?.triggerNavigation(href);
    onClick?.();
  };
  return (
    <a
      href={href}
      class={css}
      on:click={handleClick}
      tabindex={tabindex}
      aria-current={ariaCurrent}
    >
      {children}
    </a>
  );
}
