import { computed, signal } from '@takazudo/zfb/zudo-react';
import ArrowRight from './icons/arrow-right';
import NavigationLink from './navigation-link';
import MobileMenuToggle from './mobile-menu-toggle';
import MobileMenuDrawer from './mobile-menu-drawer';
import BuildButton from './build-button';
import LogoLink from './logo-link';
import { NAVIGATION_ITEMS } from '@/data/navigation';
import { useCurrentPath } from '@/hooks/use-current-path';
import { read, type Reactive } from '@/utils/reactive';
import { normalizePath } from '@/utils/normalize-path';
import type { NavigationController } from './navigation-context';

interface AppHeaderProps {
  fullWidth?: Reactive<boolean>;
  currentPath?: Reactive<string>;
  navigation?: NavigationController;
}
function NavItem({
  href,
  label,
  currentPath,
  navigation,
}: {
  href: string;
  label: string;
  currentPath: Reactive<string>;
  navigation?: NavigationController;
}) {
  return (
    <NavigationLink
      href={href}
      currentPath={currentPath}
      navigation={navigation}
      className="flex items-center text-sm text-zd-white transition-colors px-[5px] py-[3px] rounded-sm group zd-invert-color-link"
      activeClassName="pointer-events-none hover:text-zd-white hover:bg-transparent no-underline"
    >
      <ArrowRight className="w-[18px] mr-[7px] group-hover:text-zd-black relative bottom-[-2px]" />
      <span>{label}</span>
    </NavigationLink>
  );
}
export default function AppHeader({ fullWidth, currentPath, navigation }: AppHeaderProps) {
  const fallback = useCurrentPath();
  const path = currentPath ?? navigation?.currentPath ?? fallback;
  const width = computed(() =>
    fullWidth === undefined ? normalizePath(read(path)) === '/m' : read(fullWidth),
  );
  const containerClass = computed(
    () => `px-hgap-sm py-vgap-sm box-content ${width.value ? '' : 'max-w-[1280px] mx-auto'}`,
  );
  const isMenuOpen = signal(false);
  const closeMenu = () => {
    isMenuOpen.value = false;
  };
  const desktop = NAVIGATION_ITEMS.filter((item) => item.href !== '/m');
  const first = desktop.slice(0, 2),
    second = desktop.slice(2);
  return (
    <>
      <header class="backdrop-blur-md border-b border-dashed border-zd-gray flex-shrink-0 font-futura font-semibold fixed top-0 left-0 right-0 z-50 bg-zd-black/70">
        <div class={containerClass}>
          <div class="flex items-center justify-between">
            <LogoLink currentPath={path} navigation={navigation} />
            <div class="flex items-center gap-hgap-xs">
              <nav class="hidden lg:flex flex-col xl:flex-row gap-y-[2px] xl:gap-hgap-xs pr-[10px]">
                <div class="flex items-center gap-hgap-xs xl:gap-hgap-sm">
                  {first.map((item) => (
                    <NavItem
                      href={item.href}
                      label={item.label}
                      currentPath={path}
                      navigation={navigation}
                    />
                  ))}
                </div>
                <div class="flex items-center gap-hgap-xs xl:gap-hgap-sm">
                  {second.map((item) => (
                    <NavItem
                      href={item.href}
                      label={item.label}
                      currentPath={path}
                      navigation={navigation}
                    />
                  ))}
                </div>
              </nav>
              <span class="hidden md:inline-flex">
                <BuildButton href="/m" size="md" />
              </span>
              <div class="flex items-center justify-center lg:hidden">
                <MobileMenuToggle
                  isOpen={isMenuOpen}
                  onToggle={() => {
                    isMenuOpen.value = !isMenuOpen.value;
                  }}
                  className=""
                />
              </div>
            </div>
          </div>
        </div>
      </header>
      <MobileMenuDrawer
        isOpen={isMenuOpen}
        onClose={closeMenu}
        navigationItems={NAVIGATION_ITEMS}
        currentPath={path}
        navigation={navigation}
      />
    </>
  );
}
