'use client';

import React, { useEffect, useState } from 'react';
import { useNavigation } from './navigation-context';

interface NavigationLinkProps {
  href: string;
  className?: string;
  activeClassName?: string;
  children: React.ReactNode;
  onClick?: () => void;
  /** Current path for active-state detection. When omitted, read from window.location.pathname at mount. */
  currentPath?: string;
}

export default function NavigationLink({
  href,
  className,
  activeClassName,
  children,
  onClick,
  currentPath,
}: NavigationLinkProps) {
  const { triggerNavigation } = useNavigation();
  const [resolvedPath, setResolvedPath] = useState(currentPath ?? '');

  useEffect(() => {
    if (currentPath !== undefined) {
      // Prop-driven: use whatever the parent passed in
      setResolvedPath(currentPath);
    } else {
      // Fallback: read from browser at mount (SSR-safe, minor active-state flash is acceptable)
      setResolvedPath(window.location.pathname);
    }
  }, [currentPath]);

  const isActive = resolvedPath === href;

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
    <a
      href={href}
      className={combinedClassName}
      onClick={handleClick}
      tabIndex={isActive ? -1 : 0}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </a>
  );
}
