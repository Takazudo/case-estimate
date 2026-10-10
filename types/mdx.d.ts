declare module 'mdx/types' {
  import type { Component } from '@takazudo/zfb/zudo-react';

  export type MDXProps = {
    components?: MDXComponents;
    [key: string]: unknown;
  };

  export type MDXComponents = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: Component<any>;
  };
}

declare module '*.mdx' {
  import type { MDXProps } from 'mdx/types';
  import type { JSX } from '@takazudo/zfb/zudo-react/jsx-runtime';
  export default function MDXContent(props: MDXProps): JSX.Element;
}
