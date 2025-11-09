import NavigationLink from './navigation-link';
import TakazudoLogo from './icons/takazudo-logo';

interface LogoLinkProps {
  onClick?: () => void;
}

export default function LogoLink({ onClick }: LogoLinkProps) {
  return (
    <NavigationLink
      href="/"
      className="text-[1.2rem] lg:text-xl text-zd-white flex items-center gap-hgap-xs hover:opacity-80 transition-opacity no-underline zd-invert-color-link"
      activeClassName="pointer-events-none opacity-100 hover:opacity-100"
      onClick={onClick}
    >
      <TakazudoLogo className="w-[30px] h-[30px] lg:w-[50px] lg:h-[50px]" />
      <span className="whitespace-nowrap font-normal font-futura">Takazudo Modular: Panels</span>
    </NavigationLink>
  );
}
