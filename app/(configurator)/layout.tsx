import type { ReactNode } from 'react';

// Configurator has its own layout without the ContentLayout wrapper
export default function ConfiguratorLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
