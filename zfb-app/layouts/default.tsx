import type { ReactNode } from 'react';

import '../styles/global.css';

type Props = {
  title?: string;
  children: ReactNode;
};

/**
 * Minimal shared layout for the zfb scaffold (T1).
 *
 * Intentionally bare — full chrome (PersistentHeader, navigation, page
 * transitions, etc.) is ported by T3. This establishes the html/head/body
 * shell and pulls in the global stylesheet so every page renders through one
 * place.
 */
export default function DefaultLayout({ title = 'Takazudo Modular: Panels', children }: Props) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
      </head>
      <body className="font-noto">
        <main>{children}</main>
      </body>
    </html>
  );
}
