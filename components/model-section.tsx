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
  // Filter out whitespace and only keep actual React elements
  const childrenArray = React.Children.toArray(children).filter((child) =>
    React.isValidElement(child),
  );

  return (
    <div className="2xl:-mx-hgap-md">
      {/* Responsive layout: stacked on mobile, 2 columns on lg: breakpoint (500px left, rest for right) */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="w-full lg:w-[400px] xl:w-[500px] flex-shrink-0">{childrenArray[0]}</div>
        <div className="w-full lg:flex-1">{childrenArray[1]}</div>
      </div>
    </div>
  );
}
