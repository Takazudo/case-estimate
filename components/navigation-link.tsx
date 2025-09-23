'use client';

import React from 'react';
import Link from 'next/link';
import { useNavigation } from './navigation-context';

interface NavigationLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function NavigationLink({
  href,
  className,
  children,
  onClick,
}: NavigationLinkProps) {
  const { triggerNavigation } = useNavigation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Don't trigger if it's a cmd/ctrl+click (opens in new tab)
    if (e.metaKey || e.ctrlKey) return;

    // Trigger navigation immediately
    triggerNavigation(href);

    // Call any additional onClick handler
    onClick?.();
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
