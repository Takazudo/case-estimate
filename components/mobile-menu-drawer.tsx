'use client';

import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Dialog, DialogPanel } from '@headlessui/react';
import NavigationLink from './navigation-link';
import { useLockBodyScroll } from '../hooks/use-lock-body-scroll';
import { useFocusTrap } from '../hooks/use-focus-trap';
import ArrowRight from './icons/arrow-right';
import MobileMenuToggle from './mobile-menu-toggle';

interface NavItem {
  href: string;
  label: string;
}

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavItem[];
  currentPath: string;
}

const MenuItemContent: React.FC<{
  item: NavItem;
  currentPath: string;
  onClose: () => void;
}> = ({ item, onClose }) => {
  return (
    <NavigationLink
      href={item.href}
      className={`
        flex items-center gap-1
        px-hgap-sm py-vgap-xs
        text-sm text-zd-white
        transition-colors hover:bg-zd-gray/30
      `}
      activeClassName="pointer-events-none no-underline"
      onClick={onClose}
    >
      <span className="w-[18px] h-[18px] flex-shrink-0 pr-[7px] pt-[3px]">
        <ArrowRight className="w-full h-full" />
      </span>
      <span className="flex-1 pr-2 break-keep">{item.label}</span>
    </NavigationLink>
  );
};

const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  onClose,
  navigationItems,
  currentPath,
}) => {
  const portalRoot = useRef<HTMLElement | null>(null);

  useLockBodyScroll(isOpen);

  const { containerRef } = useFocusTrap({
    isActive: isOpen,
    autoFocus: true,
    returnFocusOnDeactivate: true,
    onClose,
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      portalRoot.current = document.body;
    }
    return undefined;
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
    return undefined;
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath]);

  if (!portalRoot.current) return null;

  return ReactDOM.createPortal(
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      <div className="fixed right-0 top-0 h-full w-full bg-zd-black shadow-xl">
        <DialogPanel ref={containerRef} className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-dashed border-zd-gray px-hgap-sm py-vgap-sm">
            <NavigationLink
              href="/"
              className="text-xl font-bold text-zd-white no-underline zd-invert-color-link"
              activeClassName="pointer-events-none"
              onClick={onClose}
            >
              Takazudo Modular
            </NavigationLink>
            <MobileMenuToggle isOpen={true} onToggle={onClose} aria-label="メニューを閉じる" />
          </div>

          <nav
            className="flex-1 overflow-y-auto"
            role="navigation"
            aria-label="メインナビゲーション"
          >
            <ul className="py-vgap-sm px-[3px]">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <MenuItemContent item={item} currentPath={currentPath} onClose={onClose} />
                </li>
              ))}
            </ul>
          </nav>
        </DialogPanel>
      </div>
    </Dialog>,
    portalRoot.current,
  );
};

export default MobileMenuDrawer;
