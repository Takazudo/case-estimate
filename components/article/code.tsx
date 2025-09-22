import type { ReactNode } from 'react';

interface CodeProps {
  children: ReactNode;
}

export function Code({ children }: CodeProps) {
  return (
    <code className="bg-white/10 rounded px-2 py-1 text-sm font-mono text-white">{children}</code>
  );
}

interface PreProps {
  children: ReactNode;
}

export function Pre({ children }: PreProps) {
  return (
    <pre className="bg-black/50 border border-white/20 rounded-lg p-hgap-sm mb-vgap-sm overflow-x-auto">
      {children}
    </pre>
  );
}
