'use client';

import Footer from '@/components/footer';
import { NavigationProvider } from '@/components/navigation-context';

/**
 * Site footer island for the zfb build.
 *
 * Wraps Footer inside its own NavigationProvider because Footer contains
 * NavigationLink which calls useNavigation(). Context does not cross island
 * boundaries — each island is an independent hydration root. The footer island
 * is intentionally separate from the header island so footer hydration can be
 * deferred (when="visible") while the header hydrates immediately.
 */
export default function SiteFooter() {
  return (
    <NavigationProvider>
      <Footer />
    </NavigationProvider>
  );
}
