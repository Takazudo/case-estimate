'use client';

import { useEffect, useState } from 'react';

/**
 * Sanity React island for the zfb scaffold (T1).
 *
 * Purpose: confirm the published `@takazudo/zfb` binary + React hydration
 * pipeline work in THIS app. Not a real feature — T3+ replace it.
 *
 * SSR contract (mirrors the basic-blog `theme-toggle` model): server render
 * and the first client render MUST produce identical HTML. `window` does not
 * exist on the server, so we render a deterministic default and read
 * `window.location.search` inside `useEffect` (post-hydration) instead of in
 * the `useState` initialiser. A click counter proves event handlers are live.
 */
export default function SanityIsland() {
  const [count, setCount] = useState(0);
  // Deterministic SSR-safe default; the real query string is read on mount.
  const [search, setSearch] = useState('(reading on mount…)');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setSearch(window.location.search || '(none)');
  }, []);

  return (
    <div data-testid="sanity-island" className="font-noto">
      <p>
        Hydrated: <strong>{hydrated ? 'yes' : 'no'}</strong>
      </p>
      <p>
        Query string: <code className="font-mono">{search}</code>
      </p>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Clicked {count} {count === 1 ? 'time' : 'times'}
      </button>
    </div>
  );
}
