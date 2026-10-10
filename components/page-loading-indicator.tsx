import { Show } from '@takazudo/zfb/zudo-react';
import type { NavigationController } from './navigation-context';
export default function PageLoadingIndicator({ navigation }: { navigation: NavigationController }) {
  return (
    <div class="h-[2px] w-full bg-zd-link/30 fixed top-0 left-0 z-50">
      <Show when={navigation.isPageLoading}>
        {() => (
          <div
            class="bg-zd-link h-full absolute left-0 w-0"
            style="animation: loading-bar 2s ease-in-out infinite"
          />
        )}
      </Show>
    </div>
  );
}
