import { getScope } from '@takazudo/zfb/zudo-react';
import type { ReadonlySignal } from '@takazudo/zfb/zudo-react';
import { encodeCase, encodePanelColors } from '@/utils/url-encoder';
import type { PanelColorIds } from '@/types';

interface UseUrlPersistenceProps {
  selectedCase: ReadonlySignal<string | null>;
  panelColorIds: ReadonlySignal<PanelColorIds>;
}

export function useUrlPersistence({ selectedCase, panelColorIds }: UseUrlPersistenceProps) {
  getScope().effect(() => {
    const caseType = selectedCase.value;
    const colorIds = panelColorIds.value;
    if (!caseType || !window.location.pathname.startsWith('/m')) return;
    const params = new URLSearchParams();
    params.set('c', encodeCase(caseType));
    const encoded = encodePanelColors(colorIds);
    if (encoded) params.set('p', encoded);
    const pathname = window.location.pathname;
    window.history.replaceState(window.history.state, '', `${pathname}?${params}`);
  });
}
