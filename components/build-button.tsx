import Link from 'next/link';
import { TakazudoLogoSmall } from '@/components/icons/takazudo-logo-small';

interface BuildButtonProps {
  href: string;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Reusable "Build!" call-to-action button with Takazudo Modular logo icon
 * Used in header navigation and builder navigation lists
 *
 * @param href - Destination URL (typically '/m' for case builder)
 * @param size - Button size variant: 'sm' for lists, 'md' for header
 * @param className - Additional Tailwind classes for layout/visibility control
 */
export default function BuildButton({ href, size = 'md', className = '' }: BuildButtonProps) {
  const sizeClasses = {
    sm: 'gap-[6px] px-hgap-xs pt-[1px] pb-[4px] text-sm md:text-base',
    md: 'gap-[6px] px-hgap-sm py-vgap-xs text-sm lg:text-base',
  };

  const iconSizes = {
    sm: 'w-[28px] h-[28px]',
    md: 'w-[34px] h-[34px]',
  };

  return (
    <Link
      href={href}
      className={`inline-flex items-center ${sizeClasses[size]} rounded text-zd-white whitespace-nowrap zd-button-gradient transition-all no-underline ${className}`}
    >
      <TakazudoLogoSmall className={`${iconSizes[size]} flex-shrink-0`} fill="white" />
      <span className="font-medium no-underline pt-[.1em]">Build!</span>
    </Link>
  );
}
