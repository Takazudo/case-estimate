/**
 * MDX component map for zfb content pages (T4).
 *
 * Maps HTML elements to styled article/* components and wires in
 * interactive island components referenced by name in MDX bodies.
 *
 * Usage in page files:
 *   import { contentComponents } from './_mdx-components';
 *   <entry.Content components={contentComponents} />
 *
 * The underscore prefix signals to zfb's page-route scanner that this
 * is a shared module, not a page route (following the same convention
 * as Next.js's _app.tsx / _mdx-components.tsx).
 *
 * Interactive ('use client') components are wrapped with <Island when="load">
 * so the built HTML emits data-zfb-island markers and the runtime hydrates
 * them on page load via react-dom/client. The Island wrapper is transparent
 * to the MDX body — components are referenced by name as usual.
 */

import { Island } from '@takazudo/zfb';
import type { ComponentPropsWithoutRef } from 'react';

// Article element overrides
import { H1 } from '@/components/article/h1';
import { H2 } from '@/components/article/h2';
import { H3 } from '@/components/article/h3';
import { P } from '@/components/article/p';
import { A } from '@/components/article/a';
import { UL } from '@/components/article/ul';
import { OL } from '@/components/article/ol';
import { Table, TH, TD } from '@/components/article/table';
import { Blockquote } from '@/components/article/blockquote';
import { Code, Pre } from '@/components/article/code';
import { HR } from '@/components/article/hr';
import { Strong } from '@/components/article/strong';

// Custom MDX inline components — interactive ones need Island wrappers
import { ImgFloatRight } from '@/components/article/img-float-right';
import { PromoText } from '@/components/article/promo-text';
import ModelSection from '@/components/model-section';
import ModelSectionGallery from '@/components/model-section-gallery';
import ModelSectionBody from '@/components/model-section-body';
import ModelGallery from '@/components/model-gallery';
import BuilderNav from '@/components/builder-nav';
import { CaseModelsToc } from '@/components/case-models-toc';
import { PriceTable } from '@/components/price-table';
import TopNavGrid from '@/components/top-nav-grid';
import { AcrylicPanelList } from '~/components/panel-acrylic-list';
import { PrintedPanelList } from '~/components/panel-printed-list';

// Island wrappers for interactive ('use client') components.
// These emit data-zfb-island markers in built HTML and hydrate on page load.

function TopNavGridIsland(props: ComponentPropsWithoutRef<typeof TopNavGrid>) {
  return (
    <Island when="load">
      <TopNavGrid {...props} />
    </Island>
  );
}

function ModelGalleryIsland(props: ComponentPropsWithoutRef<typeof ModelGallery>) {
  return (
    <Island when="visible">
      <ModelGallery {...props} />
    </Island>
  );
}

function ImgFloatRightIsland(props: ComponentPropsWithoutRef<typeof ImgFloatRight>) {
  return (
    <Island when="visible">
      <ImgFloatRight {...props} />
    </Island>
  );
}

function AcrylicPanelListIsland(props: ComponentPropsWithoutRef<typeof AcrylicPanelList>) {
  return (
    <Island when="visible">
      <AcrylicPanelList {...props} />
    </Island>
  );
}

function PrintedPanelListIsland(props: ComponentPropsWithoutRef<typeof PrintedPanelList>) {
  return (
    <Island when="visible">
      <PrintedPanelList {...props} />
    </Island>
  );
}

export const contentComponents = {
  // HTML element overrides
  h1: H1,
  h2: H2,
  h3: H3,
  p: P,
  a: A,
  strong: Strong,
  ul: UL,
  ol: OL,
  table: Table,
  th: TH,
  td: TD,
  blockquote: Blockquote,
  code: Code,
  pre: Pre,
  hr: HR,

  // Named components referenced inline in MDX bodies.
  // Static (no 'use client') — render as-is:
  PromoText,
  ModelSection,
  ModelSectionGallery,
  ModelSectionBody,
  BuilderNav,
  CaseModelsToc,
  PriceTable,
  // H2 is also used directly as <H2 id="..."> in case-models page
  H2,

  // Interactive ('use client') components wrapped with Island to ensure
  // data-zfb-island markers are emitted and client hydration occurs:
  TopNavGrid: TopNavGridIsland,
  ModelGallery: ModelGalleryIsland,
  ImgFloatRight: ImgFloatRightIsland,
  AcrylicPanelList: AcrylicPanelListIsland,
  PrintedPanelList: PrintedPanelListIsland,
};
