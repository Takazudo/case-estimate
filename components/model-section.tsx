'use client';

import React from 'react';
import { H2 } from './article/h2';

interface ModelSectionProps {
  children: React.ReactNode;
  heading?: string;
  id?: string;
}

/**
 * ModelSection - Layout container for case model documentation
 *
 * Provides a responsive grid layout:
 * - Mobile: H2 → Gallery → Content (vertical stack)
 * - Desktop (lg:): Gallery (left, spanning 2 rows) → H2 (top right) → Content (bottom right)
 *
 * Usage:
 * <ModelSection heading="zudo-block-60-open">
 *   <ModelSectionGallery>...</ModelSectionGallery>
 *   <ModelSectionBody>...</ModelSectionBody>
 * </ModelSection>
 */
export default function ModelSection({ children, heading, id }: ModelSectionProps) {
  // Filter out whitespace and only keep actual React elements
  const childrenArray = React.Children.toArray(children).filter((child) =>
    React.isValidElement(child),
  );

  const [gallery, body] = childrenArray;

  return (
    <div className="2xl:mx-[-100px]">
      {/*
        Grid layout:
        Mobile: single column (H2, Gallery, Body stacked vertically)
        Desktop: 2 columns with Gallery spanning 2 rows on the left
      */}
      <div className="grid gap-x-hgap-lg grid-cols-1 lg:grid-cols-[400px_1fr] xl:grid-cols-[500px_1fr] lg:[grid-template-rows:auto_1fr]">
        {/* H2: Mobile first row, Desktop right column first row */}
        {heading && (
          <div className="lg:col-start-2 lg:row-start-1">
            <H2 id={id}>{heading}</H2>
          </div>
        )}

        {/* Gallery: Mobile second row, Desktop left column spanning 2 rows */}
        <div className="lg:col-start-1 lg:row-start-1 lg:row-span-2 pb-vgap-lg lg:pb-vgap-xl">
          {gallery}
        </div>

        {/* Body: Mobile third row, Desktop right column second row */}
        <div className="lg:col-start-2 lg:row-start-2 pb-vgap-xl">{body}</div>
      </div>
    </div>
  );
}
