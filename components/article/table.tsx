import type { Child } from '@takazudo/zfb/zudo-react';

interface TableProps {
  children: Child;
}

export function Table({ children }: TableProps) {
  return (
    <div class="overflow-x-auto mb-vgap-md">
      <table class="min-w-full border-collapse">{children}</table>
    </div>
  );
}

interface THProps {
  children: Child;
}

export function TH({ children }: THProps) {
  return (
    <th class="border border-white/40 px-hgap-xs py-vgap-xs bg-white/10 text-left font-semibold text-white">
      {children}
    </th>
  );
}

interface TDProps {
  children: Child;
}

export function TD({ children }: TDProps) {
  return <td class="border border-white/40 px-hgap-xs py-vgap-xs text-white">{children}</td>;
}
