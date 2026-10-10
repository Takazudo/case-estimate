import NavigationLink from './navigation-link';
import TakazudoLogo from './icons/takazudo-logo';
import type { Reactive } from '@/utils/reactive';
import type { NavigationController } from './navigation-context';
interface Props {
  onClick?: () => void;
  currentPath?: Reactive<string>;
  navigation?: NavigationController;
}
export default function LogoLink({ onClick, currentPath, navigation }: Props) {
  return (
    <NavigationLink
      href="/"
      currentPath={currentPath}
      navigation={navigation}
      className="text-[1.2rem] lg:text-xl text-zd-white flex items-center gap-hgap-xs hover:opacity-80 transition-opacity no-underline zd-invert-color-link"
      activeClassName="pointer-events-none opacity-100 hover:opacity-100"
      onClick={onClick}
    >
      <TakazudoLogo className="w-[30px] h-[30px] lg:w-[50px] lg:h-[50px]" />
      <span class="whitespace-nowrap font-normal font-futura">Takazudo Modular: Panels</span>
    </NavigationLink>
  );
}
