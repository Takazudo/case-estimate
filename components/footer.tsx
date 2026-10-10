import NavigationLink from '@/components/navigation-link';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { ArrowUpIcon } from '@/components/icons/arrow-up-icon';
import type { NavigationController } from './navigation-context';

export default function Footer({ navigation }: { navigation?: NavigationController }) {
  const scrollToTop = useScrollToTop();
  return (
    <footer class="w-full pb-8 px-hgap-md border-t border-dashed border-zd-gray">
      <div class="max-w-[1280px] mx-auto">
        <div class="pt-8 flex items-center justify-between">
          <nav>
            <ul class="flex flex-col md:flex-row gap-x-4 gap-y-2">
              <li class="whitespace-nowrap">
                <NavigationLink
                  href="/"
                  navigation={navigation}
                  className="text-zd-white hover:text-zd-gray transition-colors"
                >
                  takazudomodular.com
                </NavigationLink>
              </li>
            </ul>
          </nav>
          <button
            class="flex items-center text-zd-white hover:text-zd-gray transition-colors group"
            on:click={scrollToTop}
            aria-label="ページの先頭へ"
          >
            <span class="underline mr-2 hidden sm:block">ページの先頭へ</span>
            <ArrowUpIcon className="h-10 w-10 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
