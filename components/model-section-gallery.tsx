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
  // same pad top as H2
  return <div className="md:pt-vgap-sm lg:pt-vgap-lg 2xl:ml-[-60px]">{children}</div>;
}
