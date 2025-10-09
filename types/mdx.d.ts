declare module 'mdx/types' {
  import type { ComponentType } from 'react';

  export type MDXProps = {
    components?: MDXComponents;
    [key: string]: unknown;
  };

  export type MDXComponents = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: ComponentType<any>;
  };
}

declare module '*.mdx' {
  import type { MDXProps } from 'mdx/types';
  import type { JSX } from 'react';
  export default function MDXContent(props: MDXProps): JSX.Element;
}
