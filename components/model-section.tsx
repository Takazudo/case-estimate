'use client';

import React from 'react';

interface ModelSectionProps {
  children: React.ReactNode;
}

/**
 * ModelSection - Layout container for case model documentation
 *
 * Provides a responsive 2-column layout:
 * - Mobile: Stacked vertically
 * - Desktop (lg:): Side-by-side with gallery on left, content on right
 *
 * Usage:
 * <ModelSection>
 *   <ModelSectionGallery>...</ModelSectionGallery>
 *   <ModelSectionBody>...</ModelSectionBody>
 * </ModelSection>
 */
export default function ModelSection({ children }: ModelSectionProps) {
  return (
    <div className="w-full">
      {/* Responsive grid: stacked on mobile, 2 columns on lg: breakpoint */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">{children}</div>
    </div>
  );
}
