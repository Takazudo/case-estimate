import type { ReactNode } from 'react';

// Configurator layout should fill the viewport (minus the header) without scrolling
export default function ConfiguratorLayout({ children }: { children: ReactNode }) {
  return <div className="h-full overflow-hidden">{children}</div>;
}
