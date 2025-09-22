import type { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
}

export function Table({ children }: TableProps) {
  return (
    <div className="overflow-x-auto mb-vgap-md">
      <table className="min-w-full border-collapse">{children}</table>
    </div>
  );
}

interface THProps {
  children: ReactNode;
}

export function TH({ children }: THProps) {
  return (
    <th className="border border-white/40 px-hgap-xs py-vgap-xs bg-white/10 text-left font-semibold text-white">
      {children}
    </th>
  );
}

interface TDProps {
  children: ReactNode;
}

export function TD({ children }: TDProps) {
  return <td className="border border-white/40 px-hgap-xs py-vgap-xs text-white">{children}</td>;
}
