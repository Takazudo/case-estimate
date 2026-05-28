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
      <a href={href} className="zd-invert-color-link">
        {children}
      </a>
    );
  }

  // External links
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="zd-invert-color-link">
      {children}
    </a>
  );
}
