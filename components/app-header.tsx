'use client';

import ArrowRight from './icons/arrow-right';
import NavigationLink from './navigation-link';
import TakazudoLogo from './icons/takazudo-logo';

interface AppHeaderProps {
  fullWidth?: boolean;
}

export default function AppHeader({ fullWidth = false }: AppHeaderProps) {
  return (
    <header
      className={`
        backdrop-blur-md border-b border-dashed border-zd-gray flex-shrink-0 fixed top-0 left-0 right-0 z-50 bg-zd-black/70
      `}
    >
      <div
        className={`
          px-hgap-sm py-vgap-sm
          ${!fullWidth ? 'max-w-[1280px] mx-auto' : ''}
        `}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavigationLink
            href="/"
            className="text-base md:text-xl flex items-center gap-hgap-xs hover:opacity-80 transition-opacity no-underline zd-invert-color-link"
          >
            <TakazudoLogo className="w-[50px] h-[50px]" />
            <span className="whitespace-nowrap">Takazudo Modular: Panels</span>
          </NavigationLink>

          {/* Right side actions */}
          <div className="flex items-center gap-hgap-xs">
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-hgap-sm">
              <NavigationLink
                href="/panel"
                className="flex items-center text-sm text-zd-white hover:text-zd-black hover:bg-zd-white transition-colors px-[5px] py-[3px] rounded-sm group"
              >
                <ArrowRight className="w-[18px] mr-[7px] group-hover:text-zd-black" />
                <span>パネル素材</span>
              </NavigationLink>
              <NavigationLink
                href="/selection"
                className="flex items-center text-sm text-zd-white hover:text-zd-black hover:bg-zd-white transition-colors px-[5px] py-[3px] rounded-sm group"
              >
                <ArrowRight className="w-[18px] mr-[7px] group-hover:text-zd-black" />
                <span>パネル選択</span>
              </NavigationLink>
            </nav>
            {/* CTA Button */}
            <NavigationLink
              href="/m"
              className="zd-button-gradient px-hgap-sm py-vgap-xs rounded text-sm md:text-base whitespace-nowrap"
            >
              ケースを作る
            </NavigationLink>
          </div>
        </div>
      </div>
    </header>
  );
}
