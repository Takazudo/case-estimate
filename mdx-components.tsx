import type { MDXComponents } from 'mdx/types';

// Import all article components
import { H1 } from './components/article/h1';
import { H2 } from './components/article/h2';
import { H3 } from './components/article/h3';
import { P } from './components/article/p';
import { A } from './components/article/a';
import { UL } from './components/article/ul';
import { OL } from './components/article/ol';
import { Table, TH, TD } from './components/article/table';
import { Blockquote } from './components/article/blockquote';
import { Code, Pre } from './components/article/code';
import { HR } from './components/article/hr';
import { Strong } from './components/article/strong';
import { ImgFloatRight } from './components/article/img-float-right';
import ModelSection from './components/model-section';
import ModelSectionGallery from './components/model-section-gallery';
import ModelSectionBody from './components/model-section-body';
import ModelGallery from './components/model-gallery';

// This file is required for MDX support in Next.js App Router
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings
    h1: H1,
    h2: H2,
    h3: H3,
    // Text
    p: P,
    a: A,
    strong: Strong,
    // Lists
    ul: UL,
    ol: OL,
    // Table
    table: Table,
    th: TH,
    td: TD,
    // Other elements
    blockquote: Blockquote,
    code: Code,
    pre: Pre,
    hr: HR,
    // Custom components
    ImgFloatRight,
    ModelSection,
    ModelSectionGallery,
    ModelSectionBody,
    ModelGallery,
    // Pass through any additional components
    ...components,
  };
}
