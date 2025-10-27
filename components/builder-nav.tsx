import BuildButton from './build-button';

interface BuilderNavItem {
  href: string;
  label: string;
}

interface BuilderNavProps {
  items: BuilderNavItem[];
}

export default function BuilderNav({ items }: BuilderNavProps) {
  return (
    <nav className="pt-vgap-md">
      <ul className="flex flex-col gap-vgap-xs border-t border-zd-gray border-dashed pt-vgap-md">
        {items.map((item) => (
          <li key={item.href}>
            <div className="inline-flex items-center gap-hgap-xs group zd-invert-color-link">
              <BuildButton href={item.href} size="sm" />
              <span className="underline">{item.label}</span>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}
