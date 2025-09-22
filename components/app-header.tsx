'use client';

import { useRouter } from 'next/navigation';
import ArrowRight from './icons/arrow-right';

interface AppHeaderProps {
  layout?: 'fixed' | 'auto';
}

export default function AppHeader({ layout = 'fixed' }: AppHeaderProps = {}) {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/');
  };

  // Use inline styles for better transition control
  const containerStyle = {
    maxWidth: layout === 'fixed' ? '1280px' : '9999px', // Use large value instead of 'none'
    marginLeft: layout === 'fixed' ? 'auto' : '0',
    marginRight: layout === 'fixed' ? 'auto' : '0',
    backgroundColor: layout === 'fixed' ? 'rgba(127, 29, 29, 0.2)' : 'rgba(20, 83, 45, 0.2)', // Debug colors
    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <header className="bg-zd-gray2 border-b border-dashed border-zd-gray flex-shrink-0">
      <div style={containerStyle} className="px-hgap-sm py-vgap-sm">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation Links */}
          <div className="flex items-center gap-hgap-md">
            {/* Logo */}
            <button
              onClick={handleLogoClick}
              className="text-base md:text-xl text-zd-white flex items-center gap-hgap-xs hover:opacity-80 transition-opacity"
              aria-label="Go to home"
            >
              <img
                src="/takazudo-logo.svg"
                alt="Takazudo Logo"
                className="w-12 h-12 brightness-0 invert"
              />
              <span className="whitespace-nowrap">Takazudo Modular Panels</span>
            </button>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-hgap-sm">
              <a
                href="/panel"
                className="flex items-center text-sm text-zd-white hover:text-zd-black hover:bg-zd-white transition-colors px-[5px] py-[3px] rounded-sm group"
              >
                <ArrowRight className="w-[18px] mr-[7px] group-hover:text-zd-black" />
                <span>パネル素材</span>
              </a>
              <a
                href="/selection"
                className="flex items-center text-sm text-zd-white hover:text-zd-black hover:bg-zd-white transition-colors px-[5px] py-[3px] rounded-sm group"
              >
                <ArrowRight className="w-[18px] mr-[7px] group-hover:text-zd-black" />
                <span>パネル選択</span>
              </a>
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-hgap-xs">
            {/* CTA Button */}
            <a
              href="/m"
              className="zd-button-gradient px-hgap-sm py-vgap-xs rounded text-sm md:text-base whitespace-nowrap"
            >
              ケースを作る
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
