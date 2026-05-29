import type { ReactNode } from 'react';

interface ArticleContentProps {
  children: ReactNode;
}

/**
 * Article content wrapper for zfb content pages.
 *
 * Provides consistent horizontal padding and max-width centering for
 * content pages, matching the Next.js app/(content)/layout.tsx styling.
 */
export function ArticleContent({ children }: ArticleContentProps) {
  return (
    <div
      className="
        box-content mx-auto max-w-[1280px]
        px-hgap-sm md:px-hgap-md
        py-vgap-lg
        clearfix
      "
    >
      {children}
    </div>
  );
}
