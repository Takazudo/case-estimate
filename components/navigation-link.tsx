'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavigation } from './navigation-context';

interface NavigationLinkProps {
  href: string;
  className?: string;
  activeClassName?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function NavigationLink({
  href,
  className,
  activeClassName,
  children,
  onClick,
}: NavigationLinkProps) {
  const { triggerNavigation } = useNavigation();
  const pathname = usePathname();
  const isActive = pathname === href;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Don't trigger if it's a cmd/ctrl+click (opens in new tab)
    if (e.metaKey || e.ctrlKey) return;

    // Prevent navigation if link is active
    if (isActive) {
      e.preventDefault();
      return;
    }

    // Trigger navigation immediately
    triggerNavigation(href);

    // Call any additional onClick handler
    onClick?.();
  };

  const combinedClassName =
    isActive && activeClassName ? `${className} ${activeClassName}` : className;

  return (
    <Link
      href={href}
      className={combinedClassName}
      onClick={handleClick}
      tabIndex={isActive ? -1 : 0}
      aria-current={isActive ? 'page' : undefined}
      prefetch={false}
    >
      {children}
    </Link>
  );
}
