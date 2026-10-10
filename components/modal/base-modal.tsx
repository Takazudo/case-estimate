'use client';

import { computed, getScope, Show, signal, type Child } from '@takazudo/zfb/zudo-react';
import { CloseIcon } from '@/components/icons/close-icon';
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { read, type Reactive } from '@/utils/reactive';

interface BaseModalProps {
  isOpen: Reactive<boolean>;
  onClose: () => void;
  title: Reactive<string>;
  icon?: Child;
  children: Child;
  ariaLabelledBy?: string;
}

export function BaseModal({
  isOpen,
  onClose,
  title,
  icon,
  children,
  ariaLabelledBy = 'base-modal-title',
}: BaseModalProps) {
  const shouldRender = signal(false);
  const open = computed(() => read(isOpen));
  useLockBodyScroll(open);
  const { containerRef } = useFocusTrap({ isActive: open });
  getScope().effect(() => {
    if (open.value) {
      shouldRender.value = true;
      return;
    }
    if (!shouldRender.value) return;
    const timer = window.setTimeout(() => {
      shouldRender.value = false;
    }, 300);
    return () => window.clearTimeout(timer);
  });
  getScope().effect(() => {
    if (!open.value) return;
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', keydown);
    return () => document.removeEventListener('keydown', keydown);
  });
  return (
    <Show when={shouldRender}>
      {() => (
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={ariaLabelledBy}
          class={computed(
            () =>
              `fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 bg-zd-black/70 ${open.value ? 'opacity-100' : 'opacity-0'}`,
          )}
          on:click={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <div
            class={computed(
              () =>
                `relative bg-zd-black shadow-xl border border-zd-white w-full md:w-[90vw] max-w-[1400px] h-full md:h-[85vh] overflow-hidden transition-transform duration-300 ${open.value ? 'scale-100' : 'scale-95'}`,
            )}
          >
            <div class="px-hgap-sm py-vgap-sm md:px-hgap-md md:py-vgap-md flex items-center justify-between border-b border-zd-white">
              <h2
                id={ariaLabelledBy}
                class="font-bold text-zd-white flex items-baseline gap-hgap-xs"
              >
                {icon}
                <span class="text-base lg:text-xl">{computed(() => read(title))}</span>
              </h2>
              <button
                on:click={onClose}
                class="text-zd-white zd-invert-color-link"
                aria-label="Close modal"
              >
                <CloseIcon className="w-[30px] md:w-[44px] aspect-square" />
              </button>
            </div>
            <div class="overflow-y-auto h-[calc(100%-80px)] px-hgap-md pt-vgap-md pb-[100px]">
              {children}
            </div>
          </div>
        </div>
      )}
    </Show>
  );
}
