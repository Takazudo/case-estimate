import type { Child } from '@takazudo/zfb/zudo-react';

interface AProps {
  href?: string;
  children: Child;
}

export function A({ href, children }: AProps) {
  if (!href) return <>{children}</>;

  // Internal links
  if (href.startsWith('/') || href.startsWith('#')) {
    return (
      <a href={href} class="zd-invert-color-link">
        {children}
      </a>
    );
  }

  // External links
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" class="zd-invert-color-link">
      {children}
    </a>
  );
}
