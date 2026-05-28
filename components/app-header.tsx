'use client';

import { useState, useEffect } from 'react';
import ArrowRight from './icons/arrow-right';
import NavigationLink from './navigation-link';
import MobileMenuToggle from './mobile-menu-toggle';
import MobileMenuDrawer from './mobile-menu-drawer';
import BuildButton from './build-button';
import LogoLink from './logo-link';
import { NAVIGATION_ITEMS } from '@/data/navigation';

interface AppHeaderProps {
  fullWidth?: boolean;
}

interface NavItemProps {
  href: string;
  label: string;
}

function NavItem({ href, label }: NavItemProps) {
  return (
    <NavigationLink
      href={href}
      className="flex items-center text-sm text-zd-white transition-colors px-[5px] py-[3px] rounded-sm group zd-invert-color-link"
      activeClassName="pointer-events-none hover:text-zd-white hover:bg-transparent no-underline"
    >
      <ArrowRight className="w-[18px] mr-[7px] group-hover:text-zd-black relative bottom-[-2px]" />
      <span>{label}</span>
    </NavigationLink>
  );
}

export default function AppHeader({ fullWidth = false }: AppHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  // Initialise and track pathname via browser APIs (SSR-safe)
  useEffect(() => {
    setCurrentPath(window.location.pathname);

    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  // Split navigation items for desktop layout (exclude CTA)
  const desktopNavItems = NAVIGATION_ITEMS.filter((item) => item.href !== '/m');
  const firstRowItems = desktopNavItems.slice(0, 2);
  const secondRowItems = desktopNavItems.slice(2);

  useEffect(() => {
    closeMenu();
  }, [currentPath]);

  return (
    <>
      <header
        className={`
          backdrop-blur-md border-b border-dashed border-zd-gray flex-shrink-0
          font-futura
          font-semibold
          fixed top-0 left-0 right-0 z-50 bg-zd-black/70
        `}
      >
        <div
          className={`
            px-hgap-sm py-vgap-sm box-content
            ${!fullWidth ? 'max-w-[1280px] mx-auto' : ''}
          `}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <LogoLink />

            {/* Right side actions */}
            <div className="flex items-center gap-hgap-xs">
              {/* Navigation Links - Desktop */}
              <nav className="hidden lg:flex flex-col xl:flex-row gap-y-[2px] xl:gap-hgap-xs pr-[10px]">
                <div className="flex items-center gap-hgap-xs xl:gap-hgap-sm">
                  {firstRowItems.map((item) => (
                    <NavItem key={item.href} href={item.href} label={item.label} />
                  ))}
                </div>
                <div className="flex items-center gap-hgap-xs xl:gap-hgap-sm">
                  {secondRowItems.map((item) => (
                    <NavItem key={item.href} href={item.href} label={item.label} />
                  ))}
                </div>
              </nav>
              {/* CTA Button - Hidden on small (<md), visible from md and up */}
              <span className="hidden md:inline-flex">
                <BuildButton href="/m" size="md" />
              </span>
              {/* Hamburger menu - Mobile only */}
              <div className="flex items-center justify-center lg:hidden">
                <MobileMenuToggle isOpen={isMenuOpen} onToggle={toggleMenu} className="" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenuDrawer
        isOpen={isMenuOpen}
        onClose={closeMenu}
        navigationItems={NAVIGATION_ITEMS}
        currentPath={currentPath}
      />
    </>
  );
}
