import { computed } from '@takazudo/zfb/zudo-react';
import { read, type Reactive } from '@/utils/reactive';
interface Props {
  isOpen: Reactive<boolean>;
  onToggle: () => void;
  className?: string;
  'aria-label'?: string;
}
export default function MobileMenuToggle({
  isOpen,
  onToggle,
  className = '',
  'aria-label': ariaLabel,
}: Props) {
  const label = computed(() => (read(isOpen) ? 'Close menu' : 'Open menu'));
  const top = computed(
    () =>
      `absolute h-[2px] w-[28px] transform bg-current transition-all duration-300 ease-in-out ${read(isOpen) ? 'translate-y-0 rotate-45' : '-translate-y-[8px]'}`,
  );
  const middle = computed(
    () =>
      `absolute h-[2px] w-[28px] transform bg-current transition-all duration-300 ease-in-out ${read(isOpen) ? 'scale-0 opacity-0' : ''}`,
  );
  const bottom = computed(
    () =>
      `absolute h-[2px] w-[28px] transform bg-current transition-all duration-300 ease-in-out ${read(isOpen) ? 'translate-y-0 -rotate-45' : 'translate-y-[8px]'}`,
  );
  return (
    <button
      type="button"
      on:click={onToggle}
      class={`zd-invert-color-link cursor-pointer relative z-50 flex w-[40px] h-[40px] flex-col items-center justify-center focus:outline-none text-zd-white ${className}`}
      aria-expanded={isOpen}
      aria-label={ariaLabel || 'Toggle menu'}
    >
      <span class="sr-only">{label}</span>
      <div class="relative flex h-[20px] w-[28px] flex-col items-center justify-center">
        <span class={top} />
        <span class={middle} />
        <span class={bottom} />
      </div>
    </button>
  );
}
