import type { Child } from '@takazudo/zfb/zudo-react';

interface CodeProps {
  children: Child;
}

export function Code({ children }: CodeProps) {
  return <code class="bg-white/10 rounded px-2 py-1 text-sm font-mono text-white">{children}</code>;
}

interface PreProps {
  children: Child;
}

export function Pre({ children }: PreProps) {
  return (
    <pre class="bg-black/50 border border-white/20 rounded-lg p-hgap-sm mb-vgap-sm overflow-x-auto">
      {children}
    </pre>
  );
}
