import { computed, getScope, Show } from '@takazudo/zfb/zudo-react';
import type { Child } from '@takazudo/zfb/zudo-react';
import type { Reactive } from '@/utils/reactive';
import { read } from '@/utils/reactive';
import { useGalleryKeyboardNavigation } from '@/hooks/use-gallery-keyboard-navigation';
import { useGalleryDialog } from '@/hooks/use-gallery-dialog';
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll';

interface BaseImageDialogProps {
  testId: string;
  dialogId: string;
  currentSlug: Reactive<string>;
  imageUrl: Reactive<string>;
  imageAlt: Reactive<string>;
  getImageUrl: (slug: string) => string;
  slugsToPreload: Reactive<string[]>;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: Reactive<boolean>;
  hasNext?: Reactive<boolean>;
  additionalContent?: Child;
  screenReaderDescription?: Reactive<string>;
}

export default function BaseImageDialog({
  testId,
  dialogId,
  currentSlug,
  imageUrl,
  imageAlt,
  getImageUrl,
  slugsToPreload,
  onClose,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  additionalContent,
  screenReaderDescription = 'Use the arrow keys to move through images. Press Escape to close.',
}: BaseImageDialogProps) {
  useLockBodyScroll(true);
  const dialogRef: { current: HTMLDialogElement | null } = { current: null };
  const image = useGalleryDialog({ currentSlug, getImageUrl, slugsToPreload });
  const titleId = `${dialogId}-title`;
  const descriptionId = `${dialogId}-description`;
  const previous = computed(() => read(hasPrevious) && Boolean(onPrevious));
  const next = computed(() => read(hasNext) && Boolean(onNext));
  useGalleryKeyboardNavigation({
    isActive: true,
    onClose,
    onPrevious: () => {
      if (previous.value) onPrevious?.();
    },
    onNext: () => {
      if (next.value) onNext?.();
    },
  });
  getScope().onActivate(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const priorFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!dialog.open) dialog.showModal();
    dialog.querySelector<HTMLButtonElement>('[data-dialog-close]')?.focus();
    return () => {
      if (dialog.open) dialog.close();
      priorFocus?.focus();
    };
  });
  const backdropClick = (event: MouseEvent) => {
    if (event.target === dialogRef.current) onClose();
  };
  return (
    <dialog
      ref={dialogRef}
      data-testid={testId}
      id={dialogId}
      class="fixed inset-0 z-[60] m-0 max-h-screen h-screen max-w-screen w-screen bg-transparent p-0 backdrop:bg-zd-black/70"
      on:click={backdropClick}
      on:cancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div
        class="relative flex h-full w-full items-center justify-center"
        on:click={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <button
          data-dialog-close=""
          data-testid={`${testId}-close`}
          on:click={onClose}
          class="fixed top-4 right-4 z-[100] p-2 text-white hover:text-gray-300 transition-colors"
          aria-label="Close dialog"
        >
          <svg
            viewBox="0 0 24 24"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
        <Show when={previous}>
          {() => (
            <button
              data-testid={`${testId}-prev`}
              on:click={() => onPrevious?.()}
              class="fixed left-[10px] top-[50vh] z-[100] -translate-y-1/2 rounded-full text-white backdrop-blur transition-colors hover:bg-white/20 p-[10px]"
              aria-label="Previous image"
            >
              <span aria-hidden="true" class="text-5xl">
                ‹
              </span>
            </button>
          )}
        </Show>
        <Show when={next}>
          {() => (
            <button
              data-testid={`${testId}-next`}
              on:click={() => onNext?.()}
              class="fixed right-[10px] top-[50vh] z-[100] -translate-y-1/2 rounded-full text-white backdrop-blur transition-colors hover:bg-white/20 p-[10px]"
              aria-label="Next image"
            >
              <span aria-hidden="true" class="text-5xl">
                ›
              </span>
            </button>
          )}
        </Show>
        <h2 id={titleId} class="sr-only">
          {imageAlt}
        </h2>
        <p id={descriptionId} class="sr-only">
          {screenReaderDescription}
        </p>
        <div
          class="relative flex h-full w-full items-center justify-center"
          on:click={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <Show when={image.isLoading}>
            {() => (
              <div class="absolute inset-0 flex items-center justify-center z-20">
                <div class="loader" />
              </div>
            )}
          </Show>
          <img
            ref={image.imageRef}
            src={imageUrl}
            alt={imageAlt}
            class="relative max-h-[95vh] max-w-[calc(100vw-200px)] object-contain transition-opacity duration-300 border border-zd-white"
            on:load={image.handleImageLoad}
            on:error={image.handleImageError}
            style={computed(() => ({ opacity: image.imageLoaded.value ? 1 : 0 }))}
            aria-busy={computed(() => !image.imageLoaded.value && !image.imageError.value)}
          />
          <Show when={image.imageError}>
            {() => (
              <div
                role="alert"
                class="absolute inset-0 flex items-center justify-center bg-black/80 px-4 text-center text-sm text-gray-200"
              >
                Unable to load this image. Please try another item.
              </div>
            )}
          </Show>
        </div>
        {additionalContent}
      </div>
    </dialog>
  );
}
