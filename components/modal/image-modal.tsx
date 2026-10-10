'use client';

import { computed, getScope, Show, signal } from '@takazudo/zfb/zudo-react';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll';
import { CloseIcon } from '@/components/icons/close-icon';
import { read, type Reactive } from '@/utils/reactive';

interface ImageModalProps {
  isOpen: Reactive<boolean>;
  imageUrl: Reactive<string>;
  imageAlt: Reactive<string>;
  onClose: () => void;
}
export function ImageModal({ isOpen, imageUrl, imageAlt, onClose }: ImageModalProps) {
  const open = computed(() => read(isOpen));
  const shouldRender = signal(false);
  const isLoading = signal(false);
  const imageLoaded = signal(false);
  const { containerRef } = useFocusTrap({ isActive: open });
  useLockBodyScroll(open);
  getScope().effect(() => {
    const visible = open.value;
    read(imageUrl);
    if (visible) {
      shouldRender.value = true;
      isLoading.value = true;
      imageLoaded.value = false;
      return;
    }
    if (!shouldRender.value) return;
    imageLoaded.value = false;
    const timer = setTimeout(() => {
      shouldRender.value = false;
      isLoading.value = false;
    }, 300);
    return () => clearTimeout(timer);
  });
  getScope().effect(() => {
    if (!open.value) return;
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  });
  return (
    <Show when={shouldRender}>
      {() => (
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          class={computed(
            () =>
              `fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 bg-zd-black/70 ${open.value ? 'opacity-100' : 'opacity-0'}`,
          )}
          on:click={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <div class="relative w-full h-full flex items-center justify-center p-[10px] md:p-[15px] lg:p-[20px]">
            <button
              on:click={onClose}
              class="absolute top-4 right-4 z-10 p-2 text-white hover:text-gray-300 transition-colors"
              aria-label="Close modal"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
            <Show when={isLoading}>
              {() => (
                <div class="absolute inset-0 flex items-center justify-center z-20">
                  <div class="loader" />
                </div>
              )}
            </Show>
            <Show when={computed(() => !!read(imageUrl))}>
              {() => (
                <img
                  id="modal-description"
                  src={computed(() => read(imageUrl))}
                  alt={computed(() => read(imageAlt))}
                  class={computed(
                    () =>
                      `max-w-full max-h-full object-contain bg-white rounded-lg transition-opacity duration-300 ease-in-out ${imageLoaded.value ? 'opacity-100' : 'opacity-0'}`,
                  )}
                  style={computed(() => ({ display: isLoading.value ? 'none' : 'block' }))}
                  on:load={() => {
                    isLoading.value = false;
                    imageLoaded.value = true;
                  }}
                  on:error={() => {
                    isLoading.value = false;
                    imageLoaded.value = true;
                  }}
                />
              )}
            </Show>
            <h2 id="modal-title" class="sr-only">
              {computed(() => `${read(imageAlt)} - Enlarged Image`)}
            </h2>
          </div>
        </div>
      )}
    </Show>
  );
}
