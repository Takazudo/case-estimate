'use client';

import React from 'react';

interface ModelSectionGalleryProps {
  children: React.ReactNode;
}

/**
 * ModelSectionGallery - Left column wrapper for gallery content
 *
 * Wraps the gallery component in the left column of ModelSection.
 * On mobile, this will appear first (above the body content).
 * On desktop (lg:), this will be the left column.
 *
 * Usage:
 * <ModelSection>
 *   <ModelSectionGallery>
 *     <ModelGallery main="slug" subs={["slug1", "slug2"]} />
 *   </ModelSectionGallery>
 *   <ModelSectionBody>...</ModelSectionBody>
 * </ModelSection>
 */
export default function ModelSectionGallery({ children }: ModelSectionGalleryProps) {
  return (
    <div className="w-full">
      {/* Sticky positioning on desktop for better UX while scrolling */}
      <div className="lg:sticky lg:top-24">{children}</div>
    </div>
  );
}
