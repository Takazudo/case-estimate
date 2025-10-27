'use client';

import React from 'react';

interface ModelSectionBodyProps {
  children: React.ReactNode;
}

/**
 * ModelSectionBody - Right column wrapper for text content
 *
 * Wraps the text/documentation content in the right column of ModelSection.
 * On mobile, this will appear second (below the gallery).
 * On desktop (lg:), this will be the right column.
 *
 * Usage:
 * <ModelSection>
 *   <ModelSectionGallery>...</ModelSectionGallery>
 *   <ModelSectionBody>
 *     <h2>Model Details</h2>
 *     <p>Description...</p>
 *   </ModelSectionBody>
 * </ModelSection>
 */
export default function ModelSectionBody({ children }: ModelSectionBodyProps) {
  return (
    <div className="w-full">
      {/* Prose styling for better readability of documentation content */}
      <div className="prose prose-gray dark:prose-invert max-w-none">{children}</div>
    </div>
  );
}
