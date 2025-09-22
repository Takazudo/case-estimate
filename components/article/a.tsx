import Link from 'next/link';
import type { ReactNode } from 'react';

interface AProps {
  href?: string;
  children: ReactNode;
}

export function A({ href, children }: AProps) {
  if (!href) return <>{children}</>;

  // Internal links
  if (href.startsWith('/') || href.startsWith('#')) {
    return (
      <Link href={href} className="text-blue-400 hover:text-blue-300 underline">
        {children}
      </Link>
    );
  }

  // External links
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 hover:text-blue-300 underline"
    >
      {children}
    </a>
  );
}
