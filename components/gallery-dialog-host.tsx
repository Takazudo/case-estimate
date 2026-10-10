'use client';

import { computed, getScope, Show, signal } from '@takazudo/zfb/zudo-react';
import GalleryDialog from '@/components/gallery-dialog';

export default function GalleryDialogHost() {
  const selectedId = signal<string | null>(null);
  getScope().onActivate(() => {
    const readId = () => {
      selectedId.value = new URLSearchParams(window.location.search).get('id');
    };
    const pushState = history.pushState;
    const replaceState = history.replaceState;
    const emit = () => window.dispatchEvent(new Event('locationchange'));
    history.pushState = function (...args) {
      pushState.apply(this, args);
      emit();
    };
    history.replaceState = function (...args) {
      replaceState.apply(this, args);
      emit();
    };
    window.addEventListener('locationchange', readId);
    window.addEventListener('popstate', readId);
    readId();
    return () => {
      window.removeEventListener('locationchange', readId);
      window.removeEventListener('popstate', readId);
      history.pushState = pushState;
      history.replaceState = replaceState;
    };
  });
  return (
    <Show when={computed(() => Boolean(selectedId.value))}>
      {() => <GalleryDialog slug={computed(() => selectedId.value || '')} />}
    </Show>
  );
}
