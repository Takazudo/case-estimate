'use client';

import ArrowRight from './icons/arrow-right';
import NavigationLink from './navigation-link';

interface AppHeaderProps {
  fullWidth?: boolean;
}

export default function AppHeader({ fullWidth = false }: AppHeaderProps) {
  return (
    <header className="bg-zd-gray2 border-b border-dashed border-zd-gray flex-shrink-0">
      <div className={`px-hgap-sm py-vgap-sm ${!fullWidth ? 'max-w-[1280px] mx-auto' : ''}`}>
        <div className="flex items-center justify-between">
          {/* Logo and Navigation Links */}
          <div className="flex items-center gap-hgap-md">
            {/* Logo */}
            <NavigationLink
              href="/"
              className="text-base md:text-xl text-zd-white flex items-center gap-hgap-xs hover:opacity-80 transition-opacity"
            >
              <img
                src="/takazudo-logo.svg"
                alt="Takazudo Logo"
                className="w-12 h-12 brightness-0 invert"
              />
              <span className="whitespace-nowrap">Takazudo Modular: Panels</span>
            </NavigationLink>

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
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-hgap-xs">
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
