/**
 * Normalize a URL pathname for equality comparison against slash-free route
 * literals (e.g. '/m') and nav hrefs.
 *
 * Netlify "Pretty URLs" 301-redirects content routes to a trailing slash in
 * production (e.g. `/gallery` -> `/gallery/`), so after hydration
 * `window.location.pathname` carries a trailing slash while SSR-passed paths
 * and nav hrefs do not. Exact-equality comparisons then silently break
 * post-hydration (active-nav highlight, /m full-width layout, PWA header-hide).
 * Local zfb preview does not 301, so tests miss it.
 *
 * Stripping a single trailing slash (except for the root '/') makes both
 * redirect directions compare equal as long as both sides are normalized.
 */
export function normalizePath(pathname: string): string {
  if (pathname !== '/' && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}
