import { computed, getScope, type Ref } from '@takazudo/zfb/zudo-react';
import NavigationLink from './navigation-link';
import ArrowRight from './icons/arrow-right';
import MobileMenuToggle from './mobile-menu-toggle';
import BuildButton from './build-button';
import LogoLink from './logo-link';
import { read, type Reactive } from '@/utils/reactive';
import type { NavigationController } from './navigation-context';

interface NavItem {
  href: string;
  label: string;
}
interface Props {
  isOpen: Reactive<boolean>;
  onClose: () => void;
  navigationItems: readonly NavItem[];
  currentPath: Reactive<string>;
  navigation?: NavigationController;
}

export default function MobileMenuDrawer({
  isOpen,
  onClose,
  navigationItems,
  currentPath,
  navigation,
}: Props) {
  const dialog: Ref<HTMLDialogElement> = { current: null };
  const scope = getScope();
  let previousPath = read(currentPath);
  scope.effect(() => {
    const path = read(currentPath);
    if (path !== previousPath) {
      previousPath = path;
      if (read(isOpen)) onClose();
    }
  });
  scope.effect(() => {
    const node = dialog.current;
    if (!node) return;
    if (!read(isOpen)) {
      if (node.open) node.close();
      return;
    }
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!node.open) node.showModal();
    node.querySelector<HTMLElement>('button[aria-label="メニューを閉じる"]')?.focus();
    return () => {
      if (node.open) node.close();
      document.body.style.overflow = oldOverflow;
      previousFocus?.focus();
    };
  });
  const open = computed(() => read(isOpen));
  const onCancel = (event: Event) => {
    event.preventDefault();
    onClose();
  };
  const onDialogClick = (event: MouseEvent) => {
    if (event.target === dialog.current) onClose();
  };
  return (
    <dialog
      ref={dialog}
      on:cancel={onCancel}
      on:click={onDialogClick}
      aria-label="メインナビゲーション"
      class="fixed inset-0 w-screen h-screen max-w-none max-h-none m-0 p-0 border-0 bg-transparent text-zd-white z-50 font-futura backdrop:bg-black/50"
    >
      <div class="fixed right-0 top-0 h-full w-full bg-zd-black shadow-xl flex flex-col">
        <div class="flex items-center justify-between border-b border-dashed border-zd-gray px-hgap-sm py-vgap-sm">
          <LogoLink onClick={onClose} currentPath={currentPath} navigation={navigation} />
          <MobileMenuToggle isOpen={open} onToggle={onClose} aria-label="メニューを閉じる" />
        </div>
        <nav class="flex-1 overflow-y-auto" aria-label="メインナビゲーション">
          <ul class="pt-vgap-sm pb-vgap-md px-[3px]">
            {navigationItems.map((item) => (
              <li>
                {item.href === '/m' ? (
                  <div class="px-hgap-sm pt-vgap-sm">
                    <BuildButton href={item.href} size="sm" className="w-full justify-center" />
                  </div>
                ) : (
                  <NavigationLink
                    href={item.href}
                    currentPath={currentPath}
                    navigation={navigation}
                    className="flex items-center gap-1 px-hgap-sm py-vgap-xs text-sm text-zd-white transition-colors hover:bg-zd-gray/30"
                    activeClassName="pointer-events-none no-underline"
                    onClick={onClose}
                  >
                    <span class="w-[18px] h-[18px] flex-shrink-0 pr-[7px] pt-[3px]">
                      <ArrowRight className="w-full h-full" />
                    </span>
                    <span class="flex-1 pr-2 break-keep">{item.label}</span>
                  </NavigationLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </dialog>
  );
}
